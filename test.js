// test.js
fetch('http://localhost:5000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Роман (Тест)',
    phone: '054-1234567',
    serviceType: 'Ремонт электрики'
  })
})
.then(res => res.json())
.then(data => console.log('Ответ сервера:', data))
.catch(err => console.error('Ошибка:', err));