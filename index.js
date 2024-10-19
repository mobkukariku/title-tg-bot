const axios = require('axios');
const cheerio = require('cheerio'); 
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');


require('dotenv').config();

const url = process.env.HOROSCOPE_URL;  
const tg_token = process.env.TELEGRAM_TOKEN;  
const allowedUserId = parseInt(process.env.ALLOWED_USER_ID);  
const channel_id = process.env.CHANNEL_ID;  


const tgBot = new TelegramBot(tg_token, { polling: true });


async function fetchHoroscope() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const horoscopeText = $('.b6a5d4949c.e45a4c1552 p').text().trim(); 
    
        if (!horoscopeText) {
            return 'Не удалось получить гороскоп. Попробуйте позже.';
        }

        return horoscopeText;
    } catch (e) {
        console.error(e);
        return 'Ошибка при получении данных. Попробуйте позже.';
    }
}


const formatHoroscope = (horoscopeText) => {
    return `
*Гороскоп на сегодня* 🔮:

_${horoscopeText}_

✨ Пусть звезды будут благосклонны к вам! ✨
    `;
};


const isAllowedUser = (msg) => {
    return msg.from.id === allowedUserId;
};


tgBot.onText(/\/start/, (msg) => {
    if (!isAllowedUser(msg)) {
        return tgBot.sendMessage(msg.chat.id, 'У вас нет прав для выполнения этой команды.');
    }
    
    tgBot.sendMessage(msg.chat.id, 'Привет! Я буду публиковать гороскопы в ваш канал.');
});

tgBot.onText(/\/horoscope/, async (msg) => {
    if (!isAllowedUser(msg)) {
        return tgBot.sendMessage(msg.chat.id, 'У вас нет прав для выполнения этой команды.');
    }

    const horoscope = await fetchHoroscope(); 

    if (horoscope) {
        const formattedHoroscope = formatHoroscope(horoscope);
        tgBot.sendMessage(channel_id, formattedHoroscope, { parse_mode: 'Markdown' });
    } else {
        tgBot.sendMessage(msg.chat.id, 'Не удалось получить гороскоп.');
    }
});

const job = schedule.scheduleJob('0 9 * * *', async () => {
    const horoscope = await fetchHoroscope(); 
    const formattedHoroscope = formatHoroscope(horoscope);
    tgBot.sendMessage(channel_id, formattedHoroscope, { parse_mode: 'Markdown' });
});
