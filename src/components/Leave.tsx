import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, X, Plus, Download, FileText } from 'lucide-react';
import { LeaveType } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const Leave: React.FC = () => {
  const { currentUser, users, leaveRequests, addLeaveRequest, updateLeaveRequestStatus } = useAppContext();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form State
  const [type, setType] = useState<LeaveType>('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');

  if (!currentUser) return null;
  const isAdmin = currentUser.role === 'Admin';

  const requests = isAdmin ? leaveRequests : leaveRequests.filter(l => l.userId === currentUser.id);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest({
      userId: currentUser.id,
      type,
      startDate,
      endDate,
      remarks
    });
    setShowApplyModal(false);
    setStartDate('');
    setEndDate('');
    setRemarks('');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Leave Report", 14, 15);
    const tableData = requests.map(r => {
      const u = users.find(user => user.id === r.userId);
      return [u?.name || 'Unknown', r.type, r.startDate, r.endDate, r.status];
    });
    
    autoTable(doc, {
      head: [['Employee', 'Type', 'Start Date', 'End Date', 'Status']],
      body: tableData,
      startY: 20,
    });
    doc.save("leave_report.pdf");
  };

  const handleExportExcel = () => {
    const tableData = requests.map(r => {
      const u = users.find(user => user.id === r.userId);
      return {
        Employee: u?.name || 'Unknown',
        Type: r.type,
        'Start Date': r.startDate,
        'End Date': r.endDate,
        Status: r.status
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leave");
    XLSX.writeFile(wb, "leave_report.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Leave & Time-Off</h2>
          <p className="text-lg text-slate-600 mt-2">Manage leave requests and balances</p>
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
          {!isAdmin && (
            <button 
              onClick={() => setShowApplyModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply Leave
            </button>
          )}
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Apply for Leave</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select 
                  value={type} onChange={e => setType(e.target.value as LeaveType)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date" required value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                <textarea 
                  required value={remarks} onChange={e => setRemarks(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Reason for leave..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {isAdmin && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.slice().reverse().map(req => {
                const user = users.find(u => u.id === req.userId);
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img src={user?.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-3" />
                          <span className="text-sm font-medium text-slate-900">{user?.name}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-900">{req.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-600">
                        <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                        {req.startDate} to {req.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-sm text-slate-600" title={req.remarks}>
                      {req.remarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => updateLeaveRequestStatus(req.id, 'Approved', 'Approved by Admin')}
                              className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateLeaveRequestStatus(req.id, 'Rejected', 'Rejected by Admin')}
                              className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">{req.adminComments || 'No comments'}</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
