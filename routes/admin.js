// routes/admin.js
const express = require('express');
const path = require('path');
const router = express.Router();
const Lead = require('../models/Lead');
const basicAuth = require('../middleware/auth');

// Защищаем все маршруты админки
router.use(basicAuth);

// 1. Отдача HTML-страницы админки
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// 2. Получение списка всех лидов (сортировка: сначала новые)
router.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בטעינת הנתונים' });
  }
});

// 3. Обновление статуса лида
router.patch('/api/leads/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedLead);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעדכון הסטטוס' });
  }
});

// 4. Удаление лида
router.delete('/api/leads/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה במחיקת הליד' });
  }
});

module.exports = router;