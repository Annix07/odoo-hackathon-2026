import { User, AttendanceRecord, LeaveRequest } from './types';
import { format, subDays, addDays } from 'date-fns';

const today = new Date();

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'admin@hrsync.com',
    name: 'Sarah Jenkins',
    role: 'Admin',
    employeeId: 'EMP-001',
    phone: '+1 (555) 123-4567',
    address: '123 Corporate Blvd, Suite 100, Tech City',
    department: 'Human Resources',
    designation: 'HR Director',
    basicPay: 60000,
    hra: 40000,
    specialAllowance: 20000,
    avatarUrl: 'https://i.pravatar.cc/150?u=u1',
  },
  {
    id: 'u2',
    email: 'employee@hrsync.com',
    name: 'Marcus Chen',
    role: 'Employee',
    employeeId: 'EMP-042',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Way, Apt 4B, Tech City',
    department: 'Engineering',
    designation: 'Frontend Developer',
    basicPay: 45000,
    hra: 30000,
    specialAllowance: 10000,
    avatarUrl: 'https://i.pravatar.cc/150?u=u2',
  },
  {
    id: 'u3',
    email: 'jdoe@hrsync.com',
    name: 'Jane Doe',
    role: 'Employee',
    employeeId: 'EMP-043',
    phone: '+1 (555) 111-2222',
    address: '789 Startup Ave, Tech City',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    basicPay: 35000,
    hra: 25000,
    specialAllowance: 10000,
    avatarUrl: 'https://i.pravatar.cc/150?u=u3',
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'a1',
    userId: 'u2',
    date: format(today, 'yyyy-MM-dd'),
    checkIn: '09:00',
    status: 'Present',
  },
  {
    id: 'a2',
    userId: 'u2',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    checkIn: '08:55',
    checkOut: '17:05',
    status: 'Present',
  },
  {
    id: 'a3',
    userId: 'u2',
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    checkIn: '09:15',
    checkOut: '13:00',
    status: 'Half-day',
  },
  {
    id: 'a4',
    userId: 'u3',
    date: format(today, 'yyyy-MM-dd'),
    status: 'Absent',
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'l1',
    userId: 'u2',
    startDate: format(addDays(today, 5), 'yyyy-MM-dd'),
    endDate: format(addDays(today, 7), 'yyyy-MM-dd'),
    type: 'Paid',
    remarks: 'Family vacation',
    status: 'Pending',
  },
  {
    id: 'l2',
    userId: 'u3',
    startDate: format(subDays(today, 5), 'yyyy-MM-dd'),
    endDate: format(subDays(today, 4), 'yyyy-MM-dd'),
    type: 'Sick',
    remarks: 'Flu',
    status: 'Approved',
    adminComments: 'Get well soon!',
  }
];
