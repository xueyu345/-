import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useHabits } from '@/src/lib/HabitContext';
import { Habit } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { Award, Target, Flame, TrendingUp } from 'lucide-react';

export function StatsView() {
  const { habits, logs } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>('all');

  const stats = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    const chartData = last7Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      let completedCount = 0;
      let totalValue = 0;

      Object.values(logs).forEach(log => {
        const hLog = log as any;
        if (hLog.date === dateStr) {
          if (selectedHabitId === 'all' || hLog.habitId === selectedHabitId) {
            completedCount += hLog.completed ? 1 : 0;
            totalValue += hLog.value;
          }
        }
      });

      return {
        name: format(date, 'EEE', { locale: zhCN }),
        completed: completedCount,
        value: totalValue,
        fullDate: dateStr
      };
    });

    const completionRate = habits.length > 0 
      ? Math.round((chartData.reduce((acc, d) => acc + d.completed, 0) / (habits.length * 7)) * 100) 
      : 0;

    return { chartData, completionRate };
  }, [habits, logs, selectedHabitId]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">统计报告</h2>
        <select 
          className="bg-gray-100 border-none rounded-lg text-xs font-bold py-1.5 pl-3 pr-8 focus:ring-0"
          value={selectedHabitId}
          onChange={e => setSelectedHabitId(e.target.value)}
        >
          <option value="all">所有计划</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Flame className="text-orange-500" />} 
          label="当前连续" 
          value="5 天" 
          color="bg-orange-50"
        />
        <StatCard 
          icon={<Award className="text-purple-500" />} 
          label="完成率" 
          value={`${stats.completionRate}%`}
          color="bg-purple-50"
        />
        <StatCard 
          icon={<Target className="text-blue-500" />} 
          label="本周打卡" 
          value={`${stats.chartData.reduce((acc, d) => acc + d.completed, 0)} 次`}
          color="bg-blue-50"
        />
        <StatCard 
          icon={<TrendingUp className="text-green-500" />} 
          label="平均得分" 
          value="8.4"
          color="bg-green-50"
        />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">近7日趋势</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }} 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed > 0 ? '#000000' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-lg font-bold mb-2">坚持就是胜利</h4>
          <p className="text-sm opacity-70 mb-4">你已经连续 3 周保持了 80% 以上的完成率。继续保持！</p>
          <div className="flex gap-2">
            {[1,1,1,1,1,0,0].map((v, i) => (
              <div key={i} className={cn("w-2 h-8 rounded-full", v ? "bg-white" : "bg-white/20")} />
            ))}
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className={cn("p-4 rounded-2xl flex flex-col items-center text-center", color)}>
      <div className="mb-2">{icon}</div>
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-lg font-black text-gray-900">{value}</div>
    </div>
  );
}
