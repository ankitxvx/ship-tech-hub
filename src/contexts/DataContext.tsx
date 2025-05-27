
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ship, Component, Job, Notification } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorageUtils';

interface DataContextType {
  ships: Ship[];
  components: Component[];
  jobs: Job[];
  notifications: Notification[];
  addShip: (ship: Omit<Ship, 'id'>) => void;
  updateShip: (id: string, ship: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, component: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  getShipById: (id: string) => Ship | undefined;
  getComponentById: (id: string) => Component | undefined;
  getJobById: (id: string) => Job | undefined;
  getComponentsByShip: (shipId: string) => Component[];
  getJobsByShip: (shipId: string) => Job[];
  getJobsByComponent: (componentId: string) => Job[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mockShips: Ship[] = [
  { id: "s1", name: "Ever Given", imo: "9811000", flag: "Panama", status: "Active", createdAt: "2024-01-15" },
  { id: "s2", name: "Maersk Alabama", imo: "9164263", flag: "USA", status: "Under Maintenance", createdAt: "2024-02-10" }
];

const mockComponents: Component[] = [
  { id: "c1", shipId: "s1", name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12", nextMaintenanceDate: "2025-03-12" },
  { id: "c2", shipId: "s2", name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01", nextMaintenanceDate: "2024-12-01" },
  { id: "c3", shipId: "s1", name: "Navigation System", serialNumber: "NAV-9012", installDate: "2021-03-22", lastMaintenanceDate: "2024-01-15", nextMaintenanceDate: "2025-01-15" }
];

const mockJobs: Job[] = [
  { id: "j1", componentId: "c1", shipId: "s1", type: "Inspection", priority: "High", status: "Open", assignedEngineerId: "3", scheduledDate: "2025-06-05", description: "Routine engine inspection", createdAt: "2024-12-01" },
  { id: "j2", componentId: "c2", shipId: "s2", type: "Repair", priority: "Critical", status: "In Progress", assignedEngineerId: "3", scheduledDate: "2025-05-28", description: "Radar calibration and repair", createdAt: "2024-11-28" }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize mock data
    const savedShips = getFromLocalStorage('ships') || mockShips;
    const savedComponents = getFromLocalStorage('components') || mockComponents;
    const savedJobs = getFromLocalStorage('jobs') || mockJobs;
    const savedNotifications = getFromLocalStorage('notifications') || [];

    setShips(savedShips);
    setComponents(savedComponents);
    setJobs(savedJobs);
    setNotifications(savedNotifications);

    // Save initial data if not exists
    if (!getFromLocalStorage('ships')) saveToLocalStorage('ships', mockShips);
    if (!getFromLocalStorage('components')) saveToLocalStorage('components', mockComponents);
    if (!getFromLocalStorage('jobs')) saveToLocalStorage('jobs', mockJobs);
    if (!getFromLocalStorage('notifications')) saveToLocalStorage('notifications', []);
  }, []);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addShip = (ship: Omit<Ship, 'id'>) => {
    const newShip = { ...ship, id: generateId(), createdAt: new Date().toISOString() };
    const updatedShips = [...ships, newShip];
    setShips(updatedShips);
    saveToLocalStorage('ships', updatedShips);
  };

  const updateShip = (id: string, shipUpdate: Partial<Ship>) => {
    const updatedShips = ships.map(ship => ship.id === id ? { ...ship, ...shipUpdate } : ship);
    setShips(updatedShips);
    saveToLocalStorage('ships', updatedShips);
  };

  const deleteShip = (id: string) => {
    const updatedShips = ships.filter(ship => ship.id !== id);
    setShips(updatedShips);
    saveToLocalStorage('ships', updatedShips);

    // Also remove related components and jobs
    const updatedComponents = components.filter(comp => comp.shipId !== id);
    setComponents(updatedComponents);
    saveToLocalStorage('components', updatedComponents);

    const updatedJobs = jobs.filter(job => job.shipId !== id);
    setJobs(updatedJobs);
    saveToLocalStorage('jobs', updatedJobs);
  };

  const addComponent = (component: Omit<Component, 'id'>) => {
    const newComponent = { ...component, id: generateId() };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    saveToLocalStorage('components', updatedComponents);
  };

  const updateComponent = (id: string, componentUpdate: Partial<Component>) => {
    const updatedComponents = components.map(comp => comp.id === id ? { ...comp, ...componentUpdate } : comp);
    setComponents(updatedComponents);
    saveToLocalStorage('components', updatedComponents);
  };

  const deleteComponent = (id: string) => {
    const updatedComponents = components.filter(comp => comp.id !== id);
    setComponents(updatedComponents);
    saveToLocalStorage('components', updatedComponents);

    // Also remove related jobs
    const updatedJobs = jobs.filter(job => job.componentId !== id);
    setJobs(updatedJobs);
    saveToLocalStorage('jobs', updatedJobs);
  };

  const addJob = (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob = { ...job, id: generateId(), createdAt: new Date().toISOString() };
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveToLocalStorage('jobs', updatedJobs);

    // Add notification
    addNotification({
      message: `New ${job.type} job created for ${components.find(c => c.id === job.componentId)?.name}`,
      type: 'job_created',
      read: false,
      jobId: newJob.id
    });
  };

  const updateJob = (id: string, jobUpdate: Partial<Job>) => {
    const updatedJobs = jobs.map(job => job.id === id ? { ...job, ...jobUpdate } : job);
    setJobs(updatedJobs);
    saveToLocalStorage('jobs', updatedJobs);

    // Add notification for status changes
    if (jobUpdate.status) {
      const job = jobs.find(j => j.id === id);
      if (job) {
        const component = components.find(c => c.id === job.componentId);
        addNotification({
          message: `Job ${jobUpdate.status} for ${component?.name}`,
          type: jobUpdate.status === 'Completed' ? 'job_completed' : 'job_updated',
          read: false,
          jobId: id
        });
      }
    }
  };

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
    saveToLocalStorage('jobs', updatedJobs);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString()
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  const markNotificationRead = (id: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  const dismissNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    saveToLocalStorage('notifications', updatedNotifications);
  };

  const getShipById = (id: string) => ships.find(ship => ship.id === id);
  const getComponentById = (id: string) => components.find(comp => comp.id === id);
  const getJobById = (id: string) => jobs.find(job => job.id === id);
  const getComponentsByShip = (shipId: string) => components.filter(comp => comp.shipId === shipId);
  const getJobsByShip = (shipId: string) => jobs.filter(job => job.shipId === shipId);
  const getJobsByComponent = (componentId: string) => jobs.filter(job => job.componentId === componentId);

  return (
    <DataContext.Provider value={{
      ships,
      components,
      jobs,
      notifications,
      addShip,
      updateShip,
      deleteShip,
      addComponent,
      updateComponent,
      deleteComponent,
      addJob,
      updateJob,
      deleteJob,
      addNotification,
      markNotificationRead,
      dismissNotification,
      getShipById,
      getComponentById,
      getJobById,
      getComponentsByShip,
      getJobsByShip,
      getJobsByComponent
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
