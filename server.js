// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Octokit } = require('octokit');
const app = express();

app.use(bodyParser.json());

// GitHub Configuration
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});
const REPO_OWNER = 'KatikaNaMe';
const REPO_NAME = 'portfolios';

// Endpoint to save portfolio
app.post('/save-portfolio', async (req, res) => {
  try {
    const { username, htmlContent } = req.body;
    const fileName = `${username.toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
    const commitMessage = `Add portfolio for ${username}`;
    
    // Create or update file in GitHub repo
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `portfolios/${fileName}`,
      message: commitMessage,
      content: Buffer.from(htmlContent).toString('base64'),
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const liveUrl = `https://${REPO_OWNER}.github.io/${REPO_NAME}/portfolios/${fileName}`;
    
    res.json({ 
      success: true,
      liveUrl 
    });
  } catch (error) {
    console.error('GitHub error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
