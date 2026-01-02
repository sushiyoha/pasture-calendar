// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import Scene from './components/Scene';
// import ControlPanel from './components/UI/ControlPanel';
// import TaskModal from './components/UI/TaskModal';
// import AuthModal from './components/UI/AuthModal';
// import { TimeUnit, TasksMap, Task } from './types';
// import { generateGridItems, getValidMinorUnits } from './services/timeService';
// import { taskService } from './services/taskService';
// import { supabase } from './services/supabaseClient';
// import { nanoid } from 'nanoid';
// import { Cloud, LogOut, User as UserIcon } from 'lucide-react';

// // Helper to parse Grid IDs
// const parseKey = (key: string) => {
//   const dayMatch = key.match(/^(\d{4})-(\d{2})-(\d{2})$/);
//   if (dayMatch) return { type: 'day', year: parseInt(dayMatch[1]), month: parseInt(dayMatch[2]) - 1, day: parseInt(dayMatch[3]) };

//   const monthMatch = key.match(/^y(\d{4})-m(\d{1,2})$/);
//   if (monthMatch) return { type: 'month', year: parseInt(monthMatch[1]), month: parseInt(monthMatch[2]) };

//   const quarterMatch = key.match(/^y(\d{4})-q(\d{1})$/);
//   if (quarterMatch) return { type: 'quarter', year: parseInt(quarterMatch[1]), quarter: parseInt(quarterMatch[2]) };
  
//   return null;
// };

// const App: React.FC = () => {
//   // --- State: View Configuration ---
//   const [majorUnit, setMajorUnit] = useState<TimeUnit>(TimeUnit.Year);
//   const [minorUnit, setMinorUnit] = useState<TimeUnit>(TimeUnit.Month);
//   const [baseDate] = useState<Date>(new Date());

//   // --- State: Tasks (Local + Remote synced) ---
//   const [tasksMap, setTasksMap] = useState<TasksMap>({});
//   const [loading, setLoading] = useState(true);

//   // --- State: Selection ---
//   const [selectedGridId, setSelectedGridId] = useState<string | null>(null);

//   // --- State: Auth ---
//   const [user, setUser] = useState<any>(null);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   // --- Derived: Grid Items ---
//   const gridItems = useMemo(() => {
//     return generateGridItems(majorUnit, minorUnit, baseDate);
//   }, [majorUnit, minorUnit, baseDate]);

//   // --- Derived: Selected Item Data ---
//   const selectedGridData = useMemo(() => {
//     if (!selectedGridId) return null;
//     return gridItems.find(item => item.id === selectedGridId) || null;
//   }, [selectedGridId, gridItems]);

//   // --- Data Loading Logic ---
//   const loadTasks = useCallback(async () => {
//     setLoading(true);
//     try {
//       const fetchedTasks = await taskService.fetchAll();
      
//       const newMap: TasksMap = {};
//       fetchedTasks.forEach((t: any) => {
//         const gId = t.gridId;
//         if (!newMap[gId]) newMap[gId] = [];
        
//         const cleanTask: Task = {
//           id: t.id,
//           title: t.title,
//           completed: t.completed,
//           createdAt: t.createdAt
//         };
//         newMap[gId].push(cleanTask);
//       });
      
//       setTasksMap(newMap);
//     } catch (error) {
//       console.error("Failed to load sheep:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // --- INIT: Auth Listener & Data Load ---
//   useEffect(() => {
//     const init = async () => {
//         const { data } = await supabase.auth.getUser();
//         setUser(data.user);
//         loadTasks(); 
//     };
//     init();

//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//         setUser(session?.user ?? null);
//         if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
//             loadTasks();
//         }
//     });

//     return () => {
//         authListener.subscription.unsubscribe();
//     };
//   }, [loadTasks]);

//   // --- Handlers ---
//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//   };

