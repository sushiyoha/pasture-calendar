import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';

// 获取本地指纹
const getGuestId = () => {
  let id = localStorage.getItem('calendar_guest_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('calendar_guest_id', id);
  }
  return id;
};

export const taskService = {
  // --- 新增：Auth 相关 ---
  
  // 获取当前用户（用于检查是否登录）
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // 核心功能：数据“过户” (Migration)
  migrateGuestData: async () => {
    const guestId = getGuestId();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return; // 没登录就不处理

    // 调用我们在 SQL 里写的那个函数 rpc('link_guest_data')
    const { error } = await supabase.rpc('link_guest_data', {
      guest_id_input: guestId
    });

    if (error) console.error("数据迁移失败:", error);
    else console.log("数据迁移成功！羊群已归位。");
  },

  // --- 修改：数据操作 ---

  fetchAll: async () => {
    const guestId = getGuestId();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from('tasks').select('*');

    // 逻辑：如果登录了，只查 user_id；如果没登录，只查 guest_id
    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      query = query.eq('guest_id', guestId).is('user_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // 数据转换
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      completed: item.is_completed,
      createdAt: new Date(item.created_at).getTime(),
      gridId: item.grid_id
    }));
  },

  add: async (title: string, gridId: string) => {
    const guestId = getGuestId();
    const { data: { user } } = await supabase.auth.getUser();

    // 插入时，如果有 user 就带上 user_id，否则只带 guest_id
    const payload: any = {
      guest_id: guestId,
      grid_id: gridId,
      title: title,
      is_completed: false
    };

    if (user) {
      payload.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      completed: data.is_completed,
      createdAt: new Date(data.created_at).getTime()
    } as Task;
  },

  // delete 和 toggle 方法其实不需要改，因为 ID 是唯一的
  delete: async (taskId: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
  },

  // toggle: async (taskId: string, isCompleted: boolean) => {
  //   const { error } = await supabase
  //     .from('tasks')
  //     .update({ is_completed: isCompleted })
  //     .eq('id', taskId);
  //   if (error) throw error;
  // }

  // 替换原本的 toggle 函数
  toggle: async (taskId: string, isCompleted: boolean) => {
    // 1. 先把这行任务的原始数据查出来
    // (因为 Upsert 需要完整数据，否则可能会把标题弄丢)
    const { data: originalTask, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;

    // 2. 修改状态，然后用 .upsert() 塞回去
    // Upsert 的本质是 POST 请求，完美避开 PATCH 报错
    const { error } = await supabase
      .from('tasks')
      .upsert({ 
        ...originalTask,           // 保留原来的标题、grid_id、user_id 等
        is_completed: isCompleted  // 只改这一项
      });

    if (error) throw error;
  }
};