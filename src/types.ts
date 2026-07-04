export type Role = 'Employee' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  employeeId: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  basicPay: number;
  hra: number;
  specialAllowance: number;
  avatarUrl?: string;
  documents?: { [key: string]: string };
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  status: AttendanceStatus;
}

export type LeaveType = 'Paid' | 'Sick' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  type: LeaveType;
  remarks: string;
  status: LeaveStatus;
  adminComments?: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
}
