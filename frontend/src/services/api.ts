const API_URL = 'http://localhost:3000/api/v1';


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Habit {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  streak?: Streak;
  completions?: Completion[];
}

export interface Streak {
  id: number;
  habit_id: number;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export interface Completion {
  id: number;
  habit_id: number;
  completed_date: string;
  created_at: string;
  updated_at: string;
}

const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = (data && data.errors) || (data && data.error) || response.statusText;
    return Promise.reject(error);
  }
  
  return data;
};

// Authentication service
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    return handleResponse(response);
  },
  
  // Register new user
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  },
  
  getCurrentUser: async (token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // save to local storage
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  // Get token from local storage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  // Remove token from local storage
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  // check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

// Habit API 
export const habitService = {
  getHabits: async (): Promise<Habit[]> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const response = await fetch(`${API_URL}/habits`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  getHabit: async (id: number): Promise<Habit> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const response = await fetch(`${API_URL}/habits/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  createHabit: async (habitData: { name: string; description?: string }): Promise<Habit> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const response = await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ habit: habitData }),
    });
    
    return handleResponse(response);
  },
  
  updateHabit: async (id: number, habitData: { name: string; description?: string }): Promise<Habit> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const response = await fetch(`${API_URL}/habits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ habit: habitData }),
    });
    
    return handleResponse(response);
  },
  
  deleteHabit: async (id: number): Promise<void> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const response = await fetch(`${API_URL}/habits/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status === 204) return;
    return handleResponse(response);
  },
  
  toggleCompletion: async (id: number, date?: string): Promise<{ habit_id: number; date: string; completed: boolean; streak: Streak }> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const dateParam = date ? `?date=${date}` : '';
    
    const response = await fetch(`${API_URL}/habits/${id}/toggle_completion${dateParam}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  getCompletions: async (habitId: number): Promise<Completion[]> => {
    const token = authService.getToken();
    if (!token) return Promise.reject('No authentication token');
    
    const response = await fetch(`${API_URL}/habits/${habitId}/completions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};
