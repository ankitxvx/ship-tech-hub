
export interface User {
  id: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  email: string;
  password?: string;
  name: string;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  createdAt?: string;
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate?: string;
}

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Preventive';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'job_created' | 'job_updated' | 'job_completed';
  timestamp: string;
  read: boolean;
  jobId?: string;
}
