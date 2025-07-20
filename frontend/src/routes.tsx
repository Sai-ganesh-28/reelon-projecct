import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
