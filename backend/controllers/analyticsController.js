const Link = require('../models/Link');
const ClickEvent = require('../models/ClickEvent');
const mongoose = require('mongoose');

// @desc    Get dashboard summary statistics
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all links for user
    const links = await Link.find({ user: userId });
    const linkIds = links.map(link => link._id);

    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);

    // Top performing links
    const topLinks = await Link.find({ user: userId })
      .sort({ totalClicks: -1 })
      .limit(5)
      .select('title shortUrl totalClicks createdAt');

    // Clicks over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clickStats = await ClickEvent.aggregate([
      { $match: { link: { $in: linkIds }, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Device breakdown
    const deviceStats = await ClickEvent.aggregate([
      { $match: { link: { $in: linkIds } } },
      { $group: { _id: "$device", count: { $sum: 1 } } }
    ]);

    res.json({
      totalLinks,
      totalClicks,
      topLinks,
      clickStats,
      deviceStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsSummary
};
