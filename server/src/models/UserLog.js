const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    required: true 
  },
  action: { 
    type: String, 
    enum: ['login', 'logout', 'register', 'password_reset'], 
    required: true 
  },
  loginTime: { 
    type: Date, 
    default: null 
  },
  logoutTime: { 
    type: Date, 
    default: null 
  },
  ipAddress: { 
    type: String, 
    required: true 
  },
  tokenName: { 
    type: String, 
    default: 'N/A' 
  },
  userAgent: { 
    type: String, 
    default: 'Unknown' 
  },
  sessionDuration: { 
    type: Number, // milliseconds
    default: null
  }
}, { 
  timestamps: true 
});

UserLogSchema.index({ userId: 1, createdAt: -1 });
UserLogSchema.index({ action: 1, createdAt: -1 });
UserLogSchema.index({ role: 1, createdAt: -1 });

module.exports = mongoose.model('UserLog', UserLogSchema); 