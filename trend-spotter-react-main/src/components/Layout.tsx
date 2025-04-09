
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Top Users', icon: <Users size={20} /> },
    { path: '/trending', label: 'Trending Posts', icon: <BarChart3 size={20} /> },
    { path: '/feed', label: 'Feed', icon: <Activity size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-analytics-blue to-analytics-purple text-transparent bg-clip-text">
              SocialPulse
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition
                  ${location.pathname === item.path 
                    ? 'bg-analytics-blue/10 text-analytics-blue font-medium' 
                    : 'hover:bg-gray-100'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10">
        <div className="flex items-center justify-around">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-5
                ${location.pathname === item.path 
                  ? 'text-analytics-blue' 
                  : 'text-gray-500'
                }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
