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
    email: string;
    name: string;
  };
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
  
  // Get current user profile
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
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
