import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  IndianRupee, 
  UserCircle,
  LogOut,
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
  ArrowUp,
  Settings as SettingsIcon
} from 'lucide-react';

import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAppContext();
  const { t } = useTranslation();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'Admin';

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 'employees', label: 'Employees', icon: Users }] : []),
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'attendance', label: t('attendance'), icon: Clock },
    { id: 'leave', label: t('leave'), icon: Calendar },
    { id: 'payroll', label: t('payroll'), icon: IndianRupee },
    ...(isAdmin ? [{ id: 'settings', label: 'Settings', icon: SettingsIcon }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center mb-4">
            <Logo className="h-10 w-auto" />
          </div>
          <p className="text-xs text-slate-500">Every workday, perfectly aligned.</p>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-indigo-700' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-4">
            <LanguageSelector />
          </div>
          <div className="flex items-center mb-4 px-2">
            <img 
              src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.name}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-slate-200"
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between md:hidden shrink-0">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button onClick={logout} className="p-2 text-slate-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div id="main-scroll" className="flex-1 overflow-auto flex flex-col relative">
          <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              {children}
            </motion.div>
          </div>

          <footer className="bg-slate-900 text-slate-300 py-12 px-6 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center mb-6">
                  <Logo className="h-12 w-auto" light />
                </div>
                <p className="text-sm text-slate-400">
                  Empowering your workforce with intelligent HR solutions. Every workday, perfectly aligned.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Core HR</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Payroll</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Time & Attendance</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Employee Portal</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">News</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 hover:text-white transition-all">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
              <div className="mb-4 md:mb-0">
                &copy; 2026 HRSync. All Rights Reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <span>Version v1.0.0</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Floating Actions */}
        <div className="fixed bottom-36 md:bottom-24 right-6 flex flex-col gap-3 z-50">
          <button 
            onClick={() => document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-white text-slate-600 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 shrink-0">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
