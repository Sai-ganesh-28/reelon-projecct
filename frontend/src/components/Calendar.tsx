import React from "react";
import { Habit } from '../components/dashboard';

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface HabitCalendarProps {
  habit: Habit;
  onSelectDate: (habitId: number, date: string) => void;
  isCompletedOnDate: (date: string) => boolean;
  selectedDate: string;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit, onSelectDate, isCompletedOnDate, selectedDate }) => {

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); 
  
  const habitCreationDate = new Date(habit.createdAt);
  const habitCreationDay = habitCreationDate.getDate();
  const habitCreationMonth = habitCreationDate.getMonth();
  const habitCreationYear = habitCreationDate.getFullYear();
  const isCreatedInCurrentMonth = habitCreationMonth === currentMonth && habitCreationYear === currentYear;
  const effectiveHabitCreationDay = isCreatedInCurrentMonth ? habitCreationDay : 1;
  
  const formatDateString = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const calculateCurrentStreak = () => {
    let streak = 0;
    for (let day = currentDay; day >= effectiveHabitCreationDay; day--) {
      const dateString = formatDateString(currentYear, currentMonth, day);
      if (isCompletedOnDate(dateString)) {
        streak++;
      } else {
        break; 
      }
    }
    return streak;
  };
  
  // Calculate best streak in the month
  const calculateBestStreak = () => {
    let currentStreak = 0;
    let bestStreak = 0;
    
    for (let day = effectiveHabitCreationDay; day <= currentDay; day++) {
      const dateString = formatDateString(currentYear, currentMonth, day);
      if (isCompletedOnDate(dateString)) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return bestStreak;
  };

  const current = calculateCurrentStreak();
  const best = calculateBestStreak();

  const totalPossibleDays = currentDay - effectiveHabitCreationDay + 1;
  let totalCompletedDays = 0;
  
  for (let day = effectiveHabitCreationDay; day <= currentDay; day++) {
    const dateString = formatDateString(currentYear, currentMonth, day);
    if (isCompletedOnDate(dateString)) {
      totalCompletedDays++;
    }
  }
  
  const rate = totalPossibleDays > 0 ? Math.round((totalCompletedDays / totalPossibleDays) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mt-4 mb-2">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">{current}</p>
          <p className="text-xs text-gray-500">Current</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">{best}</p>
          <p className="text-xs text-gray-500">Best</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">{rate}%</p>
          <p className="text-xs text-gray-500">Rate</p>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-2">
        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
      </div>
      
      <div className="grid grid-cols-7 gap-0.5">
        {/* Day headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
          <div key={`header-${i}`} className="h-6 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateString = formatDateString(currentYear, currentMonth, day);
          const isCompleted = isCompletedOnDate(dateString);
          const isToday = day === currentDay;
          const isPast = day < currentDay;
          const isFuture = day > currentDay;
          const isBeforeCreation = day < effectiveHabitCreationDay;
          const isClickable = !isBeforeCreation && !isFuture;
          
          const isSelected = dateString === selectedDate;
          
          return (
            <button
              key={`day-${day}`}
              onClick={isClickable ? () => onSelectDate(habit.id, dateString) : undefined}
              disabled={!isClickable}
              className={cn(
                'w-8 h-8 text-xs flex items-center justify-center rounded-md',
                isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100',
                isBeforeCreation && 'opacity-50 cursor-not-allowed',
                isFuture && 'opacity-50 cursor-not-allowed',
                isToday && 'ring-1 ring-green-500',
                isSelected && 'ring-2 ring-blue-500'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-2">
        <div></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <span className="text-xs text-gray-500">Missed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
