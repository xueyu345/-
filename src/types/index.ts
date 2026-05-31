export type HabitMode = 'binary' | 'counter' | 'duration' | 'numeric';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  mode: HabitMode;
  goal: number;
  unit: string;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  createdAt: any; // Firestore serverTimestamp
}

export interface HabitLog {
  id: string; // habitId_userId_date
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  value: number;
  completed: boolean;
  updatedAt: any;
}
