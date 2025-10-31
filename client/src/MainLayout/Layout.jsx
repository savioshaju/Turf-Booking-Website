import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../Components/User/NavBar';
import Footer from '../Components/User/Footer';

const Layout = () => {
  const location = useLocation();

  const mainClasses = location.pathname === '/' 
    ? 'min-h-[50vh] ' 
    : 'min-h-[50vh] pt-24';

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <NavBar />
      <main className={mainClasses}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
