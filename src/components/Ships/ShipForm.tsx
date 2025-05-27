
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Ship } from '../../types';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface ShipFormProps {
  ship?: Ship | null;
  onClose: () => void;
}

const ShipForm = ({ ship, onClose }: ShipFormProps) => {
  const { addShip, updateShip } = useData();
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active' as Ship['status']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ship) {
      setFormData({
        name: ship.name,
        imo: ship.imo,
        flag: ship.flag,
        status: ship.status
      });
    }
  }, [ship]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }

    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
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
      if (ship) {
        updateShip(ship.id, formData);
      } else {
        addShip(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving ship:', error);
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
            {ship ? 'Edit Ship' : 'Add New Ship'}
          </DialogTitle>
          <DialogDescription>
            {ship ? 'Update the ship details below.' : 'Enter the details for the new ship.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ship Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter ship name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="imo" className="block text-sm font-medium text-gray-700 mb-1">
              IMO Number *
            </label>
            <Input
              id="imo"
              value={formData.imo}
              onChange={(e) => handleChange('imo', e.target.value)}
              placeholder="Enter 7-digit IMO number"
              maxLength={7}
              className={errors.imo ? 'border-red-500' : ''}
            />
            {errors.imo && (
              <p className="mt-1 text-sm text-red-600">{errors.imo}</p>
            )}
          </div>

          <div>
            <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-1">
              Flag *
            </label>
            <Input
              id="flag"
              value={formData.flag}
              onChange={(e) => handleChange('flag', e.target.value)}
              placeholder="Enter flag country"
              className={errors.flag ? 'border-red-500' : ''}
            />
            {errors.flag && (
              <p className="mt-1 text-sm text-red-600">{errors.flag}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value as Ship['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              {isSubmitting ? 'Saving...' : ship ? 'Update Ship' : 'Add Ship'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipForm;
