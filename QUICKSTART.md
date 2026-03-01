# Quick Start Guide - PASIYA-MD on Clever Cloud

## In 5 Minutes

### 1. Sign Up & Create App (2 minutes)
```
→ Go to: https://www.clever-cloud.com/
→ Sign up (free)
→ Create → Node.js app
→ Name: pasiya-bot
→ Region: Choose closest
→ Instance: Nano (free)
```

### 2. Get Git URL (30 seconds)
```
→ In app console, copy Git URL
→ Example: git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_xxx.git
```

### 3. Deploy (2 minutes)
```bash
# Clone/download this code
cd pasiya-bot-clever

# Initialize git (if needed)
git init
git add .
git commit -m "Deploy"

# Add Clever Cloud remote (use YOUR URL from step 2)
git remote add clever YOUR_GIT_URL

# Push to deploy
git push clever master
```

### 4. Test (30 seconds)
```
→ Visit: https://app-xxx.cleverapps.io
→ Click "Get Pairing Code"
→ Enter phone number
→ Link device with code
```

## Done! 🎉

Your bot is live!

---

## Troubleshooting

**Can't push to git?**
```bash
# Check SSH key is added
ssh-add -l

# Generate if needed
ssh-keygen -t rsa -b 4096
```

**App not starting?**
- Check logs in Clever Cloud console
- Ensure Node.js 18.x

**Pairing not working?**
- Use format: 94771234567 (country code + number)
- No spaces, no +

---

## What's Next?

1. **Custom domain**: Add in Clever Cloud console
2. **Environment vars**: Configure in settings
3. **Monitor**: Check logs and metrics
4. **Scale**: Upgrade instance if needed

Full guide: See README.md and DEPLOYMENT.md