//   const handleMajorChange = (newMajor: TimeUnit) => {
//     setMajorUnit(newMajor);
//     const validMinors = getValidMinorUnits(newMajor);
//     if (!validMinors.includes(minorUnit)) {
//       setMinorUnit(validMinors[0]);
//     }
//     setSelectedGridId(null);
//   };

//   const handleMinorChange = (newMinor: TimeUnit) => {
//     setMinorUnit(newMinor);
//     setSelectedGridId(null);
//   };

//   const handleGridClick = (id: string) => {
//     setSelectedGridId(id === selectedGridId ? null : id);
//   };

//   // --- Task Operations ---
//   const handleAddTask = async (title: string) => {
//     if (!selectedGridId) return;

//     const tempId = nanoid();
//     const tempTask: Task = {
//       id: tempId,
//       title,
//       completed: false,
//       createdAt: Date.now()
//     };

//     setTasksMap(prev => ({
//       ...prev,
//       [selectedGridId]: [...(prev[selectedGridId] || []), tempTask]
//     }));

//     try {
//       const savedTask = await taskService.add(title, selectedGridId);
//       setTasksMap(prev => {
//         const list = prev[selectedGridId] || [];
//         return {
//           ...prev,
//           [selectedGridId]: list.map(t => t.id === tempId ? savedTask : t)
//         };
//       });
//     } catch (error) {
//       console.error("Failed to add task", error);
//       setTasksMap(prev => ({
//         ...prev,
//         [selectedGridId]: (prev[selectedGridId] || []).filter(t => t.id !== tempId)
//       }));
//       alert("Could not save task. Please check your connection.");
//     }
//   };

//   const handleDeleteTask = async (taskId: string) => {
//     let previousMap = { ...tasksMap };
//     setTasksMap(prev => {
//       const newMap = { ...prev };
//       let found = false;
//       for (const key in newMap) {
//         const idx = newMap[key].findIndex(t => t.id === taskId);
//         if (idx !== -1) {
//           newMap[key] = [...newMap[key]];
//           newMap[key].splice(idx, 1);
//           found = true;
//           break;
//         }
//       }
//       return found ? newMap : prev;
//     });

//     try {
//       await taskService.delete(taskId);
//     } catch (error) {
//       console.error("Failed to delete", error);
//       setTasksMap(previousMap); 
//     }
//   };

//   const handleToggleTask = async (taskId: string) => {
//     let targetTask: Task | undefined;
//     setTasksMap(prev => {
//       const newMap = { ...prev };
//       let found = false;
//       for (const key in newMap) {
//         const idx = newMap[key].findIndex(t => t.id === taskId);
//         if (idx !== -1) {
//           const task = newMap[key][idx];
//           targetTask = task;
//           newMap[key] = [...newMap[key]];
//           newMap[key][idx] = { ...task, completed: !task.completed };
//           found = true;
//           break;
//         }
//       }
//       return found ? newMap : prev;
//     });

//     if (targetTask) {
//       try {
//         await taskService.toggle(taskId, !targetTask.completed);
//       } catch (error) {
//         console.error("Failed to toggle", error);
//       }
//     }
//   };

//   // --- Aggregation Logic ---
//   const aggregatedTasksMap = useMemo(() => {
//     const aggregated: TasksMap = {};
//     const addUniqueTasks = (gridId: string, tasksToAdd: Task[]) => {
//         if (!aggregated[gridId]) aggregated[gridId] = [];
//         const existingIds = new Set(aggregated[gridId].map(t => t.id));
//         tasksToAdd.forEach(t => {
//             if (!existingIds.has(t.id)) {
//                 aggregated[gridId].push(t);
//                 existingIds.add(t.id);
//             }
//         });
//     };

//     gridItems.forEach(grid => {
//         const gridInfo = parseKey(grid.id);
//         const isWeek = grid.id.startsWith('w');
        
//         if (tasksMap[grid.id]) addUniqueTasks(grid.id, tasksMap[grid.id]);

