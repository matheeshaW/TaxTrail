import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();

  // Check if we are exactly on the /dashboard path
  const isDashboardHome = location.pathname === '/dashboard';

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 border-b border-indigo-700 pb-2">TaxTrail</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block py-2 px-4 hover:bg-indigo-800 rounded transition-colors">
            🏠 Home
          </Link>

          {/* Updated link for nested routing */}
          <Link 
            to="regional-development" 
            className={`block py-2 px-4 rounded transition-colors ${location.pathname.includes('regional-development') ? 'bg-indigo-700 border-l-4 border-white' : 'hover:bg-indigo-800'}`}
          >
            📍 Regional Development
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {/* If we are just on /dashboard, show a welcome message */}
        {isDashboardHome && (
          <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-800">Dashboard 🚀</h1>
            <p className="text-xl text-gray-500 mt-4">Welcome back to the TaxTrail Management System.</p>
            <div className="mt-8 p-4 bg-indigo-50 rounded-lg text-indigo-700 font-medium">
               Select "Regional Development" from the sidebar to view your analytics.
            </div>
          </div>
        )}

        {/* This is where your RegionalDevelopmentPage will appear! */}
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;