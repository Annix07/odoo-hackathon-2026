import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, subDays, isSameDay } from 'date-fns';
import { Clock, LogIn, LogOut, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const Attendance: React.FC = () => {
  const { currentUser, users, attendanceRecords, checkIn, checkOut } = useAppContext();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');

  if (!currentUser) return null;
  const isAdmin = currentUser.role === 'Admin';

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Filter records based on role
  const records = isAdmin 
    ? attendanceRecords 
    : attendanceRecords.filter(a => a.userId === currentUser.id);

  // Check if current user is checked in today
  const myTodayRecord = attendanceRecords.find(a => a.userId === currentUser.id && a.date === todayStr);
  const isCheckedIn = !!myTodayRecord;
  const isCheckedOut = !!myTodayRecord?.checkOut;

  // Generate last 7 days for weekly view
  const last7Days = Array.from({ length: 7 }).map((_, i) => format(subDays(today, i), 'yyyy-MM-dd')).reverse();

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 15);
    const tableData = records.map(r => {
      const u = users.find(user => user.id === r.userId);
      return [u?.name || 'Unknown', r.date, r.checkIn || '--', r.checkOut || '--', r.status];
    });
    
    autoTable(doc, {
      head: [['Employee', 'Date', 'Check In', 'Check Out', 'Status']],
      body: tableData,
      startY: 20,
    });
    doc.save("attendance_report.pdf");
  };

  const handleExportExcel = () => {
    const tableData = records.map(r => {
      const u = users.find(user => user.id === r.userId);
      return {
        Employee: u?.name || 'Unknown',
        Date: r.date,
        'Check In': r.checkIn || '--',
        'Check Out': r.checkOut || '--',
        Status: r.status
      };
    });
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, "attendance_report.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Attendance Tracking</h2>
          <p className="text-lg text-slate-600 mt-2">Manage and view attendance records</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <div className="flex gap-2">
              <button onClick={handleExportPDF} className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                <FileText className="w-4 h-4 mr-2" /> PDF
              </button>
              <button onClick={handleExportExcel} className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                <Download className="w-4 h-4 mr-2" /> Excel
              </button>
            </div>
          )}
          <div className="bg-slate-100 p-1 rounded-lg flex text-sm">
            <button 
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${viewMode === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Daily View
            </button>
            <button 
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Weekly View
            </button>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Today's Status</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">
                {isCheckedOut ? 'Checked Out' : isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => checkIn(currentUser.id)}
              disabled={isCheckedIn}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                !isCheckedIn 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Check In
            </button>
            <button 
              onClick={() => checkOut(currentUser.id)}
              disabled={!isCheckedIn || isCheckedOut}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isCheckedIn && !isCheckedOut
                  ? 'bg-amber-600 text-white hover:bg-amber-700' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Check Out
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {viewMode === 'daily' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {records.filter(r => r.date === todayStr).map(record => {
                  const user = users.find(u => u.id === record.userId);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={user?.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-3" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{record.checkIn || '--:--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{record.checkOut || '--:--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                          record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'Half-day' ? 'bg-amber-100 text-amber-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {records.filter(r => r.date === todayStr).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      No attendance records for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">Employee</th>
                  {last7Days.map(date => (
                    <th key={date} className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                      {format(new Date(date), 'MMM d')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(isAdmin ? users : [currentUser]).map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                      <div className="flex items-center">
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    {last7Days.map(date => {
                      const record = attendanceRecords.find(a => a.userId === user.id && a.date === date);
                      return (
                        <td key={date} className="px-4 py-4 whitespace-nowrap text-center">
                          {record ? (
                             <span className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto ${
                              record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                              record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                              record.status === 'Half-day' ? 'bg-amber-100 text-amber-700' :
                              'bg-indigo-100 text-indigo-700'
                            }`} title={`${record.status} ${record.checkIn ? `(${record.checkIn} - ${record.checkOut||'--'})` : ''}`}>
                              {record.status.charAt(0)}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
