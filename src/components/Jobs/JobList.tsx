
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { Job } from '../../types';
import { Edit, Trash2, Calendar, Wrench } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface JobListProps {
  jobs: Job[];
  onEditJob: (job: Job) => void;
}

const JobList = ({ jobs, onEditJob }: JobListProps) => {
  const { deleteJob, ships, components } = useData();
  const { user } = useAuth();

  const canEdit = hasPermission(user, 'update');
  const canDelete = hasPermission(user, 'delete');

  const handleDeleteJob = (job: Job) => {
    if (window.confirm(`Are you sure you want to delete this ${job.type} job?`)) {
      deleteJob(job.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">No maintenance jobs match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => {
        const ship = ships.find(s => s.id === job.shipId);
        const component = components.find(c => c.id === job.componentId);
        
        return (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Wrench className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.type}</h3>
                    <p className="text-sm text-gray-600">{ship?.name}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge className={getPriorityColor(job.priority)}>
                    {job.priority}
                  </Badge>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Component:</span>
                  <span className="font-medium">{component?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">
                    {new Date(job.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                {job.description && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Link 
                  to={`/ships/${job.shipId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View Ship
                </Link>

                <div className="flex space-x-2">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditJob(job)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteJob(job)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default JobList;
