const UserLog = require('../models/UserLog');
const User = require('../models/User');

/**
 * Create a new user log entry
 */
const createUserLog = async (req, res) => {
  try {
    const { userId, action, ipAddress, tokenName, userAgent } = req.body;

    if (!userId || !action || !ipAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, action, ipAddress' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const logData = {
      userId: user._id,
      username: user.email,
      role: user.role,
      action,
      ipAddress,
      tokenName: tokenName || 'N/A',
      userAgent: userAgent || req.get('User-Agent') || 'Unknown'
    };

    if (action === 'login') {
      logData.loginTime = new Date();
    } else if (action === 'logout') {
      logData.logoutTime = new Date();
      
      const lastLoginLog = await UserLog.findOne({
        userId: user._id,
        action: 'login',
        loginTime: { $exists: true }
      }).sort({ loginTime: -1 });

      if (lastLoginLog && lastLoginLog.loginTime) {
        logData.sessionDuration = Date.now() - lastLoginLog.loginTime.getTime();
      }
    }

    const userLog = new UserLog(logData);
    await userLog.save();

    res.status(201).json({
      success: true,
      message: 'User log created successfully',
      data: userLog
    });

  } catch (error) {
    console.error('Error creating user log:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all user logs with filtering and pagination
 */
const getUserLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      role, 
      action, 
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    if (action && action !== 'all') {
      filter.action = action;
    }
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { ipAddress: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const logs = await UserLog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'fullName email');

    const total = await UserLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a specific user log
 */
const deleteUserLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const log = await UserLog.findById(logId);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log entry not found'
      });
    }

    await UserLog.findByIdAndDelete(logId);

    res.status(200).json({
      success: true,
      message: 'Log entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user log:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete multiple user logs
 */
const deleteMultipleLogs = async (req, res) => {
  try {
    const { logIds } = req.body;

    if (!logIds || !Array.isArray(logIds) || logIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of log IDs to delete'
      });
    }

    const result = await UserLog.deleteMany({ _id: { $in: logIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} log entries deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting multiple user logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get user log statistics
 */
const getUserLogStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    }

    const stats = await UserLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          loginCount: { $sum: { $cond: [{ $eq: ['$action', 'login'] }, 1, 0] } },
          logoutCount: { $sum: { $cond: [{ $eq: ['$action', 'logout'] }, 1, 0] } },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalLogs: 1,
          loginCount: 1,
          logoutCount: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalLogs: 0,
        loginCount: 0,
        logoutCount: 0,
        uniqueUsers: 0
      }
    });

  } catch (error) {
    console.error('Error fetching user log stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createUserLog,
  getUserLogs,
  deleteUserLog,
  deleteMultipleLogs,
  getUserLogStats
}; 