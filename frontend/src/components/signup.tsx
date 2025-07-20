import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Password validation
  useEffect(() => {
    if (password) {
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        setIsPasswordValid(false);
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setPasswordError('Password must contain at least 1 special character');
        setIsPasswordValid(false);
      } else {
        setPasswordError('');
        setIsPasswordValid(true);
      }
    } else {
      setPasswordError('');
      setIsPasswordValid(false);
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid) {
      console.log('Form submitted:', { fullName, email, password });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-green-600 px-8 py-6 text-white">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="opacity-80">Sign up for a new account</p>
          </div>
          
          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`pl-10 w-full py-3 px-4 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${passwordError ? 'focus:ring-red-500' : 'focus:ring-green-500'} focus:border-transparent transition-all duration-200`}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Password must be at least 8 characters long and contain at least 1 special character.
                </p>
              </div>

              <button
                type="submit"
                disabled={!isPasswordValid}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${isPasswordValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
              >
                Sign up
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/" className="font-medium text-green-600 hover:text-green-700 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
