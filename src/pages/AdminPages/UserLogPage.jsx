/**
 * UserLogPage Component
 * 
 * An administrative component that displays user activity logs with comprehensive
 * information and management capabilities. Implements localStorage-based log storage
 * and retrieval with delete functionality for administrators.
 * 
 * Features:
 * - Displays user logs with login time, logout time, JWT token, username, role, IP address
 * - Provides delete functionality for individual log entries
 * - Implements sorting and filtering capabilities
 * - Includes responsive design for all screen sizes
 * - Supports accessibility with proper ARIA attributes
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { FaTrash, FaSpinner, FaExclamationTriangle, FaUserShield, FaSort, FaFilter } from 'react-icons/fa';
import { getUserLogs, deleteUserLog } from '../../utils/logger';

const UserLogPage = () => {
  // State management with proper initialization
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [filters, setFilters] = useState({
    role: 'all',
    action: 'all',
    search: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50
  });

  /**
   * Load user logs from API
   */
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        
        // Get logs using API with current filters
        const apiFilters = {
          ...filters,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction
        };
        
        const logsData = await getUserLogs(apiFilters);
        
        // If API returns pagination data, use it
        if (logsData.pagination) {
          setPagination(logsData.pagination);
          setLogs(logsData.data || logsData);
          setFilteredLogs(logsData.data || logsData);
        } else {
          // Fallback for localStorage data
          setLogs(logsData);
          setFilteredLogs(logsData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading logs:', err);
        setError('Failed to load user logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [filters, sortConfig, pagination.currentPage]);

  /**
   * Handle sorting
   * 
   * @param {string} key - Column key to sort by
   */
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  /**
   * Apply filters to logs
   * 
   * @param {Object} newFilters - New filter settings
   */
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  /**
   * Handle filter changes
   * 
   * @param {string} filterType - Type of filter
   * @param {string} value - Filter value
   */
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    applyFilters(newFilters);
  };

  /**
   * Format date for display
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  /**
   * Handle log deletion
   * 
   * @param {string} logId - ID of the log to delete
   */
  const handleDelete = async (logId) => {
    try {
      // Use utility function to delete log
      const success = await deleteUserLog(logId);
      
      if (success) {
        // Remove from local state
        const updatedLogs = logs.filter(log => log._id !== logId && log.id !== logId);
        setLogs(updatedLogs);
        setFilteredLogs(updatedLogs);
        
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete log entry. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting log:', err);
      setError('Failed to delete log entry. Please try again.');
    }
  };

  /**
   * Cancel delete confirmation
   */
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center" aria-live="polite" role="status">
        <FaSpinner className="animate-spin text-blue-500 text-2xl" aria-hidden="true" />
        <span className="ml-2">Loading user logs...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-red-500 flex items-center" aria-live="assertive" role="alert">
        <FaExclamationTriangle className="mr-2" aria-hidden="true" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaUserShield className="mr-2" aria-hidden="true" />
        User Activity Logs
      </h2>
      
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:space-x-4">
        {/* Search input */}
        <div className="md:flex-1">
          <label htmlFor="log-search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Logs
          </label>
          <input
            id="log-search"
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search by username, user ID, or IP"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            aria-label="Search logs"
          />
        </div>
        
        {/* Role filter */}
        <div className="md:w-32">
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role-filter"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            aria-label="Filter logs by role"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Action filter */}
        <div className="md:w-32">
          <label htmlFor="action-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            id="action-filter"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            aria-label="Filter logs by action"
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredLogs.length} of {pagination.totalItems} logs
      </div>
      
      {/* Log table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('username')}
              >
                <div className="flex items-center">
                  Username
                  <FaSort className="ml-1" aria-hidden="true" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  Role
                  <FaSort className="ml-1" aria-hidden="true" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('action')}
              >
                <div className="flex items-center">
                  Action
                  <FaSort className="ml-1" aria-hidden="true" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Login Time
                  <FaSort className="ml-1" aria-hidden="true" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('logoutTime')}
              >
                <div className="flex items-center">
                  Logout Time
                  <FaSort className="ml-1" aria-hidden="true" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Token
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IP Address
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No logs match your filters
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log._id || log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.username}</div>
                    <div className="text-xs text-gray-500">{log.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.logoutTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-mono">{log.tokenName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirm === log._id || deleteConfirm === log.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDelete(log._id || log.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                          aria-label={`Confirm delete log for ${log.username}`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
                          aria-label="Cancel delete"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(log._id || log.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                        aria-label={`Delete log for ${log.username}`}
                        title="Delete log entry"
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLogPage;