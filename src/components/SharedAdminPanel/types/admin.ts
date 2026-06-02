/**
 * Shared Admin Panel Types
 * Common type definitions used across all admin components
 */

export interface AdminApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  team?: string;
  role: string;
  status: string;
  segment?: string;
  createdAt?: string;
}

export interface Segment {
  id: number;
  title: string;
  participants: number;
  prize: string;
  status: string;
  duration: string;
  color?: string;
}

export interface ActionState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface DialogState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  data?: any;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableState {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
