import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">TurfBooking</Link>
        </div>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/" className="hover:text-gray-200 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/turf" className="hover:text-gray-200 transition-colors">
              Turfs
            </Link>
          </li>
          <li>
            <Link to="/user/mybooking" className="hover:text-gray-200 transition-colors">
              My Bookings
            </Link>
          </li>
          {/* Admin Page Button */}
          <li>
            <Link
              to="/admin/bookings"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold"
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
