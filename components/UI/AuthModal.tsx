// import React, { useState } from 'react';
// import { supabase } from '../../services/supabaseClient';
// import { taskService } from '../../services/taskService';
// import { X, Mail, Lock, User, Sparkles, LogIn, Loader2 } from 'lucide-react';

// interface AuthModalProps {
//   onClose: () => void;
//   onLoginSuccess: () => void;
// }

// const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [msg, setMsg] = useState('');

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMsg('');

//     try {
//       let result;
//       if (isSignUp) {
//         result = await supabase.auth.signUp({ email, password });
//       } else {
//         result = await supabase.auth.signInWithPassword({ email, password });
//       }

//       if (result.error) throw result.error;

//       // 登录/注册成功后迁移数据
//       if (result.data.user) {
//         await taskService.migrateGuestData();
//         onLoginSuccess();
//         onClose();
//       } else if (isSignUp) {
//         setMsg("Verification email sent! Please check your inbox.");
//       }
//     } catch (error: any) {
//       setMsg(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // 遮罩层：轻微模糊背景，聚焦视线
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      
//       {/* 核心卡片：复用 ControlPanel 的样式 (White/70, Backdrop, Border, Rounded-2xl) */}
//       <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 w-80 animate-in zoom-in-95 duration-200">
        
//         {/* 标题栏 */}
//         <div className="flex items-center justify-between mb-6 text-slate-700">
//           <div className="flex items-center gap-2">
//             <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
//               {isSignUp ? <Sparkles size={18} /> : <User size={18} />}
//             </div>
//             <h2 className="font-bold text-lg">
//               {isSignUp ? 'Join Flock' : 'Welcome Back'}
//             </h2>
//           </div>
          
//           {/* 关闭按钮：完全复用 ControlPanel 的样式 */}
//           <button 
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <form onSubmit={handleAuth} className="space-y-4">
          
//           {/* Email 输入框 */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
//               Email Address
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-500 transition-colors">
//                 <Mail size={16} />
//               </div>
//               <input 
//                 type="email" 
//                 required
//                 className="w-full pl-9 pr-3 py-2 bg-white/60 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
//                 placeholder="sheep@example.com"
//                 value={email} 
//                 onChange={e => setEmail(e.target.value)} 
//               />
//             </div>
//           </div>

//           {/* Password 输入框 */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
//               Password
//             </label>
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-500 transition-colors">
//                 <Lock size={16} />
//               </div>
//               <input 
//                 type="password" 
//                 required
//                 className="w-full pl-9 pr-3 py-2 bg-white/60 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
//                 placeholder="••••••••"
//                 value={password} 
//                 onChange={e => setPassword(e.target.value)} 
//               />
//             </div>
//           </div>
          
//           {/* 错误提示 */}
//           {msg && (
//             <div className="bg-red-50 border border-red-100 text-red-500 text-xs p-2 rounded-lg">
//               {msg}
//             </div>
//           )}

//           {/* 提交按钮：使用 ControlPanel 中的高亮色 (Green-500) */}
//           <button 
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
//           >
//             {loading ? (
//               <Loader2 size={18} className="animate-spin" />
//             ) : (
//               <>
//                 {isSignUp ? 'Sign Up & Save' : 'Login'}
//                 {!isSignUp && <LogIn size={16} />}
//               </>
//             )}
//           </button>
//         </form>

//         {/* 底部切换链接 */}
//         <div className="mt-6 pt-4 border-t border-slate-200/60 text-center">
//           <p className="text-xs text-slate-500">
//             {isSignUp ? "Already have a flock?" : "Want to save your sheep?"}
//             <button 
//               onClick={() => {
//                 setIsSignUp(!isSignUp);
//                 setMsg('');
//               }}
//               className="ml-1 text-green-600 font-semibold hover:text-green-700 hover:underline transition-all"
//             >
//               {isSignUp ? 'Login here' : 'Create account'}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;

import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { taskService } from '../../services/taskService';
import { X, Mail, Lock, User, Sparkles, LogIn, Loader2, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [msg, setMsg] = useState('');
  // 新增状态：是否显示激活提示
  const [showVerifyHint, setShowVerifyHint] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setShowVerifyHint(false);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ 
          email, 
          password,
          // 确保重定向 URL 正确，避免用户激活后迷路
          options: {
            emailRedirectTo: window.location.origin
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      // 注册成功，但需要验证邮箱 (session 为 null，但 user 存在)
      if (isSignUp && result.data.user && !result.data.session) {
        setShowVerifyHint(true);
      } 
      // 登录成功，或注册后直接登入（如果关掉了邮箱验证）
      else if (result.data.user) {
        await taskService.migrateGuestData();
        onLoginSuccess();
        onClose();
      }
    } catch (error: any) {
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 w-80 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6 text-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
              {isSignUp ? <Sparkles size={18} /> : <User size={18} />}
            </div>
            <h2 className="font-bold text-lg">
              {isSignUp ? 'Join Flock' : 'Welcome Back'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-500 transition-colors">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                required
                className="w-full pl-9 pr-3 py-2 bg-white/60 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                placeholder="sheep@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-500 transition-colors">
                <Lock size={16} />
              </div>
              <input 
                type="password" 
                required
                className="w-full pl-9 pr-3 py-2 bg-white/60 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>
          
          {msg && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs p-2 rounded-lg">
              {msg}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Sign Up & Save' : 'Login'}
                {!isSignUp && <LogIn size={16} />}
              </>
            )}
          </button>
        </form>

        {/* 底部逻辑：如果需要验证，显示绿色提示框；否则显示切换链接 */}
        {showVerifyHint ? (
            <div className="mt-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-bottom-2">
                <div className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-emerald-700">Almost there!</h4>
                        <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                            A verification link has been sent to <b>{email}</b>. 
                            Please activate your account to save your sheep!
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="mt-6 pt-4 border-t border-slate-200/60 text-center">
            <p className="text-xs text-slate-500">
                {isSignUp ? "Already have a flock?" : "Want to save your sheep?"}
                <button 
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setMsg('');
                    setShowVerifyHint(false); // 切换时隐藏提示
                }}
                className="ml-1 text-green-600 font-semibold hover:text-green-700 hover:underline transition-all"
                >
                {isSignUp ? 'Login here' : 'Create account'}
                </button>
            </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;