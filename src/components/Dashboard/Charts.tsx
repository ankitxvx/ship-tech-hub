
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const Charts = () => {
  const { jobs, ships } = useData();

  // Job status distribution
  const jobStatusData = [
    { name: 'Open', value: jobs.filter(j => j.status === 'Open').length },
    { name: 'In Progress', value: jobs.filter(j => j.status === 'In Progress').length },
    { name: 'Completed', value: jobs.filter(j => j.status === 'Completed').length },
    { name: 'Cancelled', value: jobs.filter(j => j.status === 'Cancelled').length }
  ];

  // Jobs by priority
  const priorityData = [
    { name: 'Low', value: jobs.filter(j => j.priority === 'Low').length },
    { name: 'Medium', value: jobs.filter(j => j.priority === 'Medium').length },
    { name: 'High', value: jobs.filter(j => j.priority === 'High').length },
    { name: 'Critical', value: jobs.filter(j => j.priority === 'Critical').length }
  ];

  // Ship status distribution
  const shipStatusData = [
    { name: 'Active', value: ships.filter(s => s.status === 'Active').length },
    { name: 'Maintenance', value: ships.filter(s => s.status === 'Under Maintenance').length },
    { name: 'Inactive', value: ships.filter(s => s.status === 'Inactive').length }
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];
  const PRIORITY_COLORS = ['#6B7280', '#3B82F6', '#F59E0B', '#EF4444'];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {jobStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jobs by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ship Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={shipStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {shipStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{job.type}</p>
                  <p className="text-xs text-gray-600">
                    Priority: {job.priority} | Status: {job.status}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(job.scheduledDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
