// routes/api.js

const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { sendTelegramMessage } = require('../services/telegram');

// POST /api/leads - Make new request

router.post('/leads', async (req, res) => {
    try {
        const {name, phone, serviceType } = req.body;
    
    // Basic validation

    if (!name || !phone){
        return res.status(400).json({ error: 'Name and Phone is required'});
    }

    // save to db (mongo)
    const newLead = await Lead.create({
        name,
        phone,
        serviceType: serviceType || 'Не указано'
    
    });

    //Make message for Telegram

    const message = `
    <b> New request from website!</b>
    <b>Name:</b> ${name}
    <b>Phone:</b> ${phone}
    <b>Service:</b> ${serviceType || 'Not filled'}
    `;

    // send to telegram

    sendTelegramMessage(message);
    
    // Answer to client
    res.status(201).json({ success: true, leadId: newLead._id });

    }catch (error) {
        console.error('Cant make lead', error);
        res.status(500).json({ error: 'Server error'});
    }
});

router.get('/', (req, res) => {
  res.json({
    message: 'FixMaster API is running',
    status: 'ok'
  });
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});

module.exports = router;
