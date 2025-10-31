import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Edit2, Save, X, LogOut, Trash2, Shield, Check, X as XIcon } from 'lucide-react'

const ProfilePage = () => {
    const navigate = useNavigate()


    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        role: ''
    })



    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [formErrors, setFormErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)



    const [isEditing, setIsEditing] = useState(false)
    const [passwordValidation, setPasswordValidation] = useState({
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,

        hasSpecialChar: false,
        hasMinLength: false
    })
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({ isSame: false })

    useEffect(() => {
        axiosInstance({
            method: 'GET',
            url: '/user/profile'
        })
            .then(res => {
                const user = res.data.data
                setUserData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    role: user.role || ''
                })

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    password: '',
                    confirmPassword: ''
                })
            })
            .catch(err => console.error(err))
    }, [])

    const handleCancelEdit = () => {
        setIsEditing(false)
        setFormData(prev => ({
            ...prev,
            password: '',
            confirmPassword: '',
            name: userData.name,
            email: userData.email,
            phone: userData.phone
        }))
        setFormErrors({})
    }



    useEffect(() => {
        const pwd = formData.password
        setPasswordValidation({
            hasUpperCase: /[A-Z]/.test(pwd),
            hasLowerCase: /[a-z]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
            hasMinLength: pwd.length >= 8
        })
    }, [formData.password])


    useEffect(() => {
        setConfirmPasswordValidation({ isSame: formData.password === formData.confirmPassword })
    }, [formData.password, formData.confirmPassword])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.name.trim()) errors.name = 'Name is required'
        if (!formData.email.trim()) errors.email = 'Email is required'
        if (!formData.phone.trim()) errors.phone = 'Phone number is required'
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email'
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits'

        if (formData.password) {
            if (!Object.values(passwordValidation).every(Boolean)) errors.password = 'Password does not meet requirements'
            if (!confirmPasswordValidation.isSame) errors.confirmPassword = 'Passwords do not match'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleUpdate = e => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)

        const updateData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        }

        if (formData.password) {
            updateData.password = formData.password
        }

        toast.promise(
            axiosInstance({
                method: 'PUT',
                url: '/user/update',
                data: updateData
            }),
            {
                pending: 'Updating profile...',
                success: 'Profile updated successfully',
                error: 'Failed to update profile'
            }
        )
            .then(res => {
                setUserData(prev => ({
                    ...prev,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                }))
                setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
                setIsEditing(false)
            })
            .finally(() => setIsSubmitting(false))
    }

    const handleLogout = () => {
        toast.promise(
            axiosInstance({ method: 'GET', url: '/user/logout' }),
            {
                pending: 'Logging out...',
                success: 'Logged out successfully',
                error: 'Failed to logout'
            }
        ).then(() => navigate('/login'))
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            toast.promise(
                axiosInstance({
                    method: 'DELETE',
                    url: '/user/delete'
                })
                    .then(() => {
                        navigate('/login')
                        return 'Account deleted and logged out'
                    }),
                {
                    pending: 'Deleting account...',
                    success: 'Account deleted',
                    error: 'Failed to delete account'
                }
            )
        }
    }


    const getClassName = field => `w-full p-3 border rounded-xl focus:outline-none focus:border-green-500 
    ${formErrors[field] ? 'border-red-500' : 'border-gray-300' }`



    const ValidationItem = ({ isValid, text }) => (
        <div className="flex items-center gap-2">
            {isValid ? <Check size={14} className="text-green-600" /> : <XIcon size={14} className="text-red-600" />}
            <span className={isValid ? 'text-green-600' : 'text-red-600'}>{text}</span>
        </div>
    )


    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">


                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center">
                                <User size={24} className="text-white sm:w-8 sm:h-8" />
                            </div>

                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    {userData.name}
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2 text-sm sm:text-base">
                                    <Mail size={14} className="sm:w-4 sm:h-4" />
                                    {userData.email}
                                </p>
                                {userData.role === 'admin' && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize mt-1 inline-block">
                                        {userData.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                                >
                                    <Edit2 size={18} />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>



                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSubmitting}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                                    >
                                        <Save size={18} />
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>




                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={20} />
                                Personal Information
                            </h2>

                            {!isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User size={20} className="text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="text-gray-900 font-medium">{userData.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={20} className="text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="text-gray-900 font-medium">{userData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={20} className="text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="text-gray-900 font-medium">{userData.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={getClassName('name')}
                                        />
                                        {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={getClassName('email')}
                                        />
                                        {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={getClassName('phone')}
                                        />
                                        {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
                                    </div>
                                </div>
                            )}
                        </div>




                        {isEditing && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Shield size={20} />
                                    Change Password
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={getClassName('password')}
                                            placeholder="Enter new password (optional)"
                                        />
                                        {formErrors.password && <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>}

                                        {formData.password && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                                                <div className="space-y-1 text-xs">
                                                    <ValidationItem isValid={passwordValidation.hasUpperCase} text="At least one uppercase letter" />
                                                    <ValidationItem isValid={passwordValidation.hasLowerCase} text="At least one lowercase letter" />
                                                    <ValidationItem isValid={passwordValidation.hasNumber} text="At least one number" />
                                                    <ValidationItem isValid={passwordValidation.hasSpecialChar} text="At least one special character" />
                                                    <ValidationItem isValid={passwordValidation.hasMinLength} text="At least 8 characters" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={getClassName('confirmPassword')}
                                            placeholder="Confirm new password"
                                        />
                                        {formErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{formErrors.confirmPassword}</p>}

                                        {formData.confirmPassword && (
                                            <div className="mt-3">
                                                <ValidationItem
                                                    isValid={confirmPasswordValidation.isSame}
                                                    text={confirmPasswordValidation.isSame ? "Passwords match" : "Passwords do not match"}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>





                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                    Delete Account
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage