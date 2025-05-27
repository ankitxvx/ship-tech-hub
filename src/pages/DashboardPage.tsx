
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import KPICards from '../components/Dashboard/KPICards';
import Charts from '../components/Dashboard/Charts';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
      </div>

      <KPICards />
      
      <Charts />
    </div>
  );
};

export default DashboardPage;
