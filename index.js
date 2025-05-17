import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import handler from './messageHandler.js'

const startSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' })
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            await handler(sock, messages[0])
        }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) {
                startSock()
            }
        } else if (connection === 'open') {
            console.log('✅ Bot Bağlandı.')
        }
    })
}

startSock()
