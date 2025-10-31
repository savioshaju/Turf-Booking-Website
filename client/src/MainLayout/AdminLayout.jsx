import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavBar from '../Components/Admin/AdminNavBar'
import AdminFooter from '../Components/Admin/AdminFooter'

const AdminLayout = () => {
    return (

        <main className="z-20 flex-1 transition-all duration-500 overflow-auto" >
            <AdminNavBar />
            <div>
                <Outlet />
            </div>
            <AdminFooter />
        </main>
    )
}

export default AdminLayout