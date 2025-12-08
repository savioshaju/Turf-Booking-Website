import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserData, saveUserData } from '../store/slice/userSlice';
import axiosInstance from '../Config/axiosInstance';

export default function AdminProtectLayout() {
    const { userData } = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        checkAdmin();
    }, []);

    useEffect(() => {
        if (!loading && (!userData)) {
            navigate('/login');
        }
        if (userData?.role !== 'admin') {
            navigate('/');
        }
    }, [userData, loading, navigate]);

    function checkAdmin() {
        axiosInstance.get('/user/check-admin')
            .then((res) => {
                dispatch(saveUserData(res.data.data));
                setLoading(false);
            })
            .catch((err) => {
                toast.error('Admin access needed');

                if (!loading && (!userData)) {
                    dispatch(clearUserData());
                    navigate('/login');
                }
                if (userData?.role !== 'admin') {
                    navigate('/');
                }
                setLoading(false);
            });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    return <Outlet />;
}
