import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../Components/User/NavBar'
import Footer from '../Components/User/Footer'

const Layout = () => {


    return (
        <div className='min-h-screen flex flex-col justify-between'>
            <NavBar />
            <main className='min-h-[50vh]'>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout