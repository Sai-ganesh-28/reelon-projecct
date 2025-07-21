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
import { authService, habitService, Habit as HabitType } from '../services/api';

export interface Habit {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  completions?: {
    id: number;
    habit_id: number;
    completed_date: string;
    created_at: string;
    updated_at: string;
  }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [completions, setCompletions] = useState<Map<string, Set<number>>>(new Map());

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

  const fetchHabits = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedHabits = await habitService.getHabits();
      setHabits(fetchedHabits);
      
      const completionsMap = new Map<string, Set<number>>();
      
      fetchedHabits.forEach(habit => {
        if (habit.completions && habit.completions.length > 0) {
          habit.completions.forEach((completion: { completed_date: string }) => {
            const dateStr = new Date(completion.completed_date).toISOString().split('T')[0];
            if (!completionsMap.has(dateStr)) {
              completionsMap.set(dateStr, new Set<number>());
            }
            completionsMap.get(dateStr)?.add(habit.id);
          });
        }
      });
      
      if (!completionsMap.has(todayString)) {
        completionsMap.set(todayString, new Set<number>());
      }
      
      setCompletions(completionsMap);
    } catch (err) {
      console.error('Failed to fetch habits:', err);
      setError('Failed to load habits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);
  

  useEffect(() => {
    if (habits.length > 0) {
      const newCompletions = new Map<string, Set<number>>(completions);
      

      habits.forEach(habit => {
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const localStorageKey = `habit_completion_${habit.id}_${dateStr}`;
          const isCompleted = localStorage.getItem(localStorageKey) === 'true';
          
          if (isCompleted) {
            if (!newCompletions.has(dateStr)) {
              newCompletions.set(dateStr, new Set<number>());
            }
            newCompletions.get(dateStr)?.add(habit.id);
          }
        }
      });
      
      setCompletions(newCompletions);
    }
  }, [habits]);

    // todays date
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const todayString = getTodayString();

  // current date
  const [selectedDates, setSelectedDates] = useState<Map<number, string>>(new Map());


  useEffect(() => {
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

  
  useEffect(() => {
    setCompletions(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(todayString)) {
        newMap.set(todayString, new Set<number>());
      }
      return newMap;
    });
  }, [todayString]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddHabit = async () => {
    if (!habitName.trim()) return;

    try {
      if (editingHabitId) {
        const updatedHabit = await habitService.updateHabit(editingHabitId, {
          name: habitName,
          description: habitDesc || undefined,
        });

        setHabits(habits.map(h => (h.id === editingHabitId ? updatedHabit : h)));
        setEditingHabitId(null);
      } else {
        const newHabit = await habitService.createHabit({
          name: habitName,
          description: habitDesc || undefined,
        });

        setHabits([...habits, newHabit]);
      }

      setHabitName('');
      setHabitDesc('');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save habit:', err);
      setError('Failed to save habit. Please try again.');
    }
  };


  const handleLogout = () => {
    authService.removeToken();
    navigate('/');
  };


  const handleEdit = (id: number) => {
    const habitToEdit = habits.find(h => h.id === id);
    if (habitToEdit) {
      setHabitName(habitToEdit.name);
      setHabitDesc(habitToEdit.description || '');
      setEditingHabitId(id);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await habitService.deleteHabit(id);
      setHabits(prev => prev.filter(h => h.id !== id));


      setCompletions(prev => {
        const newMap = new Map(prev);


        newMap.forEach((dateCompletions, date) => {
          if (dateCompletions.has(id)) {
            const newDateCompletions = new Set(dateCompletions);
            newDateCompletions.delete(id);
            newMap.set(date, newDateCompletions);
          }
        });

        return newMap;
      });
    } catch (err) {
      console.error('Failed to delete habit:', err);
      setError('Failed to delete habit. Please try again.');
    }
  };


  const toggleDone = async (habitId: number, date: string) => {
    try {
      const result = await habitService.toggleCompletion(habitId, date);
      const localStorageKey = `habit_completion_${habitId}_${date}`;
      if (result.completed) {
        localStorage.setItem(localStorageKey, 'true');
      } else {
        localStorage.removeItem(localStorageKey);
      }

      setCompletions(prev => {
        const newCompletions = new Map(prev);
        const dateCompletions = newCompletions.get(date) || new Set<number>();

        if (result.completed) {
          dateCompletions.add(habitId);
        } else {
          dateCompletions.delete(habitId);
        }

        newCompletions.set(date, dateCompletions);
        

        const allHabitsForDate = habits.map(h => h.id);
        const allCompleted = allHabitsForDate.length > 0 && 
                            allHabitsForDate.every(id => dateCompletions.has(id));
        
        if (allCompleted && date === todayString) {
          setTimeout(() => fetchHabits(), 500); 
        }
        
        return newCompletions;
      });
    } catch (err) {
      console.error('Failed to toggle habit completion:', err);
      setError('Failed to update habit completion. Please try again.');
    }
  };

  const isHabitCompletedOnDate = (habitId: number, dateString: string): boolean => {
    const dateCompletions = completions.get(dateString);
    return dateCompletions ? dateCompletions.has(habitId) : false;
  };


  const todayCompletions = completions.get(todayString) || new Set<number>();
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
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              className="float-right font-bold"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
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
              
            </div>

            {/* Habit Cards */}
            {habits.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
                <p className="text-gray-500 mb-4">Create your first habit to start tracking your progress</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {habits.map(habit => {
                  const isDone = isHabitCompletedOnDate(habit.id, todayString);
                  const createdAt = new Date(habit.created_at).toISOString().split('T')[0]; 

                  return (
                    <div
                      key={habit.id}
                      className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm relative"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                      {habit.description && (
                        <p className="mt-1 text-sm text-gray-600">{habit.description}</p>
                      )}
                      {habit.streak && (
                        <div className="mt-2 flex items-center">
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(habit.id)}
                          className="p-1 hover:bg-gray-100 rounded-md"
                        >
                          <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(habit.id)}
                          className="p-1 hover:bg-gray-100 rounded-md"
                        >
                          <TrashIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                      <div className="mt-6">
                        <HabitCalendar
                          habit={{ ...habit, createdAt: createdAt }} 
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
                      {(() => {
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
                      })()}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
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
              <span>{editingHabitId ? 'Edit Habit' : 'Add New Habit'}</span>
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
                  value={habitDesc}
                  onChange={e => setHabitDesc(e.target.value)}
                  placeholder="e.g., 30 minutes of exercise to start the day"
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHabit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  {editingHabitId ? 'Update Habit' : 'Add Habit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;