//         (Object.entries(tasksMap) as [string, Task[]][]).forEach(([taskKey, tasks]) => {
//             if (taskKey === grid.id) return;
//             const taskKeyInfo = parseKey(taskKey);
//             if (!taskKeyInfo) return;
//             let match = false;
//             if (isWeek) {
//                 if (taskKeyInfo.type === 'day') {
//                     const taskDate = new Date(taskKeyInfo.year, taskKeyInfo.month, taskKeyInfo.day);
//                     const weekStart = new Date(grid.date);
//                     weekStart.setHours(0,0,0,0);
//                     const weekEnd = new Date(weekStart);
//                     weekEnd.setDate(weekEnd.getDate() + 7);
//                     if (taskDate >= weekStart && taskDate < weekEnd) match = true;
//                 }
//             } else if (gridInfo && gridInfo.type === 'month') {
//                 if (taskKeyInfo.type === 'day' && 
//                     taskKeyInfo.year === gridInfo.year && 
//                     taskKeyInfo.month === gridInfo.month) match = true;
//             } else if (gridInfo && gridInfo.type === 'quarter') {
//                 let taskQ = -1;
//                 if (taskKeyInfo.type === 'month' || taskKeyInfo.type === 'day') {
//                     taskQ = Math.floor(taskKeyInfo.month / 3) + 1;
//                 }
//                 if (taskKeyInfo.year === gridInfo.year && taskQ === gridInfo.quarter) match = true;
//             }
//             if (match) addUniqueTasks(grid.id, tasks);
//         });
//     });
//     return aggregated;
//   }, [tasksMap, gridItems]);

//   const sceneTasksMap = useMemo(() => {
//       const map: TasksMap = {};
//       (Object.entries(aggregatedTasksMap) as [string, Task[]][]).forEach(([key, tasks]) => {
//           map[key] = tasks.filter(t => !t.completed);
//       });
//       return map;
//   }, [aggregatedTasksMap]);

//   return (
//     <div className="relative w-full h-full font-sans text-slate-800">
      
//       {/* 3D Scene */}
//       <Scene 
//         items={gridItems} 
//         tasksMap={sceneTasksMap} 
//         onGridClick={handleGridClick} 
//         selectedId={selectedGridId} 
//       />

//       {/* Control Panel */}
//       <ControlPanel 
//         major={majorUnit} 
//         minor={minorUnit} 
//         onMajorChange={handleMajorChange} 
//         onMinorChange={handleMinorChange} 
//       />

//       {/* --- Auth / User Button (Top Right) --- */}
//       <div className="absolute top-4 right-4 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
//         {user ? (
//           // 登录后：显示用户名和登出
//           <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/50">
//             <div className="flex items-center gap-2 text-slate-600 border-r border-slate-300 pr-3 mr-1">
//                <div className="bg-green-100 p-1 rounded-full text-green-600">
//                  <UserIcon size={14} />
//                </div>
//                <span className="text-xs font-semibold">
//                  {user.email?.split('@')[0]}
//                </span>
//             </div>
//             <button 
//               onClick={handleLogout}
//               className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
//               title="Logout"
//             >
//               <LogOut size={16} />
//             </button>
//           </div>
//         ) : (
//           // 登录前：可展开的云朵图标按钮
//           <button
//             onClick={() => setShowAuthModal(true)}
//             className="group flex items-center justify-center bg-white/70 backdrop-blur-md hover:bg-white p-2.5 rounded-full text-slate-600 hover:text-indigo-600 shadow-xl border border-white/50 transition-all duration-300 active:scale-95"
//           >
//             {/* 图标始终存在 */}
//             <Cloud size={20} className="text-indigo-500 shrink-0" />
            
//             {/* 文字：利用 max-width 进行滑出动画 */}
//             <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 text-xs font-bold">
//               Save Data
//             </span>
//           </button>
//         )}
//       </div>

