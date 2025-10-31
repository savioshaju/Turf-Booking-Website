import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import axiosInstance from '../Config/axiosInstance';
import { clearUserData, saveUserData } from '../store/slice/userSlice';
import { toast } from 'react-toastify';

export default function UserProtectLayout() {
    const { userData } = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (!loading && !userData) {
            navigate('/login');
        }
    }, [userData, loading, navigate]);

    function checkUser() {
        axiosInstance.get('/user/check-user')
            .then((res) => {
                dispatch(saveUserData(res.data.data));
                setLoading(false);
            })
            .catch((err) => {
                dispatch(clearUserData());
                toast.error('Login to access');
                setLoading(false);
                navigate('/login');
            });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }
    return <Outlet />;
}
