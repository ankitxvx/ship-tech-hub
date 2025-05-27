
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Job } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface JobFormProps {
  job?: Job | null;
  shipId?: string;
  onClose: () => void;
}

const JobForm = ({ job, shipId, onClose }: JobFormProps) => {
  const { addJob, updateJob, getComponentsByShip, ships, components } = useData();
  const [formData, setFormData] = useState({
    shipId: shipId || '',
    componentId: '',
    type: 'Inspection' as Job['type'],
    priority: 'Medium' as Job['priority'],
    status: 'Open' as Job['status'],
    assignedEngineerId: '3', // Default to Engineer
    scheduledDate: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (job) {
      setFormData({
        shipId: job.shipId,
        componentId: job.componentId,
        type: job.type,
        priority: job.priority,
        status: job.status,
        assignedEngineerId: job.assignedEngineerId,
        scheduledDate: job.scheduledDate,
        description: job.description || ''
      });
    }
  }, [job]);

  const availableComponents = formData.shipId ? getComponentsByShip(formData.shipId) : [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.shipId) {
      newErrors.shipId = 'Ship selection is required';
    }

    if (!formData.componentId) {
      newErrors.componentId = 'Component selection is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (job) {
        updateJob(job.id, formData);
      } else {
        addJob(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset component selection when ship changes
    if (field === 'shipId') {
      setFormData(prev => ({ ...prev, componentId: '' }));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {job ? 'Edit Job' : 'Create New Job'}
          </DialogTitle>
          <DialogDescription>
            {job ? 'Update the job details below.' : 'Enter the details for the new maintenance job.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="shipId" className="block text-sm font-medium text-gray-700 mb-1">
                Ship *
              </label>
              <Select value={formData.shipId} onValueChange={(value) => handleChange('shipId', value)}>
                <SelectTrigger className={errors.shipId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select ship" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shipId && (
                <p className="mt-1 text-sm text-red-600">{errors.shipId}</p>
              )}
            </div>

            <div>
              <label htmlFor="componentId" className="block text-sm font-medium text-gray-700 mb-1">
                Component *
              </label>
              <Select 
                value={formData.componentId} 
                onValueChange={(value) => handleChange('componentId', value)}
                disabled={!formData.shipId}
              >
                <SelectTrigger className={errors.componentId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {availableComponents.map((component) => (
                    <SelectItem key={component.id} value={component.id}>
                      {component.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.componentId && (
                <p className="mt-1 text-sm text-red-600">{errors.componentId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value as Job['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Replacement">Replacement</SelectItem>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value as Job['priority'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value as Job['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date *
              </label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleChange('scheduledDate', e.target.value)}
                className={errors.scheduledDate ? 'border-red-500' : ''}
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter job description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
