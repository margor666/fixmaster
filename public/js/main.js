document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('formStatus');
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        serviceType: document.getElementById('service').value
    };

    btn.disabled = true;
    btn.textContent = 'שולח...'; // Отправка...
    statusMsg.textContent = '';
    statusMsg.className = 'status-msg';

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            statusMsg.textContent = 'תודה! הפנייה התקבלה בהצלחה.'; // Спасибо! Заявка принята.
            statusMsg.classList.add('success');
            e.target.reset(); // Очищаем форму
        } else {
            throw new Error(result.error || 'שגיאה בשליחת הפנייה');
        }
    } catch (error) {
        statusMsg.textContent = error.message;
        statusMsg.classList.add('error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'הזמן שירות עכשיו';
    }
});