
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const CalendarPage = () => {
  const { jobs, ships, components } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getJobsForDate = (date: Date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return jobs.filter(job => job.scheduledDate === dateString);
  };

  const getSelectedDateJobs = () => {
    return getJobsForDate(selectedDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
        <p className="text-gray-600">View scheduled maintenance jobs by date</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    ›
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2 h-20"></div>;
                  }
                  
                  const dayJobs = getJobsForDate(day);
                  const isSelected = selectedDate.toDateString() === day.toDateString();
                  const isToday = new Date().toDateString() === day.toDateString();
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 h-20 border cursor-pointer hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                      } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayJobs.slice(0, 2).map(job => (
                          <div
                            key={job.id}
                            className={`w-2 h-2 rounded-full ${getPriorityColor(job.priority)}`}
                            title={`${job.type} - ${job.priority}`}
                          ></div>
                        ))}
                        {dayJobs.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayJobs.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Jobs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Jobs for {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getSelectedDateJobs().length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No jobs scheduled for this date
                </p>
              ) : (
                <div className="space-y-4">
                  {getSelectedDateJobs().map(job => {
                    const ship = ships.find(s => s.id === job.shipId);
                    const component = components.find(c => c.id === job.componentId);
                    
                    return (
                      <div key={job.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{job.type}</h4>
                          <Badge className={`text-xs ${
                            job.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                            job.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Ship: {ship?.name}</p>
                          <p>Component: {component?.name}</p>
                          <p>Status: {job.status}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
