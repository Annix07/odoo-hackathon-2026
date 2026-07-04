import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { Mail, Phone, MapPin, Briefcase, Hash, IndianRupee, Save, X, Lock, Key, Camera } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, users, updateUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  
  // For Admin to view other profiles, default to self
  const [selectedUserId, setSelectedUserId] = useState(currentUser?.id);
  
  if (!currentUser) return null;
  const isAdmin = currentUser.role === 'Admin';
  
  const displayUser = isAdmin 
    ? users.find(u => u.id === selectedUserId) || currentUser
    : currentUser;

  const [formData, setFormData] = useState<User>(displayUser);

  // Sync form data when selected user changes
  React.useEffect(() => {
    setFormData(displayUser);
    setIsEditing(false);
  }, [displayUser]);

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    // Mock save
    setPasswordError('Password successfully updated (Mock)');
    setTimeout(() => {
      setShowPasswordChange(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordError('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Profile Management</h2>
          <p className="text-lg text-slate-600 mt-2">View and manage personal details</p>
        </div>
        
        {isAdmin && (
          <select 
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.employeeId})</option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-900"></div>
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="relative group inline-block">
              <img 
                src={isEditing ? formData.avatarUrl : displayUser.avatarUrl || `https://ui-avatars.com/api/?name=${displayUser.name}&size=128`} 
                alt={displayUser.name}
                className="w-24 h-24 rounded-xl border-4 border-white shadow-md bg-white object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, avatarUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  {displayUser.id === currentUser.id && (
                    <button 
                      onClick={() => setShowPasswordChange(true)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" /> <span className="hidden sm:inline">Change Password</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                    {isEditing && isAdmin ? (
                      <input 
                        type="text" value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-slate-900">{displayUser.name}</p>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                      <p className="text-sm text-slate-900">{displayUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                      {isEditing ? (
                        <input 
                          type="text" value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      ) : (
                        <p className="text-sm text-slate-900">{displayUser.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                      {isEditing ? (
                        <textarea 
                          value={formData.address} 
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      ) : (
                        <p className="text-sm text-slate-900">{displayUser.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Job Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Hash className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Employee ID</label>
                      <p className="text-sm text-slate-900">{displayUser.employeeId}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                      {isEditing && isAdmin ? (
                        <input 
                          type="text" value={formData.department} 
                          onChange={e => setFormData({...formData, department: e.target.value})}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-slate-900">{displayUser.department}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-slate-400 mr-3 mt-0.5 opacity-0" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Designation</label>
                      {isEditing && isAdmin ? (
                        <input 
                          type="text" value={formData.designation} 
                          onChange={e => setFormData({...formData, designation: e.target.value})}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-slate-900">{displayUser.designation}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <IndianRupee className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Gross Monthly Salary</label>
                      {isAdmin ? (
                        <p className="text-sm font-mono text-slate-900">₹{(displayUser.basicPay + displayUser.hra + displayUser.specialAllowance).toLocaleString()}/mo</p>
                      ) : (
                        <p className="text-sm font-mono text-slate-900">••••••••</p> // Hidden for employees or handled in Payroll tab
                      )}
                      {isAdmin && (
                        <p className="text-[10px] text-slate-500 mt-1 uppercase">B: ₹{displayUser.basicPay.toLocaleString()} | H: ₹{displayUser.hra.toLocaleString()} | S: ₹{displayUser.specialAllowance.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordChange && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowPasswordChange(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
               <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500">Ensure your account is secure</p>
              </div>
            </div>

            {passwordError && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${passwordError.includes('Mock') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={e => setPasswords({...passwords, new: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
