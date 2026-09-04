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
  document.getElementById(sectionId).classList.add('active');

  // 4. Обновить активную ссылку в навигации
  const activeLink = document.querySelector(`#nav-menu a[href="#${sectionId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // 5. Прокрутить страницу вверх
  window.scrollTo(0, 0);
}

/* =========================================
   ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
   ========================================= */
function toggleAccessibility() {
  const body = document.body;
  const toggleBtn = document.querySelector('.accessibility-toggle button');

  // Переключаем класс на body
  body.classList.toggle('accessibility-mode');

  // Меняем текст и иконку кнопки
  if (body.classList.contains('accessibility-mode')) {
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Обычная версия';
    localStorage.setItem('accessibilityMode', 'on'); // Сохраняем настройку
  } else {
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Версия для слабовидящих';
    localStorage.removeItem('accessibilityMode'); // Удаляем настройку
  }
}

/* =========================================
   ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

  // Проверяем сохраненную настройку доступности (для перезагрузки страницы)
  if (localStorage.getItem('accessibilityMode') === 'on') {
    document.body.classList.add('accessibility-mode');
    const toggleBtn = document.querySelector('.accessibility-toggle button');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Обычная версия';
    }
  }

  // Обработка кликов по аккордеонам (выпадающие списки)
  document.querySelectorAll('.acc-btn').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      item.classList.toggle('active');
    });
  });

  // Сжатие шапки при прокрутке страницы
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '10px 5%';
      header.style.background = 'rgba(10, 18, 12, 0.95)';
    } else {
      header.style.padding = '15px 5%';
      header.style.background = 'rgba(15, 23, 16, 0.9)';
    }
  });
});