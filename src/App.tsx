/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Attendance } from './components/Attendance';
import { Leave } from './components/Leave';
import { Payroll } from './components/Payroll';
import { Employees } from './components/Employees';
import { Settings } from './components/Settings';
import { NotFound } from './components/NotFound';
import { Chatbot } from './components/Chatbot';

const AppContent: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!currentUser) {
    return (
      <>
        <Auth />
        <Chatbot />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'profile': return <Profile />;
      case 'attendance': return <Attendance />;
      case 'leave': return <Leave />;
      case 'payroll': return <Payroll />;
      case 'employees': return <Employees />;
      case 'settings': return <Settings />;
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      default: return <NotFound setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
      <Chatbot />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
