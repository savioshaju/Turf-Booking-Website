import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/admin">AdminPanel</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/admin/allturf" className="hover:text-gray-400 transition-colors">
              Bookings
            </Link>
          </li>
          <li>
            <Link to="/admin/create-turf" className="hover:text-gray-400 transition-colors">
              Create Turf
            </Link>
          </li>
          <li>
            <Link to="/admin/login" className="hover:text-gray-400 transition-colors">
              Logout
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="hover:text-gray-400 transition-colors">
              User
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavBar;
