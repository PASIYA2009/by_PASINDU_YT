# Clever Cloud Deployment Guide

Complete step-by-step guide to deploy PASIYA-MD Bot on Clever Cloud.

## Quick Start (5 Minutes)

1. **Sign up** for Clever Cloud: https://www.clever-cloud.com/
2. **Create** a Node.js application
3. **Clone/Download** this repository
4. **Push** to Clever Cloud git remote
5. **Done!** Visit your app URL

---

## Detailed Deployment Steps

### Step 1: Create Clever Cloud Account

1. Visit https://www.clever-cloud.com/
2. Click "Sign Up" (free tier available)
3. Verify your email
4. Log in to console: https://console.clever-cloud.com/

### Step 2: Create Node.js Application

1. In Clever Cloud console, click **"Create"** → **"an application"**
2. Select your organization (or create one)
3. Choose **"Node.js"** runtime
4. Click **"Next"**

### Step 3: Configure Application

#### Basic Configuration:
- **Name**: Choose a name (e.g., "pasiya-bot")
- **Region**: Select closest to your users
  - Paris (par)
  - Montreal (mtl)
  - Singapore (sgp)
  - Sydney (syd)
  - Warsaw (wsw)
- **Instance Type**: Nano (free tier) or higher

#### Advanced Configuration (Optional):
- **Node.js version**: 18.x (recommended)
- **Build command**: (leave default)
- **Run command**: `node index.js`

### Step 4: Set Environment Variables

In the application settings, add these variables:

```bash
# Required
PORT=8080

# Optional but Recommended
SESSION_ID=PASIYA-MD
OWNER_NUMBER=your_whatsapp_number
PREFIX=.
AUTO_READ=false
AUTO_STATUS_VIEW=true
```

### Step 5: Prepare Your Code

```bash
# Download/clone this repository
cd pasiya-bot-clever

# Initialize git (if not already initialized)
git init
git add .
git commit -m "Initial deployment"
```

### Step 6: Deploy Your Code

#### Method 1: Git Push (Recommended)

```bash
# Get your Git URL from Clever Cloud console
# It looks like: git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_xxxxxxxx.git

# Add Clever Cloud remote
git remote add clever YOUR_GIT_URL

# Push to deploy
git push clever master

# Or if using main branch:
git push clever main:master
```

#### Method 2: Using Clever Cloud CLI

```bash
# Install CLI
npm install -g clever-cloud

# Login
clever login

# Link your application
clever link YOUR_APP_ID

# Deploy
clever deploy
```

#### Method 3: GitHub/GitLab Integration

1. Push your code to GitHub/GitLab
2. In Clever Cloud console:
   - Go to **Information** tab
   - Click **"GitHub"** or **"GitLab"**
   - Authorize Clever Cloud
   - Select your repository
   - Configure branch (usually `master` or `main`)
3. Enable automatic deployment

### Step 7: Monitor Deployment

After pushing, monitor deployment progress:

1. **In Console**: Go to "Logs" → "Build logs"
2. **Using CLI**: `clever logs`

Deployment typically takes 2-3 minutes.

### Step 8: Verify Deployment

Once deployed:

1. **Get your URL**: In console, note your domain (e.g., `app-xxx.cleverapps.io`)
2. **Test homepage**: Visit `https://your-app.cleverapps.io`
3. **Test pairing**: Go to `https://your-app.cleverapps.io/pair`
4. **Health check**: `curl https://your-app.cleverapps.io/health`

---

## Custom Domain (Optional)

### Add Custom Domain:

1. In Clever Cloud console → **Domain names**
2. Click **"Add a domain name"**
3. Enter your domain (e.g., `bot.yourdomain.com`)
4. Add DNS records at your domain provider:

```
Type: CNAME
Name: bot (or your subdomain)
Value: your-app.cleverapps.io
```

5. Wait for DNS propagation (5-60 minutes)
6. Your bot will be accessible at `https://bot.yourdomain.com`

---

## Scaling Your Application

### Vertical Scaling (More Power):

1. Go to **Scalability** tab
2. Choose larger instance:
   - **Nano**: Free (256 MB RAM)
   - **XS**: €2.40/month (1 GB RAM)
   - **S**: €7.20/month (2 GB RAM)
   - **M**: €14.40/month (4 GB RAM)

### Horizontal Scaling (More Instances):

1. Go to **Scalability** tab
2. Set **Min instances** and **Max instances**
3. Clever Cloud auto-scales based on traffic

---

