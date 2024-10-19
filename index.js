const axios = require('axios');
const cheerio = require('cheerio'); 
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');

const url = 'https://horo.mail.ru/';
const tg_token = '7280405687:AAGzb2mREiOBOPKxBdzQAjDAMl6HRfFCdME'; 

const tgBot = new TelegramBot(tg_token, { polling: true });

let chatId; 

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


tgBot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id; 
    tgBot.sendMessage(chatId, 'Привет! Отправь команду /horoscope, чтобы получить гороскоп.');
});


tgBot.onText(/\/horoscope/, async (msg) => {
    const horoscope = await fetchHoroscope(); 

    if (horoscope) {
        tgBot.sendMessage(chatId, formatHoroscope(horoscope)); 
    } else {
        tgBot.sendMessage(chatId, 'Не удалось получить гороскоп.');
    }
});


const formatHoroscope = (horoscopeText) => {
    return `
*Гороскоп на сегодня* 🔮:

_${horoscopeText}_

✨ Пусть звезды будут благосклонны к вам! ✨
    `;
};


const job = schedule.scheduleJob('0 9 * * *', async () => {
    if (chatId) {
        const horoscope = await fetchHoroscope(); 
        const formattedHoroscope = formatHoroscope(horoscope);
        tgBot.sendMessage(chatId, formattedHoroscope, { parse_mode: 'Markdown' });
    } else {
        console.log('chatId не найден. Убедитесь, что пользователь запустил бота с командой /start.');
    }
});
