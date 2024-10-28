const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const schedule = require('node-schedule');

require('dotenv').config();
 
const tg_token = process.env.TELEGRAM_TOKEN;  
const channel_id = process.env.CHANNEL_ID;  
const weather_token = process.env.WEATHER_TOKEN;

const tgBot = new TelegramBot(tg_token, { polling: true });

const fetchWeather = async (cityName) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weather_token}&lang=ru`);
        return data;
    } catch (e) {
        console.error(e);
        return null; 
    }
};


const kelvinToCelsius = (temp) => {
    return Math.round(temp - 273.15).toFixed(2);
};

tgBot.onText(/\/start/, (msg) => {
    
    tgBot.sendMessage(msg.chat.id, 'Привет! чтобы узнать погоду введите команду /weather и название города');
});

tgBot.onText(/\/weather(?:\s+(.+))?/, async (msg, match) => {
    const cityName = match[1];
    const data = await fetchWeather(cityName);

    if(!data) {
        return tgBot.sendMessage(msg.chat.id, `Не удалось получить погоду для города: ${cityName}`);
    }

    const weather = data.weather[0].description;
    const temp = data.main.temp;
    const message = messagePattern(cityName, temp, weather);

    tgBot.sendMessage(msg.chat.id, message, {parse_mode: 'Markdown'});
});


const messagePattern = (cityName, temp, weather) => {
    return `
    *Доброе утро!*
----------------------------------
🌞 город *${cityName}*
🌡️ Температура: *${kelvinToCelsius(temp)}°C*
☁️ Погода: *${weather}*
----------------------------------
${messagePatt(kelvinToCelsius(temp), weather)}
    `;
};

const messagePatt = (temp, weather) => {
    if (temp > 0 && temp < 10) {
        return `Немного прохладно, худи или легкая куртка будет заебись.`;
    } else if (temp >= 10 && temp < 20) {
        return `Как будто можно в футболке ходить и радоваться жизни.`;
    } else if (temp >= 20) {
        return `Как будто пиздец жарко.`;
    } else if (temp < 0 && temp > -10) {
        return `Холодновато`;
    } else if (temp <= -10 && temp > -20) {
        return `Тебе лучше не выебываться и гамаж в ебало наебнуть.`;
    } else if (temp <= -20 && temp > -30) {
        return `В такую погоду скучаешь о лете.`;
    } else if (temp <= -30) {
        return `Пиздец можно все отморозить. Лучше на улицу не выходи, если ты даун ебанный.`;
    } else {
        return `Нет особых рекомендаций для такой погоды.`; 
    }
};


const job = schedule.scheduleJob('0 2 * * *', async () => {
    const weather = await fetchWeather('Каскелен');
    const temp = weather.main.temp;
    const message = messagePattern('Каскелен', temp, weather.weather[0].description);
    tgBot.sendMessage(channel_id, message, {parse_mode: 'Markdown'});
})