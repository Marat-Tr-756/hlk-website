/* =========================================
   ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ВКЛАДОК (TABS)
   ========================================= */
function showSection(sectionId) {
  // 1. Скрыть все секции контента
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // 2. Убрать активный класс у всех ссылок меню
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.classList.remove('active');
  });

  // 3. Показать выбранную секцию
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');

  // 4. Обновить активную ссылку в навигации
  const activeLink = document.querySelector(`#nav-menu a[href="#${sectionId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // 5. Закрыть мобильное меню
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) navMenu.classList.remove('active');

  // 6. Прокрутить страницу вверх
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =========================================
   БУРГЕР-МЕНЮ (открытие/закрытие)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('nav-menu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Закрываем меню при клике на любую ссылку
    document.querySelectorAll('#nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // ====== ЗАГРУЗКА НОВОСТЕЙ ======
  loadNews();

  // ====== КНОПКА «НАВЕРХ» ======
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ====== СЖАТИЕ ШАПКИ ПРИ СКРОЛЛЕ ======
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.padding = '10px 5%';
        header.style.background = 'rgba(10, 18, 12, 0.95)';
      } else {
        header.style.padding = '15px 5%';
        header.style.background = 'rgba(15, 23, 16, 0.9)';
      }
    });
  }

  // ====== АККОРДЕОНЫ ======
  document.querySelectorAll('.acc-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      item.classList.toggle('active');
    });
  });

  // ====== ВОССТАНОВЛЕНИЕ НАСТРОЙКИ ДОСТУПНОСТИ ======
  if (localStorage.getItem('accessibilityMode') === 'on') {
    document.body.classList.add('accessibility-mode');
    const toggleBtn = document.querySelector('.accessibility-toggle button');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Обычная версия';
    }
  }
});

/* =========================================
   ЗАГРУЗКА НОВОСТЕЙ ИЗ news.json
   ========================================= */
async function loadNews() {
  try {
    const response = await fetch('news.json');
    if (!response.ok) {
      console.warn('Файл news.json не найден. Используем демо-новости.');
      showDemoNews();
      return;
    }
    const news = await response.json();
    renderNews(news);
  } catch (error) {
    console.error('Ошибка загрузки новостей:', error);
    showDemoNews();
  }
}

function showDemoNews() {
  const demoNews = [
    {
      id: 1,
      title: '🏆 День открытых дверей 2026',
      date: '2026-09-15',
      text: 'Приглашаем всех желающих на День открытых дверей, который состоится 15 сентября. Вы узнаете о специальностях, посетите мастер-классы и познакомитесь с преподавателями.',
      image: ''
    },
    {
      id: 2,
      title: '🎓 Наши студенты — победители олимпиады',
      date: '2026-09-10',
      text: 'Студенты специальности "Технология машиностроения" заняли призовые места на областной олимпиаде профессионального мастерства.',
      image: ''
    },
    {
      id: 3,
      title: '🛠️ Новое оборудование в мастерских',
      date: '2026-09-05',
      text: 'В учебных мастерских установлены новые станки с ЧПУ, которые позволят студентам осваивать самые современные технологии.',
      image: ''
    }
  ];
  renderNews(demoNews);
}

function renderNews(news) {
  const container = document.querySelector('.news-grid');
  if (!container) {
    console.warn('Контейнер .news-grid не найден в HTML');
    return;
  }

  if (!news || news.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Новостей пока нет. Загляните позже!</p>`;
    return;
  }

  container.innerHTML = '';
  // Показываем последние 6 новостей (первые в массиве, если они отсортированы по дате)
  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sorted.slice(0, 6);

  latest.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';

    const imgHtml = item.image
      ? `<img src="${item.image}" alt="${item.title}" class="news-img">`
      : '';

    const dateFormatted = item.date
      ? new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    card.innerHTML = `
      ${imgHtml}
      <div class="news-content">
        <h3>${item.title}</h3>
        <small>📅 ${dateFormatted}</small>
        <p>${item.text}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

/* =========================================
   ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
   ========================================= */
function toggleAccessibility() {
  const body = document.body;
  const toggleBtn = document.querySelector('.accessibility-toggle button');

  body.classList.toggle('accessibility-mode');

  if (body.classList.contains('accessibility-mode')) {
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Обычная версия';
    localStorage.setItem('accessibilityMode', 'on');
  } else {
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Версия для слабовидящих';
    localStorage.removeItem('accessibilityMode');
  }
}
