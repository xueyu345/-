import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Plus, Minus, Clock, Timer, 
  ChevronRight, MoreVertical 
} from 'lucide-react';
import { Habit, HabitLog } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  onUpdate: (value: number) => void;
  onClick: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, log, onUpdate, onClick }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentValue = log?.value || 0;
  const isCompleted = log?.completed || false;
  const progress = Math.min((currentValue / habit.goal) * 100, 100);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(currentValue + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentValue > 0) onUpdate(currentValue - 1);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(isCompleted ? 0 : 1);
  };

  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 transition-all cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md",
        isCompleted && "bg-gray-50 border-transparent shadow-none"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: habit.color }}
          >
            {/* Icon would be rendered here via a map or dynamic component */}
            <ActivityIcon name={habit.icon} />
          </div>
          <div>
            <h3 className={cn("font-semibold text-gray-900", isCompleted && "text-gray-400 line-through")}>
              {habit.name}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {habit.mode === 'binary' ? '目标: 完成' : `目标: ${habit.goal} ${habit.unit}`}
            </p>
          </div>
        </div>
        
        {habit.mode === 'binary' ? (
          <button
            onClick={handleToggle}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              isCompleted 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            )}
          >
            {isCompleted ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDecrement}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm min-w-[2ch] text-center">
              {currentValue}
            </span>
            <button 
              onClick={handleIncrement}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {habit.mode !== 'binary' && (
        <div className="mt-4">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full"
              style={{ backgroundColor: habit.color }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
             <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Progress</span>
             <span className="text-[10px] text-gray-500 font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

import * as Icons from 'lucide-react';

function ActivityIcon({ name }: { name: string }) {
  const IconComponent = (Icons as any)[name] || Icons.Activity;
  return <IconComponent className="w-5 h-5" />;
}
