import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/User/Home";
import Login from "../Pages/User/Login";
import Signup from "../Pages/User/Signup";
import Bookings from "../Pages/User/Bookings";
import BookTurf from "../Pages/User/BookTurf";
import Turf from "../Pages/User/Turf";
import TurfDetails from "../Pages/User/TurfDetails";
import Layout from "../MainLayout/Layout"
import AdminAllturf from "../Pages/Admin/AdminAllturf";
import CreateTurf from "../Pages/Admin/CreateTurf";
import AdminLayout from "../MainLayout/AdminLayout";
import AdminProtectLayout from "./AdminProtectLayout";
import UserProtectLayout from "./UserProtectLayout";
import Payment from "../Pages/User/Payment";
import AdminTurfDetails from "../Pages/Admin/AdminTurfDetails";
import ProfilePage from "../Pages/User/ProfilePage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'turf',
                element: <Turf />
            },
            {
                path: 'turf-details/:id',
                element: <TurfDetails />
            },
            {
                path: 'user',
                element: <UserProtectLayout />,
                children: [
                    {
                        path: 'payment',
                        element: <Payment />
                    },
                    {
                        path: 'mybooking',
                        element: <Bookings />
                    },
                    {
                        path: 'bookturf/:id',
                        element: <BookTurf />
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />
                    }
                ]
            }
        ]
    },
    {
        path: 'admin',
        element: <AdminLayout />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: '',
                element: <AdminProtectLayout />,
                children: [
                    {
                        path: 'allturf',
                        element: <AdminAllturf />
                    },
                    {
                        path: 'create-turf',
                        element: <CreateTurf />
                    },
                    {
                        path: 'turf-details/:id',
                        element: <AdminTurfDetails/>
                    }
                ]
            }
        ]
    }
]);

export default router;
