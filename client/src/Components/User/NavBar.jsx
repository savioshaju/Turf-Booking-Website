import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function NavBar() {
  const location = useLocation()
  const [activeNav, setActiveNav] = useState(location.pathname)
  const { userData } = useSelector(state => state.user)
  const isHome = location.pathname === '/';

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      tooltip: 'Home'
    },
    {
      path: '/turf',
      label: 'Turfs',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      tooltip: 'Browse Turfs'
    },
    {
      path: '/user/mybooking',
      label: 'Bookings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      tooltip: 'My Bookings'
    },
    {
      path: '/user/profile',
      label: userData?.email,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      tooltip: 'Profile',
      isEmail: true
    },
  ]

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto">
      <div className="bg-gradient-to-br from-green-50/10 via-white/10 to-emerald-50/10 rounded-2xl p-4 shadow-2xl border border-green-100 border-opacity-10 backdrop-blur-sm">
        <div className="flex items-center space-x-6 lg:space-x-8">

          <div className="text-2xl lg:text-3xl font-bold hidden md:block">
            <Link
              to="/"
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-500"
            >
              TurfBook
            </Link>
          </div>

          <div className="h-8 w-0.5 bg-gradient-to-b from-transparent via-green-300 to-transparent hidden md:block"></div>

          <div className="flex items-center space-x-3 lg:space-x-4">
            {navItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`
                  px-4 py-3 lg:px-5 lg:py-3 rounded-xl transition-all duration-500 flex items-center justify-center
                  ${activeNav === item.path
                      ? 'text-green-600 shadow-2xl ring-2 ring-green-400 ring-opacity-80 transform scale-110'
                      : !isHome
                        ? 'text-gray-800 hover:text-green-600 hover:shadow-lg hover:ring-2 hover:ring-green-300'
                        : 'text-white/90 hover:text-green-300 hover:shadow-lg hover:ring-2 hover:ring-green-100'
                    }
                  `}
                  onClick={() => setActiveNav(item.path)}
                >
                  {item.isEmail ? (
                    <>
                    
                      <span className="hidden md:inline text-sm lg:text-base font-semibold truncate max-w-[140px] lg:max-w-[160px]">
                        {item.label}
                      </span>
                      <span className="md:hidden">
                        {item.icon}
                      </span>
                    </>
                  ) : (
                    item.icon
                  )}
                </Link>

                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-gradient-to-r from-green-800 to-emerald-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-10 shadow-2xl border border-green-700 backdrop-blur-sm">
                  {item.tooltip}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-green-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}

export default NavBar