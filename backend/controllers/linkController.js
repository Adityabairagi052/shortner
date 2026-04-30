const Link = require('../models/Link');
const Counter = require('../models/Counter');
const ClickEvent = require('../models/ClickEvent');
const { encodeBase62 } = require('../utils/base62');

// Helper to get next sequence for base62
const getNextSequence = async (name) => {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// @desc    Create new short link
// @route   POST /api/links
// @access  Private
const createLink = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, title, description, password, expiryDate, clickLimit } = req.body;

    if (!originalUrl) {
      res.status(400);
      throw new Error('Original URL is required');
    }

    let shortUrl = customAlias;

    // Check if custom alias is provided and unique
    if (customAlias) {
      const existing = await Link.findOne({ shortUrl: customAlias });
      if (existing) {
        res.status(400);
        throw new Error('Custom alias is already taken');
      }
    } else {
      // Generate using Base62 encoding
      let isUnique = false;
      while (!isUnique) {
        const seq = await getNextSequence('linkId');
        shortUrl = encodeBase62(seq);
        const existing = await Link.findOne({ shortUrl });
        if (!existing) isUnique = true;
      }
    }

    const link = await Link.create({
      originalUrl,
      shortUrl,
      user: req.user._id,
      title,
      description,
      password,
      expiryDate,
      clickLimit
    });

    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user links
// @route   GET /api/links
// @access  Private
const getUserLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    next(error);
  }
};

// @desc    Redirect and track clicks
// @route   GET /:shortUrl
// @access  Public
const redirectLink = async (req, res, next) => {
  try {
    const { shortUrl } = req.params;
    const link = await Link.findOne({ shortUrl });

    if (!link || !link.isActive) {
      return res.status(404).json({ message: 'Link not found or deactivated' });
    }

    // Check expiry
    if (link.expiryDate && new Date() > new Date(link.expiryDate)) {
      return res.status(410).json({ message: 'This link has expired' });
    }

    // Check click limit
    if (link.clickLimit && link.totalClicks >= link.clickLimit) {
      return res.status(410).json({ message: 'Click limit reached for this link' });
    }

    // Password protection logic (Basic implementation: redirect to a frontend password prompt page if password exists)
    // For a real API, if password is required, we shouldn't redirect immediately. 
    // We send a specific status so the frontend shows a password input.
    // Assuming this route is called by backend directly via browser:
    if (link.password) {
      // In a real app, you'd render a page here or redirect to frontend password wall
      // return res.redirect(`${process.env.FRONTEND_URL}/unlock/${shortUrl}`);
    }

    // Update total clicks
    link.totalClicks += 1;
    await link.save();

    // Log Click Event asynchronously
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
    
    ClickEvent.create({
      link: link._id,
      ipAddress: ip,
      device: device,
      browser: userAgent.substring(0, 30),
      referrer: req.headers.referer || 'Direct'
    }).catch(err => console.error('Error logging click:', err));

    // Return HTML with Open Graph tags and Meta Refresh for redirection
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${link.title || 'SnapShort Link'}</title>
          <meta name="description" content="${link.description || 'A shortened link powered by SnapShort.'}">
          
          <!-- Open Graph / Facebook / WhatsApp -->
          <meta property="og:type" content="website">
          <meta property="og:url" content="http://${req.get('host')}/${shortUrl}">
          <meta property="og:title" content="${link.title || 'SnapShort Link'}">
          <meta property="og:description" content="${link.description || 'A shortened link powered by SnapShort.'}">
          ${link.favicon ? `<meta property="og:image" content="${link.favicon}">` : ''}

          <!-- Twitter -->
          <meta property="twitter:card" content="summary_large_image">
          <meta property="twitter:url" content="http://${req.get('host')}/${shortUrl}">
          <meta property="twitter:title" content="${link.title || 'SnapShort Link'}">
          <meta property="twitter:description" content="${link.description || 'A shortened link powered by SnapShort.'}">
          ${link.favicon ? `<meta property="twitter:image" content="${link.favicon}">` : ''}

          <!-- Instant Redirect -->
          <meta http-equiv="refresh" content="0;url=${link.originalUrl}">
          
          <style>
              body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #0f172a; color: white; margin: 0; }
              .loader { border: 4px solid rgba(255,255,255,0.1); border-left-color: #6366f1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px;}
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
      </head>
      <body>
          <div style="text-align: center;">
              <div class="loader"></div>
              <h2>Redirecting to destination...</h2>
              <p>If you are not redirected automatically, <a href="${link.originalUrl}" style="color: #6366f1;">click here</a>.</p>
          </div>
          <script>
              window.location.replace("${link.originalUrl}");
          </script>
      </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLink,
  getUserLinks,
  redirectLink
};
