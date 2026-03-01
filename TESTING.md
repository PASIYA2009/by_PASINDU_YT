# Test Your Deployment

## Local Testing

Before deploying, test locally:

```bash
# Install dependencies
npm install

# Start server
npm start

# Or with nodemon for development
npm run dev
```

Visit:
- Homepage: http://localhost:8080
- Pairing: http://localhost:8080/pair
- Health: http://localhost:8080/health

## Testing Pairing Locally

1. Start server: `npm start`
2. Open: http://localhost:8080/pair
3. Enter your number: 94771234567
4. Get pairing code
5. Link in WhatsApp

## API Testing

### Generate Pairing Code
```bash
curl "http://localhost:8080/code?phone=94771234567"
```

Expected response:
```json
{
  "success": true,
  "code": "ABCD-EFGH",
  "message": "Enter this code in WhatsApp...",
  "number": "94771234567",
  "expiresIn": 60
}
```

### Health Check
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Common Test Scenarios

### Valid Phone Number
```bash
curl "http://localhost:8080/code?phone=94771234567"
# Should return pairing code
```

### Invalid Phone Number
```bash
curl "http://localhost:8080/code?phone=123"
# Should return error
```

### Missing Phone Number
```bash
curl "http://localhost:8080/code"
# Should return error
```

## Troubleshooting Tests

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different port
PORT=3000 npm start
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Permission Errors
```bash
# Fix session directory permissions
chmod -R 755 session
```

## Production Testing

After deploying to Clever Cloud:

### Test Homepage
```bash
curl https://your-app.cleverapps.io
```

### Test Pairing API
```bash
curl "https://your-app.cleverapps.io/code?phone=94771234567"
```

### Test Health Endpoint
```bash
curl https://your-app.cleverapps.io/health
```

### Monitor Logs
```bash
clever logs --follow
```

## Performance Testing

### Load Test
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 https://your-app.cleverapps.io/
```

### Stress Test
```bash
# Test pairing endpoint
ab -n 50 -c 5 "https://your-app.cleverapps.io/code?phone=94771234567"
```

## Checklist

Before going live:
- [ ] Local testing passes
- [ ] Pairing works
- [ ] Health endpoint responds
- [ ] Logs are clean
- [ ] Environment variables set
- [ ] Session directory exists
- [ ] All files committed to git
- [ ] Deployed to Clever Cloud
- [ ] Production URL works
- [ ] Custom domain configured (optional)

## Support

If tests fail:
1. Check logs: `clever logs`
2. Verify environment variables
3. Ensure Node.js 18.x
4. Review error messages
5. Consult documentation
