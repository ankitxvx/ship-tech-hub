
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Component } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface ComponentFormProps {
  component?: Component | null;
  shipId: string;
  onClose: () => void;
}

const ComponentForm = ({ component, shipId, onClose }: ComponentFormProps) => {
  const { addComponent, updateComponent } = useData();
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name,
        serialNumber: component.serialNumber,
        installDate: component.installDate,
        lastMaintenanceDate: component.lastMaintenanceDate
      });
    }
  }, [component]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.installDate) {
      newErrors.installDate = 'Installation date is required';
    }

    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
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
      // Calculate next maintenance date (1 year from last maintenance)
      const nextMaintenanceDate = new Date(formData.lastMaintenanceDate);
      nextMaintenanceDate.setFullYear(nextMaintenanceDate.getFullYear() + 1);

      const componentData = {
        ...formData,
        shipId,
        nextMaintenanceDate: nextMaintenanceDate.toISOString().split('T')[0]
      };

      if (component) {
        updateComponent(component.id, componentData);
      } else {
        addComponent(componentData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {component ? 'Edit Component' : 'Add New Component'}
          </DialogTitle>
          <DialogDescription>
            {component ? 'Update the component details below.' : 'Enter the details for the new component.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Component Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter component name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Serial Number *
            </label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              placeholder="Enter serial number"
              className={errors.serialNumber ? 'border-red-500' : ''}
            />
            {errors.serialNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="installDate" className="block text-sm font-medium text-gray-700 mb-1">
              Installation Date *
            </label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) => handleChange('installDate', e.target.value)}
              className={errors.installDate ? 'border-red-500' : ''}
            />
            {errors.installDate && (
              <p className="mt-1 text-sm text-red-600">{errors.installDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700 mb-1">
              Last Maintenance Date *
            </label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
              className={errors.lastMaintenanceDate ? 'border-red-500' : ''}
            />
            {errors.lastMaintenanceDate && (
              <p className="mt-1 text-sm text-red-600">{errors.lastMaintenanceDate}</p>
            )}
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
              {isSubmitting ? 'Saving...' : component ? 'Update Component' : 'Add Component'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentForm;
