// public/js/admin.js
let allLeads = []; // Храним все лиды здесь
let currentFilter = 'all'; // Текущая активная вкладка

// Загрузка данных с сервера (вызывается при старте и по кнопке Обновить)
async function loadLeads() {
  try {
    const res = await fetch('/admin/api/leads');
    if (!res.ok) throw new Error('שגיאה בטעינת לידים');
    allLeads = await res.json();
    renderLeads();
    updateBadges();
  } catch (err) {
    document.getElementById('leadsBody').innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">${err.message}</td></tr>`;
  }
}

// Отрисовка таблицы на основе фильтра
function renderLeads() {
  const tbody = document.getElementById('leadsBody');
  
  // Фильтруем массив в зависимости от выбранной вкладки
  const filteredLeads = currentFilter === 'all' 
    ? allLeads 
    : allLeads.filter(lead => lead.status === currentFilter);

  if (filteredLeads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">אין פניות בסטטוס זה</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredLeads.map(lead => {
    const date = new Date(lead.createdAt).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
    return `
      <tr>
        <td class="date-col">${date}</td>
        <td><b>${lead.name}</b></td>
        <td><a href="tel:${lead.phone}" dir="ltr">${lead.phone}</a></td>
        <td>${lead.serviceType}</td>
        <td>
          <select onchange="updateStatus('${lead._id}', this.value)">
            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>חדש</option>
            <option value="in_progress" ${lead.status === 'in_progress' ? 'selected' : ''}>בטיפול</option>
            <option value="done" ${lead.status === 'done' ? 'selected' : ''}>הושלם</option>
          </select>
        </td>
        <td>
          <button class="btn-del" onclick="deleteLead('${lead._id}')">מחק</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Переключение вкладок
function setFilter(status) {
  currentFilter = status;
  
  // Обновляем визуальное выделение вкладок
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${status}`).classList.add('active');
  
  renderLeads();
}

// Обновление счетчиков в круглых бейджах
function updateBadges() {
  const counts = {
    all: allLeads.length,
    new: allLeads.filter(l => l.status === 'new').length,
    in_progress: allLeads.filter(l => l.status === 'in_progress').length,
    done: allLeads.filter(l => l.status === 'done').length
  };

  document.getElementById('badge-all').textContent = counts.all;
  document.getElementById('badge-new').textContent = counts.new;
  document.getElementById('badge-in_progress').textContent = counts.in_progress;
  document.getElementById('badge-done').textContent = counts.done;
}

// Изменение статуса (сохраняет на сервер и сразу перерисовывает интерфейс)
async function updateStatus(id, newStatus) {
  try {
    const res = await fetch(`/admin/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      // Находим лид в локальном массиве и меняем ему статус
      const leadIndex = allLeads.findIndex(l => l._id === id);
      if (leadIndex !== -1) {
        allLeads[leadIndex].status = newStatus;
      }
      // Перерисовываем UI (лид исчезнет из текущей вкладки, если статус изменился)
      renderLeads();
      updateBadges();
    }
  } catch (err) {
    alert('שגיאה בעדכון סטטוס');
  }
}

// Удаление лида
async function deleteLead(id) {
  if (!confirm('האם אתה בטוח שברצונך למחוק ליד זה?')) return;
  try {
    const res = await fetch(`/admin/api/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      allLeads = allLeads.filter(l => l._id !== id);
      renderLeads();
      updateBadges();
    }
  } catch (err) {
    alert('שגיאה במחיקת הליד');
  }
}

document.addEventListener('DOMContentLoaded', loadLeads);