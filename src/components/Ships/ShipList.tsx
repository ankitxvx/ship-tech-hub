
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { Ship } from '../../types';
import { Edit, Trash2, Eye, Ship as ShipIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface ShipListProps {
  ships: Ship[];
  onEditShip: (ship: Ship) => void;
}

const ShipList = ({ ships, onEditShip }: ShipListProps) => {
  const { deleteShip, getComponentsByShip, getJobsByShip } = useData();
  const { user } = useAuth();

  const canEdit = hasPermission(user, 'update');
  const canDelete = hasPermission(user, 'delete');

  const handleDeleteShip = (ship: Ship) => {
    if (window.confirm(`Are you sure you want to delete ${ship.name}? This will also delete all associated components and jobs.`)) {
      deleteShip(ship.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (ships.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ShipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ships found</h3>
          <p className="text-gray-500">Get started by adding your first ship to the fleet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ships.map((ship) => {
        const components = getComponentsByShip(ship.id);
        const jobs = getJobsByShip(ship.id);
        
        return (
          <Card key={ship.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShipIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{ship.name}</h3>
                    <p className="text-sm text-gray-600">IMO: {ship.imo}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(ship.status)}>
                  {ship.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Flag:</span>
                  <span className="font-medium">{ship.flag}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Components:</span>
                  <span className="font-medium">{components.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Jobs:</span>
                  <span className="font-medium">
                    {jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/ships/${ship.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                </Button>

                <div className="flex space-x-2">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditShip(ship)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteShip(ship)}
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

export default ShipList;
