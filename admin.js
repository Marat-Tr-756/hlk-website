// ====================
// 1. ЗАГРУЗКА НОВОСТЕЙ
// ====================
async function loadNews() {
    try {
        const res = await fetch('news.json');
        if (!res.ok) throw new Error('Не удалось загрузить новости');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        return [];
    }
}

// ====================
// 2. СОХРАНЕНИЕ НОВОСТЕЙ
// ====================
async function saveNews(news) {
    try {
        const res = await fetch('news.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(news)
        });
        if (!res.ok) throw new Error('Не удалось сохранить новости');
        return true;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        return false;
    }
}

// ====================
// 3. ОТОБРАЖЕНИЕ НОВОСТЕЙ В АДМИНКЕ
// ====================
async function renderNewsList() {
    const container = document.getElementById('news-list');
    const news = await loadNews();

    if (news.length === 0) {
        container.innerHTML = '<p style="color: #a0a0a0;">Пока нет новостей. Добавьте первую!</p>';
        return;
    }

    container.innerHTML = '';
    news.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <div class="news-info">
                <h3>${item.title}</h3>
                <small>📅 ${item.date || 'Без даты'}</small>
                <p>${item.text.substring(0, 100)}${item.text.length > 100 ? '...' : ''}</p>
                ${item.image ? `<img src="${item.image}" alt="Изображение" style="max-width: 100px; max-height: 60px; object-fit: cover; border-radius: 8px; margin-top: 8px;">` : ''}
            </div>
            <div class="news-actions">
                <button class="btn-edit" data-index="${index}">✏️</button>
                <button class="btn-delete" data-index="${index}">🗑️</button>
            </div>
        `;
        container.appendChild(div);
    });

    // Обработчики для кнопок "Редактировать" и "Удалить"
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => editNews(parseInt(btn.dataset.index)));
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteNews(parseInt(btn.dataset.index)));
    });
}

// ====================
// 4. ДОБАВЛЕНИЕ НОВОСТИ
// ====================
async function addNews() {
    const title = document.getElementById('news-title').value.trim();
    const date = document.getElementById('news-date').value;
    const text = document.getElementById('news-text').value.trim();
    const image = document.getElementById('news-image').value.trim();

    if (!title || !text) {
        alert('Заполните заголовок и текст новости!');
        return;
    }

    const news = await loadNews();
    const newNews = {
        id: Date.now(),
        title: title,
        date: date || new Date().toISOString().slice(0,10),
        text: text,
        image: image || ''
    };

    news.unshift(newNews); // добавляем сверху
    const saved = await saveNews(news);
    if (saved) {
        clearForm();
        renderNewsList();
    } else {
        alert('Ошибка при сохранении новости.');
    }
}

// ====================
// 5. РЕДАКТИРОВАНИЕ НОВОСТИ
// ====================
async function editNews(index) {
    const news = await loadNews();
    const item = news[index];
    if (!item) return;

    document.getElementById('edit-id').value = index;
    document.getElementById('news-title').value = item.title;
    document.getElementById('news-date').value = item.date || '';
    document.getElementById('news-text').value = item.text;
    document.getElementById('news-image').value = item.image || '';

    document.getElementById('form-title').textContent = '✏️ Редактировать новость';
    document.getElementById('save-btn').textContent = 'Обновить новость';
    document.getElementById('cancel-btn').style.display = 'inline-block';
}

// ====================
// 6. УДАЛЕНИЕ НОВОСТИ
// ====================
async function deleteNews(index) {
    if (!confirm('Удалить эту новость?')) return;

    const news = await loadNews();
    news.splice(index, 1);
    const saved = await saveNews(news);
    if (saved) {
        renderNewsList();
    } else {
        alert('Ошибка при удалении новости.');
    }
}

// ====================
// 7. ОБНОВЛЕНИЕ НОВОСТИ
// ====================
async function updateNews() {
    const index = parseInt(document.getElementById('edit-id').value);
    if (isNaN(index)) return;

    const title = document.getElementById('news-title').value.trim();
    const date = document.getElementById('news-date').value;
    const text = document.getElementById('news-text').value.trim();
    const image = document.getElementById('news-image').value.trim();

    if (!title || !text) {
        alert('Заполните заголовок и текст новости!');
        return;
    }

    const news = await loadNews();
    if (!news[index]) return;

    news[index] = {
        ...news[index],
        title,
        date: date || news[index].date,
        text,
        image: image || ''
    };

    const saved = await saveNews(news);
    if (saved) {
        clearForm();
        renderNewsList();
    } else {
        alert('Ошибка при обновлении новости.');
    }
}

// ====================
// 8. ОЧИСТКА ФОРМЫ
// ====================
function clearForm() {
    document.getElementById('edit-id').value = '';
    document.getElementById('news-title').value = '';
    document.getElementById('news-date').value = '';
    document.getElementById('news-text').value = '';
    document.getElementById('news-image').value = '';

    document.getElementById('form-title').textContent = '➕ Добавить новость';
    document.getElementById('save-btn').textContent = 'Сохранить новость';
    document.getElementById('cancel-btn').style.display = 'none';
}

// ====================
// 9. ИНИЦИАЛИЗАЦИЯ
// ====================
document.addEventListener('DOMContentLoaded', () => {
    renderNewsList();

    document.getElementById('save-btn').addEventListener('click', () => {
        const editId = document.getElementById('edit-id').value;
        if (editId !== '') {
            updateNews();
        } else {
            addNews();
        }
    });

    document.getElementById('cancel-btn').addEventListener('click', clearForm);
});