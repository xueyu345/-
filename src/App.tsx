import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LayoutGrid, BarChart2, Settings, Calendar, Sparkles, Trophy } from 'lucide-react';
import { HabitProvider, useHabits } from '@/src/lib/HabitContext';
import { AuthProvider, useAuth } from '@/src/lib/AuthContext';
import { HabitCard } from '@/src/components/HabitCard';
import { AddHabitModal } from '@/src/components/AddHabitModal';
import { StatsView } from '@/src/components/StatsView';
import { SettingsView } from '@/src/components/SettingsView';
import { AuthScreen } from '@/src/components/AuthScreen';
import { cn, formatDate } from '@/src/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { LogOut } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'daily' | 'stats' | 'settings'>('daily');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [celebrating, setCelebrating] = useState<any>(null);
  const { habits, logs, updateLog, removeHabit } = useHabits();
  const { user, signOut } = useAuth();
  const today = formatDate(new Date());

  if (!user) return <AuthScreen />;

  const handleUpdateLog = (habit: any, val: number) => {
    const wasCompleted = logs[`${habit.id}_${user.uid}_${today}`]?.completed;
    updateLog(habit.id, today, val);
    
    // Check if the habit is now completed
    const isNowCompleted = val >= habit.goal || (habit.mode === 'binary' && val === 1);
    
    if (isNowCompleted && !wasCompleted) {
      setCelebrating(habit);
      setTimeout(() => {
        setCelebrating(null);
        removeHabit(habit.id);
      }, 3000);
    }
  };

  const completedCount = habits.filter(h => logs[`${h.id}_${user.uid}_${today}`]?.completed).length;

  return (
    <div className="min-h-screen bg-grid text-gray-900 selection:bg-black selection:text-white">
      <div className="max-w-md mx-auto relative min-h-screen pb-24">
        {/* Header */}
        <header className="pt-10 px-6 pb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                {format(new Date(), 'MMMM d, EEEE', { locale: zhCN })}
              </p>
              <h1 className="text-4xl font-black tracking-tighter mt-1 italic">
                {activeTab === 'daily' ? '今日计划' : '数据洞察'}
              </h1>
            </div>
            <div className="group relative">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                 <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Avatar" />
              </div>
              <button 
                onClick={() => signOut()}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg sm:opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {activeTab === 'daily' && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar py-2">
               <div className="min-w-[140px] p-4 bg-black text-white rounded-2xl">
                  <p className="text-[10px] font-bold opacity-70 uppercase mb-1">完成进度</p>
                  <p className="text-xl font-black">{completedCount} / {habits.length}</p>
               </div>
               <div className="min-w-[140px] p-4 bg-white border border-gray-100 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">当前连击</p>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <p className="text-xl font-black">12</p>
                  </div>
               </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="px-6 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'daily' ? (
              <motion.div 
                key="daily"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {habits.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">还没有任何计划，点击下方的 + 号开始吧</p>
                  </div>
                ) : (
                  habits.map(habit => (
                    <HabitCard 
                      key={habit.id}
                      habit={habit}
                      log={logs[`${habit.id}_${user.uid}_${today}`]}
                      onUpdate={(val) => handleUpdateLog(habit, val)}
                      onClick={() => {}}
                    />
                  ))
                )}
              </motion.div>
            ) : activeTab === 'stats' ? (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StatsView />
              </motion.div>
            ) : (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SettingsView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-6 left-6 right-6 h-16 bg-[#2B2B2B] text-white backdrop-blur-md rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center justify-around px-2 z-40">
          <NavItem 
            active={activeTab === 'daily'} 
            onClick={() => setActiveTab('daily')} 
            icon={LayoutGrid} 
            label="计划" 
          />
          <NavItem 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={BarChart2} 
            label="统计" 
          />
          <div className="relative -top-6">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all ring-4 ring-[#FDFDFB]"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
          <NavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={Settings} 
            label="设置" 
          />
        </nav>

        {/* Modals */}
        <AnimatePresence>
          {isAddModalOpen && (
            <AddHabitModal onClose={() => setIsAddModalOpen(false)} />
          )}
          {celebrating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-full max-w-sm bg-white rounded-[3rem] p-8 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: celebrating.color }} />
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: celebrating.color }}
                >
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-3 text-gray-900 tracking-tight">恭喜达标！</h2>
                <p className="text-gray-500 font-medium mb-8">
                  你已完成今日计划<br/>
                  <span className="text-black font-bold mt-1 text-lg block">「{celebrating.name}」</span>
                </p>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: celebrating.color }}
                  />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-4">
                  即将自动删除
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all px-4 py-2 rounded-xl",
        active ? "text-white" : "text-white/40 hover:text-white/80"
      )}
    >
      <Icon className={cn("w-5 h-5", active && "fill-white/20")} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div layoutId="nav-dot" className="w-1 h-1 bg-white rounded-full absolute -bottom-1" />
      )}
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HabitProvider>
        <AppContent />
      </HabitProvider>
    </AuthProvider>
  );
}
