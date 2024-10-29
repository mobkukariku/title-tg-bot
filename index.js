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

const fetchHourlyForecast = async (cityName) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weather_token}&lang=ru`);
        return data.list.slice(0, 3);
    } catch (e) {
        console.error(e);
        return null;
    }
};

tgBot.onText(/\/start/, (msg) => {
    tgBot.sendMessage(msg.chat.id, 'Привет! Чтобы узнать погоду, введите команду /weather и название города');
});

tgBot.onText(/\/weather(?:\s+(.+))?/, async (msg, match) => {
    const cityName = match[1];
    const data = await fetchWeather(cityName);
    const hourlyForecast = await fetchHourlyForecast(cityName);
    if (!data || !hourlyForecast) {
        return tgBot.sendMessage(msg.chat.id, `Не удалось получить погоду для города: ${cityName}`);
    }
    const weather = data.weather[0].description;
    const temp = data.main.temp;
    const message = messagePattern(cityName, temp, weather, hourlyForecast);
    tgBot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
});

const getClothingAdvice = require('./clothingAdvice');

const kelvinToCelsius = (temp) => {
    return Math.round(temp - 273.15).toFixed(2);
};
const messagePattern = (cityName, temp, weather, hourlyForecast) => {
    return `
*Доброе утро!*
---------------------------------------
🌞 Город: *${cityName}*
🌡️ Температура: *${kelvinToCelsius(temp)}°C*
☁️ Погода: *${weather}*
---------------------------------------
${getClothingAdvice(kelvinToCelsius(temp), weather)}
---------------------------------------
${hourlyForecastPattern(hourlyForecast)}
    `;
};



const hourlyForecastPattern = (forecast) => {
    let forecastMessage = `*Прогноз на следующие 3 часа:*\n`;

    forecast.forEach((hour) => {
        const date = new Date(hour.dt * 1000);
        const time = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        const temp = kelvinToCelsius(hour.main.temp);
        const description = hour.weather[0].description;

        const hourOfDay = date.getHours();
        const clockEmojis = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];
        const clockIcon = clockEmojis[hourOfDay % 12]; 

        forecastMessage += `\n${clockIcon} *${time}*\n🌡 Температура: *${temp}°C*\n☁️ Описание: *${description.charAt(0).toUpperCase() + description.slice(1)}*\n`;
    });

    return forecastMessage;
};





const job = schedule.scheduleJob('0 2 * * *', async () => {
    const weather = await fetchWeather('Каскелен');
    const hourlyForecast = await fetchHourlyForecast('Каскелен');

    if (!weather || !hourlyForecast) {
        console.error('Не удалось получить прогноз для Каскелена');
        return;
    }

    const temp = weather.main.temp;
    const message = messagePattern('Каскелен', temp, weather.weather[0].description, hourlyForecast);

    tgBot.sendMessage(channel_id, message, { parse_mode: 'Markdown' });
});
