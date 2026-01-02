// import React, { useState } from 'react';
// import { TimeUnit } from '../../types';
// import { getValidMinorUnits } from '../../services/timeService';
// import { Settings, Calendar as CalendarIcon, Sun, X } from 'lucide-react';

// interface ControlPanelProps {
//   major: TimeUnit;
//   minor: TimeUnit;
//   onMajorChange: (u: TimeUnit) => void;
//   onMinorChange: (u: TimeUnit) => void;
// }

// const ControlPanel: React.FC<ControlPanelProps> = ({ major, minor, onMajorChange, onMinorChange }) => {
//   // 1. 新增状态：控制面板是否最小化，默认不最小化（false）
//   const [isMinimized, setIsMinimized] = useState(false);
  
//   const validMinors = getValidMinorUnits(major);

//   // 2. 如果是最小化状态，只渲染一个小太阳按钮
//   if (isMinimized) {
//     return (
//       <button
//         onClick={() => setIsMinimized(false)} // 点击恢复面板
//         className="absolute top-4 left-4 z-10 p-3 bg-white/70 backdrop-blur-md rounded-full shadow-xl border border-white/50 text-amber-500 hover:bg-white hover:scale-110 transition-all duration-300 group"
//         title="Open Settings"
//       >
//         {/* 太阳图标，hover时会旋转一下 */}
//         <Sun size={24} className="group-hover:rotate-45 transition-transform duration-500" />
//       </button>
//     );
//   }

//   // 3. 正常面板状态
//   return (
//     <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl z-10 border border-white/50 w-64 animate-in fade-in zoom-in duration-200">
      
//       {/* 标题栏：改为 Flex 布局以放置关闭按钮 */}
//       <div className="flex items-center justify-between mb-4 text-slate-700">
//         <div className="flex items-center gap-2">
//           <Settings size={20} />
//           <h2 className="font-bold text-lg">Settings</h2>
//         </div>
        
//         {/* 最小化按钮 (X) */}
//         <button 
//           onClick={() => setIsMinimized(true)}
//           className="p-1 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
//         >
//           <X size={18} />
//         </button>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Container (Major)</label>
//           <div className="flex flex-wrap gap-2">
//             {[TimeUnit.Year, TimeUnit.Month, TimeUnit.Week].map((u) => (
//               <button
//                 key={u}
//                 onClick={() => onMajorChange(u)}
//                 className={`px-3 py-1 rounded-full text-sm transition-all ${
//                   major === u 
//                     ? 'bg-green-500 text-white shadow-md' 
//                     : 'bg-white text-slate-600 hover:bg-green-100'
//                 }`}
//               >
//                 {u}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Grid Item (Minor)</label>
//           <div className="flex flex-wrap gap-2">
//             {validMinors.length > 0 ? (
//                 validMinors.map((u) => (
//                 <button
//                     key={u}
//                     onClick={() => onMinorChange(u)}
//                     className={`px-3 py-1 rounded-full text-sm transition-all ${
//                     minor === u 
//                         ? 'bg-blue-500 text-white shadow-md' 
//                         : 'bg-white text-slate-600 hover:bg-blue-100'
//                     }`}
//                 >
//                     {u}
//                 </button>
//                 ))
//             ) : (
//                 <span className="text-xs text-slate-400 italic">No valid sub-units</span>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="mt-4 pt-4 border-t border-slate-200">
//         <p className="text-xs text-slate-500 flex items-center gap-1">
//           <CalendarIcon size={12} />
//           <span>Showing {major} → {minor}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ControlPanel;

import React, { useState } from 'react';
import { TimeUnit } from '../../types';
import { getValidMinorUnits } from '../../services/timeService';
import { Settings, Calendar as CalendarIcon, Sun, X } from 'lucide-react';

interface ControlPanelProps {
  major: TimeUnit;
  minor: TimeUnit;
  onMajorChange: (u: TimeUnit) => void;
  onMinorChange: (u: TimeUnit) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ major, minor, onMajorChange, onMinorChange }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const validMinors = getValidMinorUnits(major);

  // 1. 最小化状态：完全复刻 User Button 的半透风格
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="
            absolute top-4 left-4 z-10 
            group flex items-center justify-center 
            bg-white/40 hover:bg-white/90 backdrop-blur-md 
            p-2.5 rounded-full 
            text-amber-500/80 hover:text-amber-500
            shadow-sm hover:shadow-xl 
            border border-white/30 
            transition-all duration-300 active:scale-95
        "
        title="Open Settings"
      >
        {/* Sun Icon: 尺寸调整为 20 以匹配 UserIcon，旋转动画保留meow */}
        <Sun size={20} className="group-hover:rotate-45 transition-transform duration-500" />
      </button>
    );
  }

  // 2. 正常展开面板状态
  return (
    <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl z-10 border border-white/50 w-64 animate-in fade-in zoom-in duration-200">
      
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4 text-slate-700">
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <h2 className="font-bold text-lg">Settings</h2>
        </div>
        
        {/* 关闭 (最小化) 按钮 */}
        <button 
          onClick={() => setIsMinimized(true)}
          className="p-1 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Container / Major Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Container (Major)</label>
          <div className="flex flex-wrap gap-2">
            {[TimeUnit.Year, TimeUnit.Month, TimeUnit.Week].map((u) => (
              <button
                key={u}
                onClick={() => onMajorChange(u)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  major === u 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-green-100'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Item / Minor Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Grid Item (Minor)</label>
          <div className="flex flex-wrap gap-2">
            {validMinors.length > 0 ? (
                validMinors.map((u) => (
                <button
                    key={u}
                    onClick={() => onMinorChange(u)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                    minor === u 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-white text-slate-600 hover:bg-blue-100'
                    }`}
                >
                    {u}
                </button>
                ))
            ) : (
                <span className="text-xs text-slate-400 italic">No valid sub-units</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <CalendarIcon size={12} />
          <span>Showing {major} → {minor}</span>
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;