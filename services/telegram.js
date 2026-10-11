// services/telegram.js

// const axios = require('axios');

const sendTelegramMessage = async (message) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if(!token || !chatId){
        console.error('Telegram Token or Id not set in .env');
        return;
    }
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML', // Позволит использовать жирный шрифт и ссылки в сообщениях
            }),
        });

        const data = await response.json();
        if (!data.ok) {
            console.error('Error Telegram API:', data.description);
        } else {
            console.log('Message sent to Telegram');
        }
    } catch (error) {
        console.error('Error send to telegram', error.message);
    }
};

module.exports = { sendTelegramMessage };