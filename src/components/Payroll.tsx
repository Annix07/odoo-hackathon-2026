import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { IndianRupee, Download, CheckCircle2, FileText } from 'lucide-react';
import { User } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const Payroll: React.FC = () => {
  const { currentUser, users, updateUser } = useAppContext();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editBasicPay, setEditBasicPay] = useState<number>(0);
  const [editHra, setEditHra] = useState<number>(0);
  const [editSpecialAllowance, setEditSpecialAllowance] = useState<number>(0);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPayslip = () => {
    if (!currentUser) return;
    const grossMonthly = currentUser.basicPay + currentUser.hra + currentUser.specialAllowance;
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('HRSync', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('123 Corporate Ave, Tech District, NY 10001', 14, 26);
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text('PAYSLIP', 14, 40);
    
    doc.setFontSize(11);
    doc.text(`For the month of ${month} ${year}`, 14, 46);

    // Employee Details
    autoTable(doc, {
      startY: 55,
      head: [['Employee Details', '']],
      body: [
        ['Name', currentUser.name],
        ['Employee ID', currentUser.employeeId],
        ['Department', currentUser.department],
        ['Designation', currentUser.designation],
      ],
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } }
    });

    // Earnings Details
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Earnings', 'Amount (INR)']],
      body: [
        ['Basic Pay', `Rs. ${currentUser.basicPay.toLocaleString()}`],
        ['House Rent Allowance (HRA)', `Rs. ${currentUser.hra.toLocaleString()}`],
        ['Special Allowance', `Rs. ${currentUser.specialAllowance.toLocaleString()}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [224, 231, 255], textColor: [37, 99, 235], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 100 } }
    });

    // Total
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY,
      body: [
        ['Gross Monthly Earnings', `Rs. ${grossMonthly.toLocaleString()}`],
      ],
      theme: 'grid',
      bodyStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 100 } }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 30;

    // Company Stamp Placeholder
    doc.setDrawColor(200, 200, 200);
    doc.circle(105, finalY + 15, 15, 'S'); // x, y, r, style
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('Company', 105, finalY + 13, { align: 'center' });
    doc.text('Stamp', 105, finalY + 18, { align: 'center' });

    // Signature
    if (signatureImage) {
      try {
        const format = signatureImage.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(signatureImage, format, 150, finalY, 40, 20);
      } catch (e) {
        console.warn('Failed to add signature image', e);
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text('Verified', 160, finalY + 15);
      }
    } else {
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('Verified', 160, finalY + 15);
    }
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Verified Signature', 170, finalY - 2, { align: 'center' });
    
    doc.setDrawColor(150, 150, 150);
    doc.line(150, finalY + 22, 190, finalY + 22);
    
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Head of the Company', 170, finalY + 28, { align: 'center' });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system generated document and does not require signature.', 14, finalY + 45);

    doc.save(`Payslip_${currentUser.name.replace(/\s+/g, '_')}_${month}_${year}.pdf`);
  };

  if (!currentUser) return null;
  const isAdmin = currentUser.role === 'Admin';

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditBasicPay(user.basicPay);
    setEditHra(user.hra);
    setEditSpecialAllowance(user.specialAllowance);
  };

  const handleSave = (user: User) => {
    updateUser({ 
      ...user, 
      basicPay: editBasicPay, 
      hra: editHra, 
      specialAllowance: editSpecialAllowance 
    });
    setEditingUserId(null);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Salary Details</h2>
          <p className="text-lg text-slate-600 mt-2">View your current compensation structure</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mr-4">
                <IndianRupee className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gross Monthly Salary</p>
                <p className="text-4xl font-bold text-slate-900">₹{(currentUser.basicPay + currentUser.hra + currentUser.specialAllowance).toLocaleString()}</p>
                <p className="text-sm text-slate-500 mt-1">Per month</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Active
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Salary Breakdown (Monthly)</h3>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Basic Pay</span>
              <span className="font-medium text-slate-900">₹{currentUser.basicPay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">House Rent Allowance</span>
              <span className="font-medium text-slate-900">₹{currentUser.hra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Special Allowance</span>
              <span className="font-medium text-slate-900">₹{currentUser.specialAllowance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-4 text-lg font-bold">
              <span className="text-slate-900">Gross Monthly</span>
              <span className="text-indigo-600">₹{(currentUser.basicPay + currentUser.hra + currentUser.specialAllowance).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="max-w-xs mx-auto">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Authorized Signature (JPG/PNG)</label>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/jpg" 
                onChange={handleSignatureUpload} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            
            <div className="text-center mt-6">
              <button 
                onClick={downloadPayslip}
                className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Latest Payslip
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payroll Report", 14, 15);
    const tableData = users.map(user => {
      const gross = user.basicPay + user.hra + user.specialAllowance;
      return [user.name, user.department, `Rs. ${user.basicPay}`, `Rs. ${user.hra}`, `Rs. ${user.specialAllowance}`, `Rs. ${gross}`];
    });
    
    autoTable(doc, {
      head: [['Employee', 'Department', 'Basic', 'HRA', 'Special', 'Gross']],
      body: tableData,
      startY: 20,
    });
    doc.save("payroll_report.pdf");
  };

  const handleExportExcel = () => {
    const tableData = users.map(user => {
      const gross = user.basicPay + user.hra + user.specialAllowance;
      return {
        Employee: user.name,
        Department: user.department,
        Basic: user.basicPay,
        HRA: user.hra,
        Special: user.specialAllowance,
        Gross: gross
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    XLSX.writeFile(wb, "payroll_report.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Payroll Management</h2>
          <p className="text-lg text-slate-600 mt-2">Manage employee salary structures</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" /> PDF
          </button>
          <button onClick={handleExportExcel} className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
            <Download className="w-4 h-4 mr-2" /> Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department / Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Monthly</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-3" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-slate-900">{user.department}</p>
                    <p className="text-xs text-slate-500">{user.designation}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === user.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500 w-16">Basic</span>
                          <div className="flex items-center">
                            <span className="text-slate-500 mr-1">₹</span>
                            <input 
                              type="number" 
                              value={editBasicPay} 
                              onChange={(e) => setEditBasicPay(parseInt(e.target.value) || 0)}
                              className="w-24 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500 w-16">HRA</span>
                          <div className="flex items-center">
                            <span className="text-slate-500 mr-1">₹</span>
                            <input 
                              type="number" 
                              value={editHra} 
                              onChange={(e) => setEditHra(parseInt(e.target.value) || 0)}
                              className="w-24 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-500 w-16">Special</span>
                          <div className="flex items-center">
                            <span className="text-slate-500 mr-1">₹</span>
                            <input 
                              type="number" 
                              value={editSpecialAllowance} 
                              onChange={(e) => setEditSpecialAllowance(parseInt(e.target.value) || 0)}
                              className="w-24 border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-mono font-medium text-slate-900">
                          ₹{(user.basicPay + user.hra + user.specialAllowance).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase">
                          B: ₹{user.basicPay.toLocaleString()} | H: ₹{user.hra.toLocaleString()} | S: ₹{user.specialAllowance.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {editingUserId === user.id ? (
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setEditingUserId(null)}
                          className="text-xs font-medium text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSave(user)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Update Salary
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
