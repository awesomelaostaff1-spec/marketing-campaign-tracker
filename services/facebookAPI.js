const adsSdk = require('facebook-nodejs-business-sdk');
const fbConfig = require('../config/facebook');

class FacebookAPI {
  constructor() {
    if (fbConfig.accessToken) {
      adsSdk.FacebookAdsApi.init(fbConfig.accessToken);
      this.api = adsSdk.FacebookAdsApi;
      this.AdAccount = adsSdk.AdAccount;
      this.Campaign = adsSdk.Campaign;
      this.AdSet = adsSdk.AdSet;
      this.Ad = adsSdk.Ad;
    }
  }

  async getCampaigns(adAccountId = null) {
    try {
      if (!fbConfig.accessToken) {
        console.log('Facebook API credentials not configured, using mock data');
        return this.getMockData();
      }

      const accountId = adAccountId || fbConfig.adAccountId;
      if (!accountId) {
        console.log('No ad account ID provided, using mock data');
        return this.getMockData();
      }

      const account = new this.AdAccount(accountId);
      const campaigns = await account.getCampaigns([
        this.Campaign.Fields.id,
        this.Campaign.Fields.name,
        this.Campaign.Fields.status,
        this.Campaign.Fields.objective,
        this.Campaign.Fields.created_time,
        this.Campaign.Fields.updated_time
      ]);

      return campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        objective: campaign.objective,
        created_time: campaign.created_time,
        updated_time: campaign.updated_time
      }));

    } catch (error) {
      console.error('Facebook API Error:', error.message);
      return this.getMockData();
    }
  }

  async getAdAccounts() {
    try {
      if (!fbConfig.accessToken) {
        return [];
      }

      const user = new adsSdk.User('me');
      const accounts = await user.getAdAccounts([
        'id',
        'name',
        'account_status',
        'currency',
        'timezone_name'
      ]);

      return accounts.map(account => ({
        id: account.id,
        name: account.name,
        status: account.account_status,
        currency: account.currency,
        timezone: account.timezone_name
      }));

    } catch (error) {
      console.error('Facebook Ad Accounts API Error:', error.message);
      return [];
    }
  }

  async getCampaignInsights(adAccountId = null, campaignId = null, dateRange = 'last_30d') {
    try {
      if (!fbConfig.accessToken) {
        console.log('Facebook API credentials not configured, using mock data');
        return this.getMockInsightsData();
      }

      const accountId = adAccountId || fbConfig.adAccountId;
      if (!accountId) {
        console.log('No ad account ID provided, using mock data');
        return this.getMockInsightsData();
      }

      const account = new this.AdAccount(accountId);
      const params = {
        level: 'campaign',
        date_preset: dateRange,
        fields: [
          'campaign_name',
          'impressions',
          'clicks',
          'spend',
          'actions',
          'ctr',
          'cpc',
          'reach',
          'frequency'
        ]
      };

      if (campaignId) {
        params.filtering = [
          {
            field: 'campaign.id',
            operator: 'IN',
            value: [campaignId]
          }
        ];
      }

      const insights = await account.getInsights([], params);
      
      return insights.map(insight => ({
        id: Math.random().toString(36).substr(2, 9),
        name: insight.campaign_name,
        impressions: parseInt(insight.impressions) || 0,
        clicks: parseInt(insight.clicks) || 0,
        cost: parseFloat(insight.spend) || 0,
        conversions: this.extractConversions(insight.actions),
        ctr: parseFloat(insight.ctr) || 0,
        cpc: parseFloat(insight.cpc) || 0,
        reach: parseInt(insight.reach) || 0,
        frequency: parseFloat(insight.frequency) || 0,
        date: new Date().toISOString().split('T')[0]
      }));

    } catch (error) {
      console.error('Facebook Insights API Error:', error.message);
      return this.getMockInsightsData();
    }
  }

  extractConversions(actions) {
    if (!actions || !Array.isArray(actions)) return 0;
    
    const conversionAction = actions.find(action => 
      action.action_type === 'offsite_conversion' || 
      action.action_type === 'purchase' ||
      action.action_type === 'lead'
    );
    
    return conversionAction ? parseInt(conversionAction.value) : 0;
  }

  getMockData() {
    return [
      {
        id: 1,
        name: "Summer Sale Campaign",
        impressions: 125000,
        clicks: 3200,
        cost: 450.50,
        conversions: 89,
        ctr: 2.56,
        cpc: 0.14,
        reach: 98000,
        frequency: 1.28,
        date: "2024-08-15"
      },
      {
        id: 2,
        name: "Brand Awareness Q3",
        impressions: 89000,
        clicks: 1890,
        cost: 320.75,
        conversions: 34,
        ctr: 2.12,
        cpc: 0.17,
        reach: 72000,
        frequency: 1.24,
        date: "2024-08-20"
      }
    ];
  }

  getMockInsightsData() {
    return this.getMockData();
  }

  async testConnection(adAccountId = null) {
    try {
      if (!fbConfig.accessToken) {
        return { success: false, message: 'Access token not configured' };
      }

      const accountId = adAccountId || fbConfig.adAccountId;
      if (!accountId) {
        return { success: false, message: 'No ad account ID provided' };
      }

      const account = new this.AdAccount(accountId);
      const accountInfo = await account.read([
        'id', 'name', 'account_status', 'currency'
      ]);

      return {
        success: true,
        message: 'Connection successful',
        account: {
          id: accountInfo.id,
          name: accountInfo.name,
          status: accountInfo.account_status,
          currency: accountInfo.currency
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  }
}

module.exports = new FacebookAPI();