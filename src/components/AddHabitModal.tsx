import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Activity, Target, Clock, Sparkles, Plus } from 'lucide-react';
import { useHabits } from '@/src/lib/HabitContext';
import { HabitMode } from '@/src/types';
import { cn } from '@/src/lib/utils';
import * as Icons from 'lucide-react';

const MODES: { id: HabitMode; label: string; icon: any; desc: string }[] = [
  { id: 'binary', label: '关卡', icon: Check, desc: '只需标记完成或未完成' },
  { id: 'counter', label: '计数', icon: Activity, desc: '记录次数，如"喝水8杯"' },
  { id: 'duration', label: '时长', icon: Clock, desc: '记录时间，如"阅读30分钟"' },
  { id: 'numeric', label: '数值', icon: Target, desc: '记录具体数值，如"体重"' },
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#EE6C4D', '#3D5A80', '#9B59B6', '#2ECC71', '#F1C40F'
];

const ICONS = ['Activity', 'Book', 'Coffee', 'Droplets', 'Moon', 'Dumbbell', 'Smile', 'Heart', 'Stethoscope', 'Zap'];

const PRESETS = [
  { name: '早起', mode: 'binary', icon: 'Sunrise', color: '#FF6B6B', goal: 1, unit: '' },
  { name: '阅读', mode: 'duration', icon: 'Book', color: '#4ECDC4', goal: 30, unit: '分钟' },
  { name: '喝水', mode: 'counter', icon: 'Droplets', color: '#45B7D1', goal: 8, unit: '杯' },
  { name: '冥想', mode: 'duration', icon: 'Moon', color: '#9B59B6', goal: 15, unit: '分钟' },
  { name: '运动', mode: 'counter', icon: 'Dumbbell', color: '#EE6C4D', goal: 1, unit: '次' },
  { name: '学习记录', mode: 'numeric', icon: 'Clock', color: '#3D5A80', goal: 2, unit: '小时' },
];

export function AddHabitModal({ onClose }: { onClose: () => void }) {
  const { addHabit } = useHabits();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    mode: 'binary' as HabitMode,
    goal: 1,
    unit: '',
    color: COLORS[0],
    icon: ICONS[0],
    frequency: 'daily' as const
  });

  const handleSave = () => {
    addHabit(formData);
    onClose();
  };

  const selectPreset = (preset: any) => {
    setFormData({
      ...formData,
      name: preset.name,
      mode: preset.mode,
      icon: preset.icon,
      color: preset.color,
      goal: preset.goal,
      unit: preset.unit
    });
    setStep(1); // Go straight to review or customization
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {step === 0 ? '添加计划' : step === 1 ? '基础设置' : '高级设置'}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-6 space-y-6">
          <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <button 
                  onClick={() => { setFormData({...formData, name: ''}); setStep(1); }}
                  className="w-full p-6 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900">自定义计划</span>
                  <span className="text-xs text-gray-400">从零开始创建一个全新的打卡习惯</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">或选择模板</h3>
                  <div className="h-[1px] w-full bg-gray-100 ml-4"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map(preset => {
                    const IconComponent = (Icons as any)[preset.icon] || Icons.Activity;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => selectPreset(preset)}
                        className="p-4 rounded-2xl border border-gray-100 text-left transition-all hover:border-gray-300 hover:shadow-sm bg-white flex flex-col gap-3"
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: preset.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">{preset.name}</div>
                          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {MODES.find(m => m.id === preset.mode)?.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">计划名称</label>
                <input 
                  autoFocus
                  placeholder="例如: 晨跑, 喝水, 冥想..."
                  className="w-full text-2xl font-bold placeholder:text-gray-200 border-none outline-none focus:ring-0 px-0"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">打卡模式</label>
                <div className="grid grid-cols-2 gap-3">
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setFormData({...formData, mode: m.id})}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all",
                        formData.mode === m.id 
                          ? "border-black bg-black text-white" 
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                      )}
                    >
                      <m.icon className="w-5 h-5 mb-2" />
                      <div className="font-bold text-sm">{m.label}</div>
                      <div className="text-[10px] opacity-70 leading-tight">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(0)}
                  className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold"
                >
                  返回
                </button>
                <button 
                  disabled={!formData.name}
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  下一步
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {formData.mode !== 'binary' && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">每日目标</label>
                  <div className="flex gap-3">
                    <input 
                      type="number"
                      placeholder="数值"
                      className="flex-1 p-4 bg-gray-100 rounded-2xl font-bold outline-none"
                      value={formData.goal}
                      onChange={e => setFormData({...formData, goal: Number(e.target.value)})}
                    />
                    <input 
                      placeholder="单位 (如: 杯, 分钟)"
                      className="flex-1 p-4 bg-gray-100 rounded-2xl font-bold outline-none"
                      value={formData.unit}
                      onChange={e => setFormData({...formData, unit: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">颜色</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setFormData({...formData, color: c})}
                      className={cn(
                        "w-8 h-8 rounded-full transition-transform",
                        formData.color === c && "scale-125 ring-2 ring-offset-2 ring-gray-900"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold"
                >
                  返回
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-black text-white rounded-2xl font-bold"
                >
                  创建计划
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
