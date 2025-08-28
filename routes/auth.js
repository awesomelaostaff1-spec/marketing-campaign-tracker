const express = require('express');
const router = express.Router();
const facebookAPI = require('../services/facebookAPI');

// Facebook API connection test endpoint
router.get('/test/facebook', async (req, res) => {
  try {
    const adAccountId = req.query.account_id;
    const result = await facebookAPI.testConnection(adAccountId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Test failed: ${error.message}`
    });
  }
});

// OAuth routes for future implementation
router.get('/facebook/auth', (req, res) => {
  res.json({
    message: 'Facebook OAuth flow will be implemented here',
    instructions: 'For now, please set your Facebook credentials in .env file'
  });
});

router.get('/tiktok/auth', (req, res) => {
  res.json({
    message: 'TikTok OAuth flow will be implemented here',
    instructions: 'Coming soon in next version'
  });
});

module.exports = router;