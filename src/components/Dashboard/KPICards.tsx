
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Ship, Wrench, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const KPICards = () => {
  const { ships, components, jobs } = useData();

  const totalShips = ships.length;
  const overdueComponents = components.filter(comp => {
    if (!comp.nextMaintenanceDate) return false;
    return new Date(comp.nextMaintenanceDate) < new Date();
  }).length;
  
  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  const kpis = [
    {
      title: 'Total Ships',
      value: totalShips,
      icon: Ship,
      color: 'bg-blue-500',
      change: null
    },
    {
      title: 'Overdue Maintenance',
      value: overdueComponents,
      icon: Clock,
      color: 'bg-red-500',
      change: null
    },
    {
      title: 'Jobs in Progress',
      value: jobsInProgress,
      icon: Wrench,
      color: 'bg-yellow-500',
      change: null
    },
    {
      title: 'Completed Jobs',
      value: completedJobs,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {kpi.title}
            </CardTitle>
            <div className={`${kpi.color} p-2 rounded-lg`}>
              <kpi.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
