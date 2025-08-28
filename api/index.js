const express = require('express');
const PptxGenJS = require('pptxgenjs');
const facebookAPI = require('../services/facebookAPI');
const authRoutes = require('../routes/auth');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

// Mock data for TikTok campaigns and KOL performance
const mockData = {
  facebook: [
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
  ],
  tiktok: [
    {
      id: 3,
      name: "Gen Z Product Launch",
      impressions: 98000,
      clicks: 4100,
      cost: 280.25,
      conversions: 156,
      ctr: 4.18,
      cpc: 0.07,
      shares: 1200,
      likes: 8900,
      comments: 340,
      date: "2024-08-18"
    },
    {
      id: 4,
      name: "Viral Challenge Campaign", 
      impressions: 156000,
      clicks: 8900,
      cost: 520.00,
      conversions: 234,
      ctr: 5.71,
      cpc: 0.06,
      shares: 2100,
      likes: 15600,
      comments: 890,
      date: "2024-08-22"
    }
  ],
  kol: [
    {
      id: 5,
      name: "@laos_foodie_girl",
      platform: "tiktok",
      followers: 45000,
      engagement_rate: 6.8,
      posts: 12,
      total_likes: 124000,
      total_comments: 3400,
      total_shares: 1200,
      cost: 800.00,
      campaign: "Local Food Challenge",
      date: "2024-08-25"
    },
    {
      id: 6,
      name: "@vientiane_lifestyle",
      platform: "tiktok", 
      followers: 32000,
      engagement_rate: 8.2,
      posts: 8,
      total_likes: 89000,
      total_comments: 2100,
      total_shares: 890,
      cost: 600.00,
      campaign: "City Life Promo",
      date: "2024-08-23"
    },
    {
      id: 7,
      name: "@luang_prabang_adventures",
      platform: "tiktok",
      followers: 28000,
      engagement_rate: 7.5,
      posts: 15,
      total_likes: 156000,
      total_comments: 4200,
      total_shares: 1800,
      cost: 750.00,
      campaign: "Tourism Boost",
      date: "2024-08-21"
    }
  ]
};

