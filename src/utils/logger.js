const API_BASE_URL = 'http://localhost:5001/api/user-logs';

/**
 * Create a new user log entry via API
 * 
 * @param {Object} user - User object with id, username, role
 * @param {string} action - Action type (login, logout, etc.)
 * @param {string} ipAddress - User's IP address
 * @param {string} tokenName - JWT token name/identifier
 * @param {string} userAgent - User agent string
 */
export const createUserLog = async (user, action, ipAddress, tokenName, userAgent) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: user.id || user._id,
        action,
        ipAddress: ipAddress || 'Unknown',
        tokenName: tokenName || 'N/A',
        userAgent: userAgent || navigator.userAgent
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating user log:', error);
  }
};

/**
 * Log user login activity
 * 
 * @param {Object} user - User object
 * @param {string} ipAddress - User's IP address
 * @param {string} tokenName - JWT token name
 */
export const logUserLogin = async (user, ipAddress, tokenName) => {
  return createUserLog(user, 'login', ipAddress, tokenName);
};

/**
 * Log user logout activity
 * 
 * @param {Object} user - User object
 * @param {string} ipAddress - User's IP address
 * @param {string} tokenName - JWT token name
 */
export const logUserLogout = async (user, ipAddress, tokenName) => {
  return createUserLog(user, 'logout', ipAddress, tokenName);
};

/**
 * Get user logs with optional filtering via API
 * 
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered logs
 */
export const getUserLogs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.role && filters.role !== 'all') queryParams.append('role', filters.role);
    if (filters.action && filters.action !== 'all') queryParams.append('action', filters.action);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${API_BASE_URL}/logs?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching user logs:', error);
  }
};

/**
 * Delete a specific log entry via API
 * 
 * @param {string} logId - ID of the log to delete
 * @returns {boolean} Success status
 */
export const deleteUserLog = async (logId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs/${logId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting user log:', error);
  }
};

/**
 * Get user log statistics via API
 * 
 * @param {string} period - Time period (24h, 7d, 30d)
 * @returns {Object} Statistics data
 */
export const getUserLogStats = async (period = '7d') => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats?period=${period}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching user log stats:', error);
    return {
      totalLogs: 0,
      loginCount: 0,
      logoutCount: 0,
      uniqueUsers: 0
    };
  }
};