## Continuous Deployment

### Auto-deploy on Git Push:

**Option 1: GitHub Integration**
- Already configured in Step 6, Method 3
- Every push to selected branch triggers deployment

**Option 2: Git Hooks**
```bash
# Add to .git/hooks/post-commit
#!/bin/bash
git push clever master
```

**Option 3: CI/CD Pipeline**
- Use GitHub Actions, GitLab CI, etc.
- Example GitHub Action:

```yaml
name: Deploy to Clever Cloud
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: |
          git remote add clever ${{ secrets.CLEVER_GIT_URL }}
          git push clever main:master
```

---

## Monitoring & Logs

### View Logs:

**In Console**:
1. Go to **Logs** tab
2. Select log type:
   - **Access logs**: HTTP requests
   - **Application logs**: Your console.log output
   - **Build logs**: Deployment process

**Using CLI**:
```bash
# Real-time logs
clever logs --follow

# Application logs only
clever logs --app

# Build logs
clever logs --build
```

### Metrics:

1. Go to **Metrics** tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

### Alerts:

1. Go to **Notifications** tab
2. Configure alerts for:
   - High CPU usage
   - Memory issues
   - Application crashes
   - Deployment failures

---

## Troubleshooting

### Build Fails

**Error**: `npm install` fails
```bash
# Solution: Clear build cache
clever restart --without-cache
```

**Error**: Node version mismatch
```bash
# Solution: Add engines to package.json
"engines": {
  "node": "18.x"
}
```

### Application Crashes

**Check logs**:
```bash
clever logs --follow
```

**Common fixes**:
- Verify environment variables
- Check PORT binding (must be 8080)
- Ensure all dependencies installed

### Connection Issues

**Problem**: Cannot generate pairing code
- Check if WhatsApp servers are reachable
- Verify phone number format
- Check application logs

**Problem**: Timeout errors
- Increase timeout in pair.js
- Check Clever Cloud network status

### Performance Issues

**Slow response times**:
- Upgrade to larger instance
- Enable horizontal scaling
- Add CDN for static files

---

## Backup & Recovery

### Session Backup:

Sessions are stored in `session/` directory. To backup:

**Option 1: Environment Variables**
- Store session as base64 in env variable
- Restore on deployment

**Option 2: External Storage**
- Use MongoDB, PostgreSQL, or Redis addon
- Store sessions in database

**Option 3: GitHub Backup**
- Push sessions to private GitHub repo
- Restore on deployment (careful with security!)

### Application Backup:

```bash
# Backup current deployment
git tag v1.0.0
git push clever --tags

# Rollback if needed
git push clever v1.0.0:master
```

---

## Security Best Practices

1. **Never commit credentials**:
   - Use `.gitignore` for `.env`, `session/`
   - Use environment variables

2. **Use HTTPS**:
   - Clever Cloud provides automatic HTTPS
   - Force HTTPS in your app (optional)

3. **Rate limiting**:
   - Implement rate limiting for `/code` endpoint
   - Prevent abuse

4. **Monitor logs**:
   - Check for suspicious activity
   - Set up alerts

5. **Update dependencies**:
   ```bash
   npm audit fix
   npm update
   ```

---

## Cost Optimization

### Free Tier Limits:
- 1 Nano instance (256 MB RAM)
- 20 credits/month (~€2 value)
- Perfect for testing and small bots

### Optimize Costs:
1. Use sleep mode (paid plans)
2. Scale down when not in use
3. Use caching
4. Optimize code performance

### Estimated Costs:
- **Nano**: Free (limited)
- **XS**: €2.40/month (recommended for production)
- **S**: €7.20/month (high traffic)

---

## Support & Resources

### Official Resources:
- Clever Cloud Docs: https://www.clever-cloud.com/doc/
- Node.js Guide: https://www.clever-cloud.com/doc/deploy/application/node/
- Support: support@clever-cloud.com

### Community:
- Discord: Join Clever Cloud Discord
- Forum: community.clever-cloud.com

### PASIYA-MD Support:
- Check bot documentation
- Review logs first
- Contact on WhatsApp channel

---

## Next Steps

After deployment:
1. ✅ Test pairing functionality
2. ✅ Configure custom domain (optional)
3. ✅ Set up monitoring and alerts
4. ✅ Add bot commands and features
5. ✅ Deploy updates regularly

---

**Congratulations!** 🎉 Your PASIYA-MD bot is now live on Clever Cloud!

For questions or issues, check the logs first, then consult this guide.
