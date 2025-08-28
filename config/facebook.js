require('dotenv').config();

module.exports = {
  appId: process.env.FB_APP_ID,
  appSecret: process.env.FB_APP_SECRET,
  accessToken: process.env.FB_ACCESS_TOKEN,
  adAccountId: process.env.FB_AD_ACCOUNT_ID,
  apiVersion: 'v19.0'
};