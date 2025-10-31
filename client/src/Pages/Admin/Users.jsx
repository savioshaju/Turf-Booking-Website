import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Config/axiosInstance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance({
        method: 'GET',
        url: '/user/all'
      })

      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data)
      } else {
        setUsers([])
      }
    } catch (err) {
      setError(err.response?.data || 'Something went wrong')
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    try {
      await toast.promise(
        axiosInstance({
          method: 'DELETE',
          url: `/user/deleteById/${id}`
        }),
        {
          pending: 'Deleting user...',
          success: 'User deleted successfully',
          error: 'Failed to delete user'
        }
      )
      // Refresh users list after deletion
      fetchUsers()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const updateUser = async (id, field, value) => {
    try {
      await toast.promise(
        axiosInstance({
          method: 'PUT',
          url: `/user/updateById/${id}`,
          data: { [field]: value }
        }),
        {
          pending: `Updating ${field}...`,
          success: `${field} updated successfully`,
          error: `Failed to update ${field}`
        }
      )
      // Update local state immediately for real-time feel
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, [field]: value } : user
        )
      )
    } catch (err) {
      console.error(`Update ${field} error:`, err)
      // Revert optimistic update on error
      fetchUsers()
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateUser(user._id, 'role', e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status || 'active'}
                        onChange={(e) => updateUser(user._id, 'status', e.target.value.toLowerCase())}
                        className={`block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-colors ${user.status === 'active'
                          ? 'border-green-300 bg-green-50 text-green-800'
                          : 'border-red-300 bg-red-50 text-red-800'
                          }`}
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Users