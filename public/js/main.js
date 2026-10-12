// Логика показа/скрытия поля "Другое"
const serviceSelect = document.getElementById('service');
const otherServiceGroup = document.getElementById('otherServiceGroup');
const otherServiceInput = document.getElementById('otherService');

serviceSelect.addEventListener('change', (e) => {
    if (e.target.value === 'אחר') {
        otherServiceGroup.style.display = 'block';
        otherServiceInput.required = true; // Делаем поле обязательным, если выбрали "אחר"
    } else {
        otherServiceGroup.style.display = 'none';
        otherServiceInput.required = false;
        otherServiceInput.value = ''; // Очищаем поле, если клиент передумал
    }
});

// Логика отправки формы
document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('formStatus');
    
    // Формируем итоговое значение услуги
    let finalService = serviceSelect.value;
    if (finalService === 'אחר') {
        finalService = `אחר: ${otherServiceInput.value}`;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        serviceType: finalService
    };

    btn.disabled = true;
    btn.textContent = 'שולח...';
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
            statusMsg.textContent = 'תודה! הפנייה התקבלה בהצלחה.';
            statusMsg.classList.add('success');
            
            // Очищаем форму и прячем поле "Другое"
            e.target.reset(); 
            otherServiceGroup.style.display = 'none';
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