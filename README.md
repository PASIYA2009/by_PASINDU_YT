# PASIYA-MD Bot - Clever Cloud Edition

WhatsApp Multi-Device Bot optimized for Clever Cloud deployment.

## Features

- ✅ Multi-device support with pairing codes
- ✅ Easy deployment on Clever Cloud
- ✅ Web-based pairing interface
- ✅ Session management
- ✅ Auto-reconnect functionality
- ✅ Modern UI/UX

## Deployment on Clever Cloud

### Prerequisites

1. A Clever Cloud account ([Sign up here](https://www.clever-cloud.com/))
2. Git installed on your computer
3. Node.js 18.x or higher

### Step-by-Step Deployment

#### 1. Install Clever Cloud CLI (Optional but recommended)

```bash
npm install -g clever-cloud
clever login
```

#### 2. Create a New Node.js Application

1. Go to [Clever Cloud Console](https://console.clever-cloud.com/)
2. Click "Create" → "an application"
3. Select "Node.js" as your runtime
4. Choose a name for your application
5. Select the region closest to you
6. Choose the free plan (or any plan you prefer)

#### 3. Configure Your Application

In the Clever Cloud console, go to your application settings:

**Environment Variables** (optional):
```
SESSION_ID=PASIYA-MD
OWNER_NUMBER=your_whatsapp_number
PREFIX=.
AUTO_READ=false
AUTO_STATUS_VIEW=true
```

**Domain**: Note your default domain (e.g., `app-xxx.cleverapps.io`)

#### 4. Deploy Your Code

##### Option A: Using Git (Recommended)

```bash
# Clone or initialize your repository
git init
git add .
git commit -m "Initial commit"

# Add Clever Cloud remote (get this from your app console)
git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_xxx.git

# Push to deploy
git push clever master
```

##### Option B: Using Clever Cloud CLI

```bash
# Link to your application
clever link app_xxx

# Deploy
clever deploy
```

##### Option C: Using GitHub/GitLab Integration

1. Push your code to GitHub/GitLab
2. In Clever Cloud console, connect your repository
3. Configure automatic deployment on push

#### 5. Verify Deployment

After deployment (usually takes 2-3 minutes):

1. Visit your application URL (e.g., `https://app-xxx.cleverapps.io`)
2. You should see the PASIYA-MD homepage
3. Click "Get Pairing Code" to test the pairing functionality

## How to Use

### Pairing Your Device

1. Visit your deployed site: `https://your-app.cleverapps.io`
2. Click "Get Pairing Code"
3. Enter your WhatsApp number (with country code, e.g., `94771234567`)
4. Click "Generate Pairing Code"
5. Open WhatsApp on your phone:
   - Go to **Settings** → **Linked Devices**
   - Tap **Link a Device**
   - Select **Link with Phone Number**
   - Enter the 8-digit code displayed on the website
6. Your device will be linked!

### API Endpoints

- `GET /` - Homepage
- `GET /pair` - Pairing page
- `GET /code?phone=NUMBER` - Generate pairing code
- `GET /health` - Health check endpoint

## File Structure

```
pasiya-bot-clever/
├── index.js              # Main server file
├── pair.js               # Pairing logic and routes
├── package.json          # Dependencies
├── .gitignore           # Git ignore rules
├── clevercloud/
│   └── nodejs.json      # Clever Cloud config
├── public/
│   ├── main.html        # Homepage
│   └── pair.html        # Pairing page
└── session/             # Session data (auto-created)
```

## Configuration

### Environment Variables

You can set these in Clever Cloud console under "Environment Variables":

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (auto-set by Clever Cloud) | 8080 |
| `SESSION_ID` | Session identifier prefix | PASIYA-MD |
| `OWNER_NUMBER` | Your WhatsApp number | - |
| `PREFIX` | Bot command prefix | . |
| `AUTO_READ` | Auto-read messages | false |
| `AUTO_STATUS_VIEW` | Auto-view statuses | true |

## Troubleshooting

### Deployment Issues

**Problem**: App fails to start
- **Solution**: Check logs in Clever Cloud console → Logs tab
- Ensure Node.js version is 18.x or higher
- Verify all dependencies are installed

**Problem**: Cannot generate pairing code
- **Solution**: Check if phone number format is correct (country code + number)
- Ensure session directory has write permissions
- Check application logs for errors

**Problem**: Connection timeout
- **Solution**: Increase connection timeout in pair.js
- Check if Clever Cloud has network restrictions
- Verify WhatsApp servers are accessible

### Common Errors

1. **"Invalid phone number format"**
   - Use format: country code + number (e.g., 94771234567)
   - No spaces, dashes, or + symbol

2. **"Connection failed after maximum retries"**
   - WhatsApp servers might be down
   - Network connectivity issue
   - Try again after a few minutes

3. **"Session timeout"**
   - Pairing code expires after 60 seconds
   - Generate a new code and try again quickly

## Monitoring

### Logs

View application logs in Clever Cloud console:
1. Go to your application
2. Click "Logs" in the left menu
3. Select "Application logs"

### Health Check

Monitor your application status:
```bash
curl https://your-app.cleverapps.io/health
```

Response:
```json
{
  "success": true,
  "activeSessions": 0,
  "uptime": 12345,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Scaling

Clever Cloud automatically scales your application:
- **Vertical scaling**: Upgrade your plan for more resources
- **Horizontal scaling**: Enable multiple instances (paid plans)

## Security

- Never commit `.env` files or credentials
- Use environment variables for sensitive data
- Regularly rotate GitHub tokens if used
- Keep dependencies updated

## Support

For issues or questions:
- Check the logs first
- Review this README
- Contact support on WhatsApp channel

## Credits

- **Original Bot**: PASIYA-MD
- **Developer**: PASIYA BOY
- **Platform**: Clever Cloud
- **WhatsApp Library**: Baileys (@whiskeysockets/baileys)

## License

MIT License - See LICENSE file for details

---

Made with ❤️ by PASIYA BOY | Powered by Clever Cloud
