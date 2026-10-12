//server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

//connect DB
connectDB();
const app = express();
// Импортируем библиотеку (добавь эту строку к остальным require)
const rateLimit = require('express-rate-limit');

// ... твой код инициализации app ...
// const app = express();

// КРИТИЧЕСКИ ВАЖНО ДЛЯ RENDER: Указываем Express доверять балансировщику нагрузки
app.set('trust proxy', 1);

// Создаем правило лимитирования для формы заявок
const leadFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час (в миллисекундах)
    max: 3, // Максимум 3 заявки с одного IP в течение часа
    message: { 
        // Отдаем JSON с ошибкой на иврите, чтобы наш фронтенд красиво её показал
        error: 'נשלחו יותר מדי פניות מכתובת זו. אנא נסה שוב בעוד שעה.' 
    },
    standardHeaders: true, // Возвращает инфо о лимитах в заголовках `RateLimit-*`
    legacyHeaders: false, // Отключает старые заголовки `X-RateLimit-*`
});

// Применяем лимит ТОЛЬКО к маршруту отправки заявок
app.use('/api/leads', leadFormLimiter);
//Middleware

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); //To understand json form POST
app.use(express.urlencoded({ extended: false}));

//Base test route

app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'API works fine'});
});
// routes

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})