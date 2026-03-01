const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();
const pino = require('pino');
const qrcode = require('qrcode');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

// Configuration
const config = {
    SESSION_ID: process.env.SESSION_ID || 'PASIYA-MD',
    BOT_NUMBER: process.env.BOT_NUMBER || '',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '94741856766',
    PREFIX: process.env.PREFIX || '.',
    AUTO_READ: process.env.AUTO_READ === 'true',
    AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW === 'true',
    MAX_RETRIES: 3
};

// Storage for active sessions
const activeSessions = new Map();
const SESSION_BASE_PATH = path.join(__dirname, 'session');

// Ensure session directory exists
if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

// Logger
const logger = pino({ level: 'silent' });

/**
 * Generate pairing code for WhatsApp
 */
async function generatePairingCode(phoneNumber) {
    return new Promise(async (resolve, reject) => {
        let retries = 0;
        const maxRetries = 3;

        const attemptConnection = async () => {
            try {
                // Clean phone number
                const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
                if (!cleanNumber || cleanNumber.length < 10) {
                    throw new Error('Invalid phone number format');
                }

                // Create session directory for this number
                const sessionPath = path.join(SESSION_BASE_PATH, `session_${cleanNumber}`);
                if (!fs.existsSync(sessionPath)) {
                    fs.mkdirSync(sessionPath, { recursive: true });
                }

                // Setup auth state
                const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
                
                // Fetch latest Baileys version
                const { version } = await fetchLatestBaileysVersion();

                // Create socket
                const sock = makeWASocket({
                    version,
                    logger,
                    printQRInTerminal: false,
                    browser: Browsers.windows('Desktop'),
                    auth: {
                        creds: state.creds,
                        keys: makeCacheableSignalKeyStore(state.keys, logger)
                    },
                    generateHighQualityLinkPreview: true,
                    syncFullHistory: false,
                    markOnlineOnConnect: false,
                    getMessage: async () => ({ conversation: 'Hi' })
                });

                // Handle connection updates
                sock.ev.on('connection.update', async (update) => {
                    const { connection, lastDisconnect, qr } = update;

                    if (qr) {
                        console.log('QR Code generated (should not happen in pairing mode)');
                    }

                    if (connection === 'open') {
                        console.log(`✓ Connected successfully for ${cleanNumber}`);
                        
                        // Save credentials
                        await saveCreds();

                        // Get session data
                        const credsPath = path.join(sessionPath, 'creds.json');
                        if (fs.existsSync(credsPath)) {
                            const sessionData = fs.readFileSync(credsPath, 'utf8');
                            
                            resolve({
                                success: true,
                                sessionId: `${config.SESSION_ID}~${Buffer.from(sessionData).toString('base64')}`,
                                message: 'Connected successfully! Your session ID has been generated.',
                                number: cleanNumber
                            });

                            // Close connection after 30 seconds
                            setTimeout(() => {
                                sock.end();
                            }, 30000);
                        }
                    }

                    if (connection === 'close') {
                        const statusCode = lastDisconnect?.error?.output?.statusCode;
                        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                        console.log(`Connection closed. Status: ${statusCode}, Reconnect: ${shouldReconnect}`);

                        if (shouldReconnect && retries < maxRetries) {
                            retries++;
                            console.log(`Retry attempt ${retries}/${maxRetries}...`);
                            setTimeout(attemptConnection, 3000);
                        } else if (statusCode === DisconnectReason.loggedOut) {
                            reject(new Error('Device logged out. Please try pairing again.'));
                        } else {
                            reject(new Error('Connection failed after maximum retries'));
                        }
                    }
                });

                // Handle credentials update
                sock.ev.on('creds.update', saveCreds);

                // Request pairing code
                if (!sock.authState.creds.registered) {
                    console.log(`Requesting pairing code for ${cleanNumber}...`);
                    
                    // Wait a bit for socket to be ready
                    await delay(2000);
                    
                    const code = await sock.requestPairingCode(cleanNumber);
                    console.log(`Pairing code generated: ${code}`);
                    
                    // Store session temporarily
                    activeSessions.set(cleanNumber, {
                        sock,
                        timestamp: Date.now(),
                        code
                    });

                    // Return the pairing code immediately
                    resolve({
                        success: true,
                        code: code,
                        message: 'Enter this code in WhatsApp: Linked Devices > Link a Device > Link with Phone Number',
                        number: cleanNumber,
                        expiresIn: 60
                    });

                    // Cleanup after 2 minutes if not connected
                    setTimeout(() => {
                        if (activeSessions.has(cleanNumber)) {
                            const session = activeSessions.get(cleanNumber);
                            if (session.sock) {
                                session.sock.end();
                            }
                            activeSessions.delete(cleanNumber);
                            console.log(`Session timeout for ${cleanNumber}`);
                        }
                    }, 120000);
                }

            } catch (error) {
                console.error('Connection error:', error);
                
                if (retries < maxRetries) {
                    retries++;
                    console.log(`Retry attempt ${retries}/${maxRetries} after error...`);
                    setTimeout(attemptConnection, 3000);
                } else {
                    reject(error);
                }
            }
        };

        attemptConnection();
    });
}

/**
 * Get pairing code endpoint
 */
router.get('/', async (req, res) => {
    try {
        const phoneNumber = req.query.phone || req.query.number;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required',
                message: 'Please provide a phone number in the format: ?phone=1234567890'
            });
        }

        console.log(`Pairing request received for: ${phoneNumber}`);

        const result = await generatePairingCode(phoneNumber);
        res.json(result);

    } catch (error) {
        console.error('Pairing error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate pairing code',
            message: 'Please try again or contact support'
        });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        activeSessions: activeSessions.size,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

/**
 * Clean up old sessions periodically
 */
setInterval(() => {
    const now = Date.now();
    const timeout = 10 * 60 * 1000; // 10 minutes

    for (const [number, session] of activeSessions.entries()) {
        if (now - session.timestamp > timeout) {
            console.log(`Cleaning up stale session for ${number}`);
            if (session.sock) {
                session.sock.end();
            }
            activeSessions.delete(number);
        }
    }
}, 60000); // Check every minute

module.exports = router;
