require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

// 1. Импортируем пакеты безопасности
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Подключаем базу данных
connectDB();
const app = express();

// КРИТИЧЕСКИ ВАЖНО ДЛЯ RENDER: Указываем Express доверять балансировщику нагрузки
app.set('trust proxy', 1);

// --- БАЗОВЫЕ MIDDLEWARE ---
app.use(cors());
app.use(helmet()); // Добавляет безопасные HTTP-заголовки
app.use(express.static('public'));
app.use(express.json()); // Парсит JSON (ОБЯЗАТЕЛЬНО ДОЛЖНО СТОЯТЬ ДО ОЧИСТКИ)
app.use(express.urlencoded({ extended: false }));

// --- ЗАЩИТА ДАННЫХ (ОЧИСТКА) ---
// app.use(mongoSanitize()); // Удаляет запрещенные символы (вроде $) для защиты от NoSQL-инъекций
app.use(xss()); // Удаляет вредоносные скрипты и HTML-теги из запросов

// --- ОГРАНИЧЕНИЕ ЗАПРОСОВ (RATE LIMIT) ---
const leadFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3, 
    // Вместо message используем handler для жесткого возврата JSON
    handler: (req, res) => {
        res.status(429).json({ 
            error: 'נשלחו יותר מדי פניות מכתובת זו. אנא נסה שוב בעוד שעה.' 
        });
    }
});

// Применяем лимит ТОЛЬКО к маршруту отправки заявок
app.use('/api/leads', leadFormLimiter);


// --- МАРШРУТЫ (ROUTES) ---
app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'API works fine'});
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});