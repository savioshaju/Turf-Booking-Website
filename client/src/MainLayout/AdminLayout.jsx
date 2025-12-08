import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavBar from '../Components/Admin/AdminNavBar'
import AdminFooter from '../Components/Admin/AdminFooter'

const AdminLayout = () => {
    return (

        <main className="flex flex-col min-h-screen" >
            <AdminNavBar />
            <div className='flex-grow'>
                <Outlet />
            </div>
            <AdminFooter />
        </main>
    )
}

export default AdminLayout