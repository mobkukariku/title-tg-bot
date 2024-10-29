const getClothingAdvice = (temp, weather) => {
    let advice = "";

    switch (true) {
        case (temp > 0 && temp < 5):
            advice += `Холодно. Рекомендуется надеть теплый свитер, легкую куртку, а также шарф и перчатки для комфорта.`;
            break;
        case (temp >= 5 && temp < 10):
            advice += `Прохладно, лучше одеться потеплее. Худи или легкая куртка будут в самый раз.`;
            break;
        case (temp >= 10 && temp < 15):
            advice += `Можно надеть футболку с тонкой курткой.`;
            break;
        case (temp >= 15 && temp < 20):
            advice += `Прекрасная погода! Футболка и легкие штаны будут идеальны.`;
            break;
        case (temp >= 20 && temp < 25):
            advice += `Отлично! Можно смело надевать шорты и легкую майку.`;
            break;
        case (temp >= 25 && temp < 30):
            advice += `Жарко! Не забудь солнцезащитные очки и шляпу. Шорты и майка в самый раз.`;
            break;
        case (temp >= 30):
            advice += `Пиздец жарко! Надевай легкую одежду из натуральных тканей и много воды с собой.`;
            break;
        case (temp <= 0 && temp > -5):
            advice += `Холодновато. Рекомендуется надеть все что есть дома.`;
            break;
        case (temp <= -5 && temp > -10):
            advice += `Тебе лучше одеться потеплее. Надень зимнюю куртку, шарф и перчатки. Термобелье пиздец керек`;
            break;
        case (temp <= -10 && temp > -15):
            advice += `Не выходи на улицу без хорошей зимней одежды. Надень шапку, шарф, перчатки и 3 пар носков.`;
            break;
        case (temp <= -15 && temp > -20):
            advice += `Очень холодно! Лучше оставаться дома или одеться так как будто живёшь в Астане.`;
            break;
        case (temp <= -20 && temp > -30):
            advice += `В такую погоду скучаешь о лете. Нужен хороший пуховик из шерсти бурого медведя и термобелье.`;
            break;
        case (temp <= -30):
            advice += `Пиздец можно все отморозить. Лучше возьми ведро лавы чтоб согреться.`;
            break;
        default:
            advice += `Нет особых рекомендаций для такой погоды.`;
            break;
    }

    if (weather) {
        if (weather.includes("дождь")) {
            advice += " Идёт дождь. Возьми с собой зонтик и непромокаемую куртку.";
        } 
        if (weather.includes("снег")) {
            advice += " На улице снег. Рекомендуется надеть зимнюю обувь с нескользящей подошвой.";
        }
        if (weather.includes("ветер") || weather.includes("шквал")) {
            advice += " Сильный ветер, лучше надеть что-нибудь с капюшоном.";
        }
        if (weather.includes("туман") || weather.includes("мгла")) {
            advice += " На улице туман. Будь осторожен и одевайся поярче для видимости.";
        }
        if (weather.includes("гроза")) {
            advice += " Гроза. Постарайся не находиться на открытых пространствах и возьми с собой зонт.";
        }
        if (weather.includes("пыль") || weather.includes("песок")) {
            advice += " Пыльная погода. Рекомендуется надеть маску для лица и защитные очки.";
        }
    }

    return advice;
};

module.exports = getClothingAdvice;