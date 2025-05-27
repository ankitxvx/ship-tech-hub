
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/roleUtils';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import JobList from '../components/Jobs/JobList';
import JobForm from '../components/Jobs/JobForm';

const JobsPage = () => {
  const { jobs, ships, components } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [shipFilter, setShipFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const canCreate = hasPermission(user, 'create');

  const filteredJobs = jobs.filter(job => {
    const ship = ships.find(s => s.id === job.shipId);
    const component = components.find(c => c.id === job.componentId);
    
    const matchesSearch = 
      job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    const matchesShip = shipFilter === 'all' || job.shipId === shipFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesShip;
  });

  const handleCreateJob = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Jobs</h1>
          <p className="text-gray-600">Manage maintenance tasks and schedules</p>
        </div>
        
        {canCreate && (
          <Button onClick={handleCreateJob} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={shipFilter} onValueChange={setShipFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Ship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ships</SelectItem>
            {ships.map((ship) => (
              <SelectItem key={ship.id} value={ship.id}>
                {ship.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <JobList 
        jobs={filteredJobs}
        onEditJob={handleEditJob}
      />

      {isFormOpen && (
        <JobForm
          job={editingJob}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default JobsPage;
