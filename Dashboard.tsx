import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserCircle, Clock, Calendar as CalendarIcon, AlertCircle, CheckCircle2, Download, Bell, Gift, PartyPopper, Users, Building, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import CalendarWidget from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { currentUser, users, attendanceRecords, leaveRequests } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'Admin';

  // --- Admin Data Prep ---
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendanceRecords.filter(a => a.date === today && a.status === 'Present').length;
  const totalEmployees = users.filter(u => u.role === 'Employee').length;
  const absentToday = totalEmployees - presentToday; // Simplified
  const onLeaveToday = leaveRequests.filter(l => l.status === 'Approved' && l.startDate <= today && l.endDate >= today).length;
  
  const leaveStatsData = [
    { name: 'Approved', value: leaveRequests.filter(l => l.status === 'Approved').length },
    { name: 'Pending', value: leaveRequests.filter(l => l.status === 'Pending').length },
    { name: 'Rejected', value: leaveRequests.filter(l => l.status === 'Rejected').length },
  ];

  const attendanceTrendData = [
    { name: 'Mon', present: 40, absent: 5 },
    { name: 'Tue', present: 42, absent: 3 },
    { name: 'Wed', present: 41, absent: 4 },
    { name: 'Thu', present: 44, absent: 1 },
    { name: 'Fri', present: 43, absent: 2 },
  ];

  const payrollGraphData = [
    { name: 'Jan', amount: 40000 },
    { name: 'Feb', amount: 42000 },
    { name: 'Mar', amount: 41500 },
    { name: 'Apr', amount: 45000 },
    { name: 'May', amount: 46000 },
    { name: 'Jun', amount: 48000 },
  ];

  // --- Employee Data Prep ---
  const myLeaves = leaveRequests.filter(l => l.userId === currentUser.id);
  const myPendingLeaves = myLeaves.filter(l => l.status === 'Pending').length;
  
  const downloadAttendancePDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${currentUser.name}`, 14, 15);
    const tableData = attendanceRecords
      .filter(a => a.userId === currentUser.id)
      .map(a => [a.date, a.status, a.checkIn || '-', a.checkOut || '-']);
    
    autoTable(doc, {
      head: [['Date', 'Status', 'Check In', 'Check Out']],
      body: tableData,
      startY: 20,
    });
    doc.save(`Attendance_Report_${currentUser.name}.pdf`);
  };

  const downloadAttendanceWord = () => {
    const records = attendanceRecords.filter(a => a.userId === currentUser.id);
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Date")] }),
            new TableCell({ children: [new Paragraph("Status")] }),
            new TableCell({ children: [new Paragraph("Check In")] }),
            new TableCell({ children: [new Paragraph("Check Out")] }),
          ],
        }),
        ...records.map(a => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(a.date)] }),
            new TableCell({ children: [new Paragraph(a.status)] }),
            new TableCell({ children: [new Paragraph(a.checkIn || '-')] }),
            new TableCell({ children: [new Paragraph(a.checkOut || '-')] }),
          ],
        })),
      ],
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: `Attendance Report - ${currentUser.name}`, heading: "Heading1" }),
          table,
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Attendance_Report_${currentUser.name}.docx`);
    });
  };

  const holidays = [
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-11-04', name: 'Diwali' },
    { date: '2026-12-25', name: 'Christmas Day' },
  ];

  const notifications = [
    { id: 1, type: 'leave', text: 'Your leave request for next week has been approved.' },
    { id: 2, type: 'salary', text: 'Salary for June 2026 has been credited.' },
    { id: 3, type: 'alert', text: 'Company Townhall meeting tomorrow at 10 AM.' },
  ];

  if (isAdmin) {
    const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendanceRecords.filter(a => a.date === today && a.status === 'Present').length;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Dashboard</h2>
          <p className="text-lg text-slate-600 mt-2">Welcome back, {currentUser.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('profile')}
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-4 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Total Employees</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalEmployees}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('attendance')}
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-4 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Present Today</p>
              <h3 className="text-3xl font-bold text-slate-900">{presentToday}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('attendance')}
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4 shrink-0">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Absent Today</p>
              <h3 className="text-3xl font-bold text-slate-900">{absentToday}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('leave')}
          >
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mr-4 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">On Leave</p>
              <h3 className="text-3xl font-bold text-slate-900">{onLeaveToday}</h3>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h4 className="font-bold text-slate-900 mb-4">Leave Statistics</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leaveStatsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leaveStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h4 className="font-bold text-slate-900 mb-4">Attendance Trend</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#10b981" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h4 className="font-bold text-slate-900 mb-4">Monthly Payroll Overview</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="amount" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-900">Interactive Calendar</h4>
            </div>
            <div className="p-5 flex justify-center custom-calendar-wrapper">
              <CalendarWidget className="border-0 font-sans w-full" />
            </div>
          </div>
        </div>
      </div>
  );
  }

  // Employee Dashboard
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-lg text-slate-600 mt-2">Welcome back, {currentUser.name}</p>
        </div>
        <div className="flex gap-3 relative">
          <button onClick={downloadAttendancePDF} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Report (PDF)</span>
          </button>
          <button onClick={downloadAttendanceWord} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Report (Word)</span>
          </button>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 relative bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-slate-800">
                  Notifications
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 flex gap-3 items-start">
                      {n.type === 'leave' && <CalendarIcon className="w-4 h-4 text-amber-500 mt-0.5" />}
                      {n.type === 'salary' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />}
                      {n.type === 'alert' && <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5" />}
                      <p className="text-sm text-slate-700">{n.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'profile', label: 'My Profile', icon: UserCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
          { id: 'attendance', label: 'Attendance', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { id: 'leave', label: 'Leave Requests', icon: CalendarIcon, color: 'text-amber-600', bg: 'bg-amber-100', badge: myPendingLeaves },
          { id: 'payroll', label: 'Salary Details', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((card, index) => (
          <motion.div 
            key={card.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => setActiveTab(card.id)}
            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900">{card.label}</h3>
              {card.badge !== undefined && card.badge > 0 && (
                <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs font-bold">
                  {card.badge}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ID Card */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-2xl shadow-lg p-6 text-white flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
          
          <h3 className="text-xl font-bold mb-6 text-center w-full border-b border-white/20 pb-4 relative z-10">Employee ID Card</h3>
          <div className="w-24 h-24 bg-white p-1 rounded-full mb-4 relative z-10">
            <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
          <h4 className="text-xl font-bold relative z-10">{currentUser.name}</h4>
          <p className="text-blue-200 mb-1 relative z-10">{currentUser.designation}</p>
          <p className="text-sm font-mono bg-black/20 px-3 py-1 rounded-full mb-6 relative z-10">{currentUser.employeeId}</p>
          
          <div className="bg-white p-2 rounded-lg relative z-10">
            <QRCode value={`EMP:${currentUser.employeeId}`} size={80} />
          </div>
          <p className="text-[10px] text-blue-200 mt-4 relative z-10">Scan to verify identity</p>
        </div>

        {/* Holidays & Events */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-pink-500" />
                Upcoming Holidays
              </h4>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {holidays.map((h, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-red-500 uppercase">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-sm font-bold text-slate-900 leading-none">{new Date(h.date).getDate()}</span>
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{h.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 flex items-center">
                <PartyPopper className="w-5 h-5 mr-2 text-yellow-500" />
                Birthdays & Anniversaries
              </h4>
            </div>
            <div className="p-5 space-y-4 flex-1">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center shrink-0 text-amber-700">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Sarah Connor</p>
                  <p className="text-xs text-slate-600">Birthday Today!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center shrink-0 text-blue-700">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">John Smith</p>
                  <p className="text-xs text-slate-600">3rd Work Anniversary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-indigo-600" />
            Recent Activity
          </h4>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">LIVE</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="pl-4 border-l-2 border-slate-200">
            <p className="text-sm font-medium text-slate-900">System Update</p>
            <p className="text-xs text-slate-500 mt-1">Please review the updated HR policies in the documents section.</p>
            <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
          </div>
          {myLeaves.slice(-2).map(req => (
            <div key={req.id} className="pl-4 border-l-2 border-indigo-200">
              <p className="text-sm font-medium text-slate-900">Leave Request {req.status}</p>
              <p className="text-xs text-slate-500 mt-1">Your request for {req.type} leave from {req.startDate} to {req.endDate} is {req.status.toLowerCase()}.</p>
              <p className="text-xs text-slate-400 mt-1">Recently</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