app.get('/', async (req, res) => {
  try {
    const adAccountId = req.query.account_id;
    const [facebookData, adAccounts] = await Promise.all([
      facebookAPI.getCampaignInsights(adAccountId),
      facebookAPI.getAdAccounts()
    ]);
    const tiktokData = mockData.tiktok;
    const kolData = mockData.kol;
    
    const totalCampaigns = facebookData.length + tiktokData.length + kolData.length;
    const totalSpend = [...facebookData, ...tiktokData, ...kolData].reduce((sum, item) => sum + item.cost, 0);
    const totalConversions = [...facebookData, ...tiktokData].reduce((sum, item) => sum + (item.conversions || 0), 0);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Marketing Campaign Tracker</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .header {
                text-align: center;
                padding: 30px 20px;
                background: rgba(0,0,0,0.1);
            }
            .header h1 { font-size: 2.5em; margin-bottom: 10px; }
            .container { 
                max-width: 1400px; 
                margin: 0 auto; 
                padding: 20px;
            }
            .platform-section {
                margin: 30px 0;
            }
            .platform-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 1.5em;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
            }
            .facebook { border-left: 5px solid #1877f2; }
            .tiktok { border-left: 5px solid #ff0050; }
            .kol { border-left: 5px solid #25d366; }
            .campaigns-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
            }
            .campaign-card {
                background: rgba(255,255,255,0.15);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 25px;
                border: 1px solid rgba(255,255,255,0.2);
                transition: transform 0.3s ease;
            }
            .campaign-card:hover {
                transform: translateY(-5px);
                background: rgba(255,255,255,0.2);
            }
            .campaign-name {
                font-size: 1.3em;
                font-weight: bold;
                margin-bottom: 15px;
                color: #fff;
            }
            .metrics {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .metric {
                text-align: center;
                padding: 10px;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
            }
            .metric-value {
                font-size: 1.4em;
                font-weight: bold;
                color: #4CAF50;
            }
            .metric-label {
                font-size: 0.9em;
                color: #ddd;
                margin-top: 5px;
            }
            .summary {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 30px;
                text-align: center;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .export-buttons {
                display: flex;
                gap: 10px;
            }
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            .btn-pdf {
                background: #ff4757;
                color: white;
            }
            .btn-pptx {
                background: #5352ed;
                color: white;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            .kol-metrics {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 10px;
            }
            .account-selector {
                background: rgba(255,255,255,0.1);
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .account-selector select {
                padding: 8px 12px;
                border-radius: 5px;
                border: none;
                background: rgba(255,255,255,0.9);
                color: #333;
                font-size: 14px;
                cursor: pointer;
            }
            .account-selector label {
                color: #fff;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Marketing Campaign Tracker</h1>
            <p>Real-time Facebook, TikTok & KOL Analytics for Laos Market</p>
        </div>
        
        <div class="container">
            ${adAccounts.length > 0 ? `
            <div class="account-selector">
                <label for="accountSelect">🏢 Select Facebook Ad Account:</label>
                <select id="accountSelect" onchange="switchAccount()">
                    <option value="">Choose Account...</option>
                    ${adAccounts.map(account => `
                        <option value="${account.id}" ${account.id === adAccountId ? 'selected' : ''}>
                            ${account.name} (${account.currency}) - ${account.status}
                        </option>
                    `).join('')}
                </select>
                <span style="color: #ddd; font-size: 12px;">
                    ${adAccounts.length} account${adAccounts.length > 1 ? 's' : ''} available
                </span>
            </div>
            ` : ''}

            <div class="summary">
                <div>
                    <h2>📊 Campaign Summary</h2>
                    <p>Total Campaigns: ${totalCampaigns} | Total Spend: $${totalSpend.toFixed(2)} | Total Conversions: ${totalConversions}</p>
                </div>
                <div class="export-buttons">
                    <a href="/api/export/pdf" class="btn btn-pdf">📄 Export PDF</a>
                    <a href="/api/export/pptx" class="btn btn-pptx">📊 Export PPTX</a>
                </div>
            </div>

            <div class="platform-section">
                <div class="platform-title facebook">
                    <span style="margin-right: 10px;">📘</span>
                    Facebook Campaigns
                </div>
                <div class="campaigns-grid">
                    ${facebookData.map(campaign => `
                        <div class="campaign-card">
                            <div class="campaign-name">${campaign.name}</div>
                            <div class="metrics">
                                <div class="metric">
                                    <div class="metric-value">${campaign.impressions.toLocaleString()}</div>
                                    <div class="metric-label">Impressions</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${campaign.clicks.toLocaleString()}</div>
                                    <div class="metric-label">Clicks</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">$${campaign.cost}</div>
                                    <div class="metric-label">Cost</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${campaign.conversions}</div>
                                    <div class="metric-label">Conversions</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${campaign.ctr}%</div>
                                    <div class="metric-label">CTR</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">$${campaign.cpc}</div>
                                    <div class="metric-label">CPC</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="platform-section">
                <div class="platform-title tiktok">
                    <span style="margin-right: 10px;">🎵</span>
                    TikTok Campaigns
                </div>
                <div class="campaigns-grid">
                    ${tiktokData.map(campaign => `
                        <div class="campaign-card">
                            <div class="campaign-name">${campaign.name}</div>
                            <div class="metrics">
                                <div class="metric">
                                    <div class="metric-value">${campaign.impressions.toLocaleString()}</div>
                                    <div class="metric-label">Impressions</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${campaign.clicks.toLocaleString()}</div>
                                    <div class="metric-label">Clicks</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">$${campaign.cost}</div>
                                    <div class="metric-label">Cost</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${campaign.conversions}</div>
                                    <div class="metric-label">Conversions</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${campaign.ctr}%</div>
                                    <div class="metric-label">CTR</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">$${campaign.cpc}</div>
                                    <div class="metric-label">CPC</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="platform-section">
                <div class="platform-title kol">
                    <span style="margin-right: 10px;">🌟</span>
                    KOL Performance (TikTok)
                </div>
                <div class="campaigns-grid">
                    ${kolData.map(kol => `
                        <div class="campaign-card">
                            <div class="campaign-name">${kol.name}</div>
                            <div class="campaign-name" style="font-size: 1em; color: #ddd; margin-bottom: 20px;">${kol.campaign}</div>
                            <div class="kol-metrics">
                                <div class="metric">
                                    <div class="metric-value">${kol.followers.toLocaleString()}</div>
                                    <div class="metric-label">Followers</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${kol.engagement_rate}%</div>
                                    <div class="metric-label">Engagement</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${kol.posts}</div>
                                    <div class="metric-label">Posts</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${kol.total_likes.toLocaleString()}</div>
                                    <div class="metric-label">Total Likes</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${kol.total_comments.toLocaleString()}</div>
                                    <div class="metric-label">Comments</div>
                                </div>
                                <div class="metric">
                                    <div class="metric-value">${kol.total_shares.toLocaleString()}</div>
                                    <div class="metric-label">Shares</div>
                                </div>
                            </div>
                            <div style="text-align: center; margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                                <div class="metric-value">$${kol.cost}</div>
                                <div class="metric-label">Campaign Cost</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <script>
            function switchAccount() {
                const select = document.getElementById('accountSelect');
                const selectedAccountId = select.value;
                
                if (selectedAccountId) {
                    const url = new URL(window.location);
                    url.searchParams.set('account_id', selectedAccountId);
                    window.location.href = url.toString();
                } else {
                    const url = new URL(window.location);
                    url.searchParams.delete('account_id');
                    window.location.href = url.toString();
                }
            }

            // Auto-refresh data every 5 minutes
            setInterval(() => {
                if (document.visibilityState === 'visible') {
                    window.location.reload();
                }
            }, 300000);
        </script>
    </body>
    </html>
  `);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).json({ error: 'Dashboard loading failed', message: error.message });
  }
});

// API Routes
app.get('/facebook/accounts', async (req, res) => {
  try {
    const accounts = await facebookAPI.getAdAccounts();
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching Facebook ad accounts:', error);
    res.json([]);
  }
});

app.get('/facebook', async (req, res) => {
  try {
    const adAccountId = req.query.account_id;
    const campaigns = await facebookAPI.getCampaignInsights(adAccountId);
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching Facebook data:', error);
    res.json(mockData.facebook);
  }
});

app.get('/tiktok', (req, res) => {
  res.json(mockData.tiktok);
});

app.get('/kol', (req, res) => {
  res.json(mockData.kol);
});

// Export for Vercel
module.exports = app;