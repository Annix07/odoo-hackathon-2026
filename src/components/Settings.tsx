import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings as SettingsIcon, Building, Briefcase, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Settings: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'departments' | 'roles' | 'holidays' | 'announcements'>('departments');

  if (!currentUser || currentUser.role !== 'Admin') return null;

  const [departments, setDepartments] = useState(['Engineering', 'Human Resources', 'Marketing', 'Sales']);
  const [roles, setRoles] = useState(['Software Engineer', 'HR Manager', 'Marketing Specialist', 'Sales Executive']);
  const [holidays, setHolidays] = useState([
    { id: 1, date: '2026-08-15', name: 'Independence Day' },
    { id: 2, date: '2026-10-02', name: 'Gandhi Jayanti' },
    { id: 3, date: '2026-11-04', name: 'Diwali' },
    { id: 4, date: '2026-12-25', name: 'Christmas Day' },
  ]);
  const [announcements, setAnnouncements] = useState([
    { id: 1, date: '2026-07-01', title: 'Q3 Townhall Meeting', desc: 'Join us for the quarterly townhall.' },
    { id: 2, date: '2026-07-05', title: 'New Office Policy', desc: 'Please review the updated WFH guidelines.' }
  ]);

  const handleDeleteItem = (type: string, item: any) => {
    if(confirm(`Delete this ${type}?`)) {
      alert('Deleted (Mock)');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin Settings</h2>
        <p className="text-lg text-slate-600 mt-2">Manage company structure and holidays</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('departments')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'departments' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building className="w-5 h-5 mr-3" /> Departments
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'roles' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-5 h-5 mr-3" /> Job Roles
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'holidays' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" /> Holidays
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'announcements' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building className="w-5 h-5 mr-3" /> Announcements
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h3>
            <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'departments' && departments.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-800">{d}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteItem('department', d)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'roles' && roles.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-800">{r}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteItem('role', r)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'holidays' && holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-lg border border-amber-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-amber-600 uppercase leading-none">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-amber-900 leading-none mt-1">{new Date(h.date).getDate()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{h.name}</p>
                    <p className="text-xs text-slate-500">{h.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteItem('holiday', h)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}

            {activeTab === 'announcements' && announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.date} - {a.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteItem('announcement', a)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
