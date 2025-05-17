const forbiddenWords = ['şerefsiz', 'orospu', 'piç']
const complaintWords = ['şikayet', 'karakol', 'savcılık', 'paramı istiyorum']
const ibanRegex = /TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/i

export default async function handler(sock, msg) {
    const from = msg.key.remoteJid
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''

    const lower = body.toLowerCase()

    if (complaintWords.some(word => lower.includes(word))) {
        await sock.sendMessage(from, {
            text: `Şikayetiniz için lütfen bu formu doldurun: https://forms.gle/sikayetformunuz\nTüketici Hakem Heyeti başvurusu için e-devlet üzerinden işlem yapabilirsiniz.`
        })
        return
    }

    if (forbiddenWords.some(word => lower.includes(word))) {
        await sock.sendMessage(from, {
            text: `Lütfen uygun bir dil kullanın. Destek ekibimiz size yardımcı olmak için burada.`
        })
        return
    }

    if (ibanRegex.test(body)) {
        await sock.sendMessage(from, {
            text: `Güvenliğiniz için bu tür bilgileri paylaşmaktan kaçının.`
        })
        return
    }

    if (lower.includes('kurulum')) {
        await sock.sendMessage(from, {
            text: `Uzaktan kurulum desteği için lütfen 5506987031 numaralı WhatsApp hattımızla iletişime geçin.`
        })
        return
    }

    if (lower.includes('kargo')) {
        await sock.sendMessage(from, {
            text: `Kargo çıkışı sağlandıktan sonra 48 saat içinde teslimat yapılmaktadır. Gecikme yaşarsanız 5506987031 numarasına ulaşabilirsiniz.`
        })
        return
    }

    if (lower.includes('iade')) {
        await sock.sendMessage(from, {
            text: `İade işlemleri için SMS ile gelen numaralardan birini arayabilirsiniz. Sorununuz çözülmezse lütfen şikayet formunu doldurun: https://forms.gle/sikayetformunuz`
        })
        return
    }

    if (lower.includes('modem') || lower.includes('router')) {
        await sock.sendMessage(from, {
            text: `Lütfen cihazınız için destek almak üzere 5506987031 numarasıyla iletişime geçin.`
        })
        return
    }

    await sock.sendMessage(from, {
        text: `Merhaba 👋 Size nasıl yardımcı olabilirim?`
    })
}
