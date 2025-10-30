import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUserData } from '../../store/slice/userSlice'
import { useDispatch } from 'react-redux';
import axiosInstance from '../../Config/axiosInstance';
import { toast } from 'react-toastify';

export default function Login() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [formErrors, setFormErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }
    const validateForm = () => {
        const errors = {}
        if (credentials.email && !/\S+@\S+\.\S+/.test(credentials.email)) {
            errors.email = 'Email is invalid'
        }
        if (!credentials.email.trim()) errors.email = 'Email is required'
        if (!credentials.password.trim()) errors.password = 'Password is required'
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        toast.promise(
            axiosInstance({
                method: 'POST',
                url: '/user/login',
                data: credentials
            })
                .then((res) => {
                    console.log('res?.data?.data :>> ', res?.data?.data);
                    toast.success(res?.data?.message)
                    dispatch(saveUserData(res?.data?.data))
                    setTimeout(() => navigate('/'), 3000);
                })
                .catch((err) => {
                    console.error('Login error:', err);
                    toast.error(err?.response?.data?.message)
                    setFormErrors({ general: err.message || "Something went wrong" });
                })
                .finally(() => {
                    setIsSubmitting(false);
                }),
            {
                pending: 'Loging...'
            }
        )
    };


    const getClassName = (fieldName) => {
        return `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${formErrors[fieldName] ? 'border-red-500' : 'border-gray-300'
            }`
    }

    return (
        <div className='px-1 py-3 sm:py-10 md:py-16 flex flex-col '>
            <div className="p-8 w-full max-w-md mx-auto bg-white rounded-xl shadow-[0_0_40px_14px_rgba(0,0,0,0.2)] ">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className='text-red-500 text-md'>*</span></label>
                        <input
                            type="text"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            className={getClassName('email')}
                        />
                        {formErrors.email && (
                            <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className={getClassName('password')}
                        />
                        {formErrors.password && (
                            <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-3 w-full  bg-gradient-to-tl from-green-600 via-emerald-800 to-emerald-900 text-white text-md font-semibold rounded-lg transition-colors disabled:opacity-50 "
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account?</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    )
}