//       {/* Auth Modal */}
//       {showAuthModal && (
//         <AuthModal 
//           onClose={() => setShowAuthModal(false)} 
//           onLoginSuccess={() => {
//             // Data reloads via listener
//           }} 
//         />
//       )}

//       {/* Task Modal */}
//       {selectedGridData && (
//         <TaskModal 
//           gridData={selectedGridData}
//           tasks={aggregatedTasksMap[selectedGridData.id] || []}
//           onClose={() => setSelectedGridId(null)}
//           onAddTask={handleAddTask}
//           onDeleteTask={handleDeleteTask}
//           onToggleTask={handleToggleTask}
//         />
//       )}

//       {/* Loading Indicator */}
//       {loading && (
//          <div className="absolute top-20 right-4 bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-white/50 text-xs font-medium text-slate-500 flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//             Syncing...
//          </div>
//       )}

//       {/* Footer Hint */}
//       <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
//         <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-white/40">
//           Select a grass patch to add tasks. Zoom out to aggregate your sheep!
//         </span>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Scene from './components/Scene';
import ControlPanel from './components/UI/ControlPanel';
import TaskModal from './components/UI/TaskModal';
import AuthModal from './components/UI/AuthModal';
import { TimeUnit, TasksMap, Task } from './types';
import { generateGridItems, getValidMinorUnits } from './services/timeService';
import { taskService } from './services/taskService';
import { supabase } from './services/supabaseClient';
import { nanoid } from 'nanoid';
import { Cloud, LogOut, User as UserIcon } from 'lucide-react';

// Helper to parse Grid IDs
const parseKey = (key: string) => {
  const dayMatch = key.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dayMatch) return { type: 'day', year: parseInt(dayMatch[1]), month: parseInt(dayMatch[2]) - 1, day: parseInt(dayMatch[3]) };

  const monthMatch = key.match(/^y(\d{4})-m(\d{1,2})$/);
  if (monthMatch) return { type: 'month', year: parseInt(monthMatch[1]), month: parseInt(monthMatch[2]) };

  const quarterMatch = key.match(/^y(\d{4})-q(\d{1})$/);
  if (quarterMatch) return { type: 'quarter', year: parseInt(quarterMatch[1]), quarter: parseInt(quarterMatch[2]) };
  
  return null;
};

