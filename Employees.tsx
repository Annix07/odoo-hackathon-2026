import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { Search, Filter, Plus, Edit2, Trash2, X, Save, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const Employees: React.FC = () => {
  const { users, currentUser, updateUser, deleteUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'Admin') return <div className="p-8 text-center text-slate-500">Access Denied</div>;

  const departments = ['All', ...Array.from(new Set(users.map(u => u.department)))];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || user.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    if (!editingUser) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docName);
    try {
      const storageRef = ref(storage, `documents/${editingUser.id}/${docName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const updatedDocs = { ...(editingUser.documents || {}), [docName]: downloadURL };
      const updatedUser = { ...editingUser, documents: updatedDocs };
      
      await updateUser(updatedUser);
      setEditingUser(updatedUser);
    } catch (err) {
      console.error("Failed to upload document", err);
      alert("Failed to upload document");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        if (deleteUser) {
          await deleteUser(id);
        }
      } catch (err) {
        console.error("Failed to delete user", err);
        alert("Failed to delete user");
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      if (editingUser) {
        await updateUser({
          ...editingUser,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          employeeId: formData.get('employeeId') as string,
          department: formData.get('department') as string,
          designation: formData.get('designation') as string,
          basicPay: Number(formData.get('basicPay')) || 0,
          hra: Number(formData.get('hra')) || 0,
          specialAllowance: Number(formData.get('specialAllowance')) || 0,
        });
      } else {
        // Mock creating a new user as we don't want to sign out the admin
        alert("Creating new employees directly from dashboard requires Firebase Admin SDK. For now, they must sign up.");
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save employee", err);
      alert("Failed to save employee");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Employees</h2>
          <p className="text-lg text-slate-600 mt-2">Manage employee records and documents</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5"/> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-auto"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4 hidden sm:table-cell">ID</th>
                <th className="px-6 py-4 hidden md:table-cell">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full mr-3 border border-slate-200" />
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell font-mono text-xs">{user.employeeId}</td>
                  <td className="px-6 py-4 hidden md:table-cell">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-[11px] leading-5 font-semibold rounded-full ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors mr-2">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No employees found matching your criteria.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            >
              <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                <h3 className="text-2xl font-bold text-slate-900">{editingUser ? 'Edit Employee' : 'Add Employee'}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSave} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">Personal Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                          <input type="text" name="name" defaultValue={editingUser?.name} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                          <input type="email" name="email" defaultValue={editingUser?.email} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                          <input type="text" name="phone" defaultValue={editingUser?.phone} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">Job Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                          <input type="text" name="employeeId" defaultValue={editingUser?.employeeId} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <input type="text" name="department" defaultValue={editingUser?.department} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select defaultValue={editingUser?.role || 'Employee'} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                              <option value="Employee">Employee</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Basic Pay</label>
                          <input type="number" name="basicPay" defaultValue={editingUser?.basicPay} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {editingUser && (
                    <div className="border-t border-slate-200 pt-8">
                      <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5"/> Document Management</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {['Aadhaar Card', 'PAN Card', 'Resume', 'Offer Letter', 'Certificates'].map(doc => {
                          const isUploaded = editingUser.documents && editingUser.documents[doc];
                          const isUploading = uploadingDoc === doc;
                          return (
                            <div key={doc} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
                              <span className="text-sm font-medium text-slate-700">
                                {isUploaded ? <a href={editingUser.documents![doc]} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{doc}</a> : doc}
                              </span>
                              <div className="relative">
                                {isUploading ? (
                                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : isUploaded ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                  <label className="cursor-pointer text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition-colors inline-block">
                                    <Upload className="w-4 h-4" />
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc)} />
                                  </label>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Employee
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
