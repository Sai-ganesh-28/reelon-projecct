import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import HabitCalendar from './Calendar';
import { authService } from '../services/api';

export interface Habit {
  id: number;
  name: string;
  description?: string;
  createdAt: string; 
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      if (!token) {
        navigate('/');
        return;
      }
      
      try {
        const userData = await authService.getCurrentUser(token);
        setUserName(userData.user.name);
      } catch (error) {
        console.error('Authentication error:', error);
        authService.removeToken();
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);
  const [showModal, setShowModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Morning Workout', description: '30 minutes of exercise', createdAt: '2025-07-01' },
    { id: 2, name: 'Read for 30 minutes', description: 'Read books or articles', createdAt: '2025-07-03' },
    { id: 3, name: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day', createdAt: '2025-07-10' },
  ]);

  const [completions, setCompletions] = useState<Map<string, Set<number>>>(new Map());
  
    // todays date
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };
  
  // Today's date string
  const todayString = getTodayString();
  
  // current date
  const [selectedDates, setSelectedDates] = useState<Map<number, string>>(new Map());
  
  React.useEffect(() => {
    setSelectedDates(prev => {
      const newMap = new Map(prev);
      habits.forEach(habit => {
        if (!newMap.has(habit.id)) {
          newMap.set(habit.id, todayString);
        }
      });
      return newMap;
    });
  }, [habits, todayString]);
  
  // Initialize today's completions if not already set
  React.useEffect(() => {
    setCompletions(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(todayString)) {
        newMap.set(todayString, new Set());
      }
      return newMap;
    });
  }, [todayString]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddHabit = () => {
    if (!habitName.trim()) return;
    setHabits(prev => [
      ...prev,
      { 
        id: Date.now(), 
        name: habitName.trim(), 
        description: habitDesc.trim() || undefined,
        createdAt: todayString 
      }
    ]);
    setHabitName('');
    setHabitDesc('');
    closeModal();
  };

  const handleLogout = () => {
    authService.removeToken();
    navigate('/');
  };

  const handleEdit = (id: number) => {
    console.log('Edit habit', id);
  };

  const handleDelete = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    // Remove habit from all date completions
    setCompletions(prev => {
      console.log('Deleting habit', id);
      const newMap = new Map(prev);
      
      // Remove habit from all dates
      newMap.forEach((dateCompletions, date) => {
        if (dateCompletions.has(id)) {
          const newDateCompletions = new Set(dateCompletions);
          newDateCompletions.delete(id);
          newMap.set(date, newDateCompletions);
        }
      });
      
      return newMap;
    });
  };

  const toggleDone = (id: number, dateString: string = todayString) => {
    setCompletions(prev => {
      const newMap = new Map(prev);
      const dateCompletions = newMap.get(dateString) || new Set();
      const newDateCompletions = new Set(dateCompletions);
      
      if (newDateCompletions.has(id)) {
        newDateCompletions.delete(id);
      } else {
        newDateCompletions.add(id);
      }
      
      newMap.set(dateString, newDateCompletions);
      return newMap;
    });
  };
  

  const isHabitCompletedOnDate = (habitId: number, dateString: string): boolean => {
    const dateCompletions = completions.get(dateString);
    return dateCompletions ? dateCompletions.has(habitId) : false;
  };

  const todayCompletions = completions.get(todayString) || new Set();
  const total = habits.length;
  const completed = todayCompletions.size;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-full" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Consistently</h1>
              <p className="text-sm text-gray-600">
                {userName ? `Welcome, ${userName}!` : 'Welcome back'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={openModal}
              className="flex items-center space-x-1 border border-gray-200 bg-white px-3 py-1.5 rounded-md hover:bg-gray-50"
            >
              <PlusIcon className="h-5 w-5 text-black" />
              <span className="text-sm font-medium text-black">Add Habit</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Today's Progress</h2>
              <p className="mt-1 text-2xl font-bold text-gray-900">{completed}/{total}</p>
              <p className="text-xs text-gray-500">{percent}% completed</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              {/* calendar icon */}
            </button>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-gray-600">Active Habits</h2>
            <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">habits in progress</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-gray-600">Best Streak</h2>
            <p className="mt-1 text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-500">days in a row</p>
          </div>
        </div>

        {/* Habit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {habits.map(habit => {
            const isDone = isHabitCompletedOnDate(habit.id, todayString);
            return (
              <div
                key={habit.id}
                className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm relative"
              >
                <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                {habit.description && (
                  <p className="mt-1 text-sm text-gray-600">{habit.description}</p>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => handleEdit(habit.id)} className="p-1 hover:bg-gray-100 rounded-md">
                    <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button onClick={() => handleDelete(habit.id)} className="p-1 hover:bg-gray-100 rounded-md">
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                <div className="mt-6">
                  <HabitCalendar
                    habit={habit}
                    onSelectDate={(id: number, date: string) => {
                      setSelectedDates(prev => {
                        const newMap = new Map(prev);
                        newMap.set(id, date);
                        return newMap;
                      });
                    }}
                    isCompletedOnDate={(date: string) => isHabitCompletedOnDate(habit.id, date)}
                    selectedDate={selectedDates.get(habit.id) || todayString}
                  />
                </div>
                {
                  (() => {
                    const selectedDate = selectedDates.get(habit.id) || todayString;
                    const isSelectedDateDone = isHabitCompletedOnDate(habit.id, selectedDate);
                    return (
                      <button
                        onClick={() => toggleDone(habit.id, selectedDate)}
                        className={isSelectedDateDone
                          ? 'mt-6 w-full py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50'
                          : 'mt-6 w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600'
                        }
                      >
                        {isSelectedDateDone ? 'Mark as not done' : 'Mark as done'}
                      </button>
                    );
                  })()
                }
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-md"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="flex items-center space-x-2 text-xl font-semibold text-gray-900 mb-4">
              <PlusIcon className="h-5 w-5 text-green-600" />
              <span>Add New Habit</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="habitName" className="block text-sm font-medium text-gray-700">
                  Habit Name
                </label>
                <input
                  id="habitName"
                  type="text"
                  value={habitName}
                  onChange={e => setHabitName(e.target.value)}
                  placeholder="e.g., Morning Workout, Read for 30 minutes"
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label htmlFor="habitDesc" className="block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  id="habitDesc"
                  rows={4}
                  value={habitDesc}
                  onChange={e => setHabitDesc(e.target.value)}
                  placeholder="Add more details about your habit..."
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;