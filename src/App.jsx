import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Vehicles } from './pages/Vehicles';
import { MechanicServices } from './pages/MechanicServices';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MechanicDashboard } from './pages/MechanicDashboard';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { currentUser } = useAuth();

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'vehicles':
        return <Vehicles setActiveTab={setActiveTab} />;
      case 'mechanics':
        return <MechanicServices setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <CustomerDashboard setActiveTab={setActiveTab} />;
      case 'admin':
        return <AdminDashboard />;
      case 'mechanic_dash':
        return <MechanicDashboard />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderCurrentTab()}
      </main>
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
