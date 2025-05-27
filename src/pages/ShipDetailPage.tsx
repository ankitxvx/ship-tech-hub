
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/roleUtils';
import { ArrowLeft, Plus, Edit, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ComponentForm from '../components/Components/ComponentForm';
import JobForm from '../components/Jobs/JobForm';

const ShipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getShipById, getComponentsByShip, getJobsByShip } = useData();
  const { user } = useAuth();
  
  const [isComponentFormOpen, setIsComponentFormOpen] = useState(false);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  const ship = id ? getShipById(id) : null;
  const components = id ? getComponentsByShip(id) : [];
  const jobs = id ? getJobsByShip(id) : [];

  const canCreate = hasPermission(user, 'create');
  const canEdit = hasPermission(user, 'update');

  if (!ship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ship not found</h2>
        <Button asChild>
          <Link to="/ships">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ships
          </Link>
        </Button>
      </div>
    );
  }

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

  const getJobStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/ships')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ships
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{ship.name}</h1>
            <p className="text-gray-600">IMO: {ship.imo} | Flag: {ship.flag}</p>
          </div>
        </div>
        <Badge className={getStatusColor(ship.status)}>
          {ship.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ship Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Ship Name</p>
              <p className="font-medium">{ship.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IMO Number</p>
              <p className="font-medium">{ship.imo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Flag</p>
              <p className="font-medium">{ship.flag}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(ship.status)}>
                {ship.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{components.length}</p>
              <p className="text-sm text-gray-600">Total Components</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length}
              </p>
              <p className="text-sm text-gray-600">Jobs in Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="jobs">Maintenance Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Ship Components</h3>
            {canCreate && (
              <Button onClick={() => setIsComponentFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((component) => (
              <Card key={component.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{component.name}</h4>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingComponent(component);
                          setIsComponentFormOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Serial: {component.serialNumber}</p>
                    <p>Installed: {new Date(component.installDate).toLocaleDateString()}</p>
                    <p>Last Maintenance: {new Date(component.lastMaintenanceDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {components.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No components added yet.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Maintenance Jobs</h3>
            {canCreate && components.length > 0 && (
              <Button onClick={() => setIsJobFormOpen(true)}>
                <Wrench className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {jobs.map((job) => {
              const component = components.find(c => c.id === job.componentId);
              return (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{job.type}</h4>
                        <p className="text-sm text-gray-600">Component: {component?.name}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getJobStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    {job.description && (
                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
            
            {jobs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No maintenance jobs scheduled.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isComponentFormOpen && (
        <ComponentForm
          component={editingComponent}
          shipId={ship.id}
          onClose={() => {
            setIsComponentFormOpen(false);
            setEditingComponent(null);
          }}
        />
      )}

      {isJobFormOpen && (
        <JobForm
          shipId={ship.id}
          onClose={() => setIsJobFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ShipDetailPage;
