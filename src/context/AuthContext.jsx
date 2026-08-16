import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USERS = {
  admin: {
    id: 1,
    name: 'System Admin',
    email: 'admin@vehiclems.com',
    role: 'admin',
    phone: '+1 (555) 019-2831',
    created_at: '2024-01-15',
    session_active: true
  },
  mechanic: {
    id: 2,
    name: 'John Mechanic',
    email: 'mechanic@vehiclems.com',
    role: 'mechanic',
    phone: '+1 (555) 019-4820',
    specialization: 'Engine & Electrical Specialist',
    hourlyRate: 45,
    created_at: '2024-02-01',
    session_active: true
  },
  customer: {
    id: 3,
    name: 'Jane Customer',
    email: 'user@vehiclems.com',
    role: 'user',
    phone: '+1 (555) 019-7711',
    created_at: '2024-03-10',
    session_active: true
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('drivepulse_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.customer;
  });

  useEffect(() => {
    localStorage.setItem('drivepulse_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
    }
  };

  const login = (email, password) => {
    if (email === 'admin@vehiclems.com') {
      setCurrentUser(DEMO_USERS.admin);
      return { success: true, user: DEMO_USERS.admin };
    } else if (email === 'mechanic@vehiclems.com') {
      setCurrentUser(DEMO_USERS.mechanic);
      return { success: true, user: DEMO_USERS.mechanic };
    } else {
      const newUser = {
        id: Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'user',
        phone: '+1 (555) 012-3456'
      };
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS.customer);
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, login, logout, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