const App: React.FC = () => {
  // --- State: View Configuration ---
  const [majorUnit, setMajorUnit] = useState<TimeUnit>(TimeUnit.Year);
  const [minorUnit, setMinorUnit] = useState<TimeUnit>(TimeUnit.Month);
  const [baseDate] = useState<Date>(new Date());

  // --- State: Tasks (Local + Remote synced) ---
  const [tasksMap, setTasksMap] = useState<TasksMap>({});
  const [loading, setLoading] = useState(true);

  // --- State: Selection ---
  const [selectedGridId, setSelectedGridId] = useState<string | null>(null);

  // --- State: Auth ---
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- Derived: Grid Items ---
  const gridItems = useMemo(() => {
    return generateGridItems(majorUnit, minorUnit, baseDate);
  }, [majorUnit, minorUnit, baseDate]);

  // --- Derived: Selected Item Data ---
  const selectedGridData = useMemo(() => {
    if (!selectedGridId) return null;
    return gridItems.find(item => item.id === selectedGridId) || null;
  }, [selectedGridId, gridItems]);

  // --- Data Loading Logic ---
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTasks = await taskService.fetchAll();
      
      const newMap: TasksMap = {};
      fetchedTasks.forEach((t: any) => {
        const gId = t.gridId;
        if (!newMap[gId]) newMap[gId] = [];
        
        const cleanTask: Task = {
          id: t.id,
          title: t.title,
          completed: t.completed,
          createdAt: t.createdAt
        };
        newMap[gId].push(cleanTask);
      });
      
      setTasksMap(newMap);
    } catch (error) {
      console.error("Failed to load sheep:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- INIT: Auth Listener & Data Load ---
  useEffect(() => {
    const init = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        loadTasks(); 
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            loadTasks();
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [loadTasks]);

  // --- Handlers ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleMajorChange = (newMajor: TimeUnit) => {
    setMajorUnit(newMajor);
    const validMinors = getValidMinorUnits(newMajor);
    if (!validMinors.includes(minorUnit)) {
      setMinorUnit(validMinors[0]);
    }
    setSelectedGridId(null);
  };

  const handleMinorChange = (newMinor: TimeUnit) => {
    setMinorUnit(newMinor);
    setSelectedGridId(null);
  };

  const handleGridClick = (id: string) => {
    setSelectedGridId(id === selectedGridId ? null : id);
  };

  // --- Task Operations ---
  const handleAddTask = async (title: string) => {
    if (!selectedGridId) return;

    const tempId = nanoid();
    const tempTask: Task = {
      id: tempId,
      title,
      completed: false,
      createdAt: Date.now()
    };

    setTasksMap(prev => ({
      ...prev,
      [selectedGridId]: [...(prev[selectedGridId] || []), tempTask]
    }));

    try {
      const savedTask = await taskService.add(title, selectedGridId);
      setTasksMap(prev => {
        const list = prev[selectedGridId] || [];
        return {
          ...prev,
          [selectedGridId]: list.map(t => t.id === tempId ? savedTask : t)
        };
      });
    } catch (error) {
      console.error("Failed to add task", error);
      setTasksMap(prev => ({
        ...prev,
        [selectedGridId]: (prev[selectedGridId] || []).filter(t => t.id !== tempId)
      }));
      alert("Could not save task. Please check your connection.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    let previousMap = { ...tasksMap };
    setTasksMap(prev => {
      const newMap = { ...prev };
      let found = false;
      for (const key in newMap) {
        const idx = newMap[key].findIndex(t => t.id === taskId);
        if (idx !== -1) {
          newMap[key] = [...newMap[key]];
          newMap[key].splice(idx, 1);
          found = true;
          break;
        }
      }
      return found ? newMap : prev;
    });

    try {
      await taskService.delete(taskId);
    } catch (error) {
      console.error("Failed to delete", error);
      setTasksMap(previousMap); 
    }
  };

  const handleToggleTask = async (taskId: string) => {
    let targetTask: Task | undefined;
    setTasksMap(prev => {
      const newMap = { ...prev };
      let found = false;
      for (const key in newMap) {
        const idx = newMap[key].findIndex(t => t.id === taskId);
        if (idx !== -1) {
          const task = newMap[key][idx];
          targetTask = task;
          newMap[key] = [...newMap[key]];
          newMap[key][idx] = { ...task, completed: !task.completed };
          found = true;
          break;
        }
      }
      return found ? newMap : prev;
    });

    if (targetTask) {
      try {
        await taskService.toggle(taskId, !targetTask.completed);
      } catch (error) {
        console.error("Failed to toggle", error);
      }
    }
  };

  // --- Aggregation Logic ---
  const aggregatedTasksMap = useMemo(() => {
    const aggregated: TasksMap = {};
    const addUniqueTasks = (gridId: string, tasksToAdd: Task[]) => {
        if (!aggregated[gridId]) aggregated[gridId] = [];
        const existingIds = new Set(aggregated[gridId].map(t => t.id));
        tasksToAdd.forEach(t => {
            if (!existingIds.has(t.id)) {
                aggregated[gridId].push(t);
                existingIds.add(t.id);
            }
        });
    };

    gridItems.forEach(grid => {
        const gridInfo = parseKey(grid.id);
        const isWeek = grid.id.startsWith('w');
        
        if (tasksMap[grid.id]) addUniqueTasks(grid.id, tasksMap[grid.id]);

        (Object.entries(tasksMap) as [string, Task[]][]).forEach(([taskKey, tasks]) => {
            if (taskKey === grid.id) return;
            const taskKeyInfo = parseKey(taskKey);
            if (!taskKeyInfo) return;
            let match = false;
            if (isWeek) {
                if (taskKeyInfo.type === 'day') {
                    const taskDate = new Date(taskKeyInfo.year, taskKeyInfo.month, taskKeyInfo.day);
                    const weekStart = new Date(grid.date);
                    weekStart.setHours(0,0,0,0);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 7);
                    if (taskDate >= weekStart && taskDate < weekEnd) match = true;
                }
            } else if (gridInfo && gridInfo.type === 'month') {
                if (taskKeyInfo.type === 'day' && 
                    taskKeyInfo.year === gridInfo.year && 
                    taskKeyInfo.month === gridInfo.month) match = true;
            } else if (gridInfo && gridInfo.type === 'quarter') {
                let taskQ = -1;
                if (taskKeyInfo.type === 'month' || taskKeyInfo.type === 'day') {
                    taskQ = Math.floor(taskKeyInfo.month / 3) + 1;
                }
                if (taskKeyInfo.year === gridInfo.year && taskQ === gridInfo.quarter) match = true;
            }
            if (match) addUniqueTasks(grid.id, tasks);
        });
    });
    return aggregated;
  }, [tasksMap, gridItems]);

  const sceneTasksMap = useMemo(() => {
      const map: TasksMap = {};
      (Object.entries(aggregatedTasksMap) as [string, Task[]][]).forEach(([key, tasks]) => {
          map[key] = tasks.filter(t => !t.completed);
      });
      return map;
  }, [aggregatedTasksMap]);

  return (
    <div className="relative w-full h-full font-sans text-slate-800">
      
      {/* 3D Scene */}
      <Scene 
        items={gridItems} 
        tasksMap={sceneTasksMap} 
        onGridClick={handleGridClick} 
        selectedId={selectedGridId} 
      />

      {/* Control Panel */}
      <ControlPanel 
        major={majorUnit} 
        minor={minorUnit} 
        onMajorChange={handleMajorChange} 
        onMinorChange={handleMinorChange} 
      />

      {/* --- Auth / User Button (Top Right) --- */}
      <div className="absolute top-4 right-4 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        {user ? (
          // 登录后：极简透明风格
          <div className="group flex items-center bg-white/30 hover:bg-white/80 backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-sm hover:shadow-lg border border-white/20 hover:border-white/50 cursor-default">
            
            {/* 头像 (Icon only, no background circle) */}
            <UserIcon size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors shrink-0" />
            
            {/* 悬停展开内容 */}
            <div className="max-w-0 overflow-hidden group-hover:max-w-[200px] flex items-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
              <span className="text-xs font-semibold text-slate-600 px-2 whitespace-nowrap border-r border-slate-300/50 mx-1">
                {user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="p-1 mr-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          // 登录前：可展开的云朵图标按钮 (保持不变，或根据喜好调整)
          <button
            onClick={() => setShowAuthModal(true)}
            className="group flex items-center justify-center bg-white/40 hover:bg-white/90 backdrop-blur-md p-2.5 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm hover:shadow-xl border border-white/30 transition-all duration-300 active:scale-95"
          >
            <Cloud size={20} className="text-indigo-500/80 group-hover:text-indigo-600 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[100px] group-hover:ml-2 transition-all duration-300 text-xs font-bold">
              Save Data
            </span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={() => {
            // Data reloads via listener
          }} 
        />
      )}

      {/* Task Modal */}
      {selectedGridData && (
        <TaskModal 
          gridData={selectedGridData}
          tasks={aggregatedTasksMap[selectedGridData.id] || []}
          onClose={() => setSelectedGridId(null)}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onToggleTask={handleToggleTask}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
         <div className="absolute top-20 right-4 bg-white/30 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Loading...
         </div>
      )}

      {/* Footer Hint */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-white/20">
          Select a grass patch to add tasks. Zoom out to aggregate your sheep!
        </span>
      </div>
    </div>
  );
};

export default App;