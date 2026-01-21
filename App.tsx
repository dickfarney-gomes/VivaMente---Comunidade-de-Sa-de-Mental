
import React, { useState, useEffect, useCallback } from 'react';
import { AuthView } from './components/AuthView';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { CommunitiesView } from './components/CommunitiesView';
import { Navbar } from './components/Navbar';
import { User } from './types';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success';
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'feed' | 'communities' | 'profile'>('feed');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('mente_apoio_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const addNotification = useCallback((message: string, type: 'info' | 'success' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('mente_apoio_user', JSON.stringify(userData));
    addNotification(`Bem-vindo, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mente_apoio_user');
  };

  if (!user) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Notifications Overlay */}
      <div className="fixed top-20 right-4 left-4 md:left-auto md:w-80 z-[100] space-y-2 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="animate-in slide-in-from-right-full p-4 bg-white border-l-4 border-indigo-600 shadow-xl rounded-r-lg flex items-center gap-3 pointer-events-auto"
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">{n.message}</p>
          </div>
        ))}
      </div>

      <Navbar 
        user={user} 
        activeTab={currentTab} 
        onTabChange={setCurrentTab} 
        onLogout={handleLogout} 
      />
      
      <main className="max-w-4xl mx-auto p-4 md:pt-24">
        {currentTab === 'feed' && <FeedView user={user} onNotify={addNotification} />}
        {currentTab === 'communities' && <CommunitiesView user={user} onUpdateUser={handleAuthSuccess} />}
        {currentTab === 'profile' && <ProfileView user={user} onUpdateUser={handleAuthSuccess} />}
      </main>
    </div>
  );
};

export default App;
