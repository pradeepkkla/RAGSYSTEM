const User = require('../models/User');
const Document = require('../models/Document');
const Log = require('../models/Log');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const totalProcessed = await Document.countDocuments({ status: 'embedded' });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDocuments,
        totalProcessed
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};
