// Данные для новостей
const newsData = [
    {
        id: 1,
        title: 'Новый сезон "Атака Титанов" анонсирован',
        description: 'Студия MAPPA объявила о продолжении популярного аниме. Премьера запланирована на весну 2026 года.',
        date: '5 ноября 2025',
        views: 1240,
        category: 'Анонс',
        image: 'https://source.unsplash.com/400x200/?anime,action'
    },
    {
        id: 2,
        title: 'Топ-10 аниме осеннего сезона 2025',
        description: 'Представляем подборку самых интересных аниме этого сезона по мнению зрителей.',
        date: '3 ноября 2025',
        views: 856,
        category: 'Рейтинг',
        image: 'https://source.unsplash.com/400x200/?anime,characters'
    },
    {
        id: 3,
        title: 'Интервью с создателем "Моя геройская академия"',
        description: 'Кохэй Хорикоси рассказал о будущем манги и аниме-адаптации.',
        date: '1 ноября 2025',
        views: 2103,
        category: 'Интервью',
        image: 'https://source.unsplash.com/400x200/?manga,drawing'
    },
    {
        id: 4,
        title: 'Новая игра по вселенной "Наруто"',
        description: 'Разработчики представили трейлер новой RPG игры в мире Наруто.',
        date: '30 октября 2025',
        views: 1567,
        category: 'Игры',
        image: 'https://source.unsplash.com/400x200/?videogame'
    }
];

// Данные для форума
const forumThreads = [
    {
        id: 1,
        title: 'Какое аниме посмотреть новичку?',
        author: 'Sakura_chan',
        category: 'Обсуждение',
        replies: 23,
        views: 145,
        lastReply: '10 минут назад'
    },
    {
        id: 2,
        title: 'Лучшие моменты из "Ван-Пис"',
        author: 'Mugiwara',
        category: 'Обсуждение',
        replies: 47,
        views: 289,
        lastReply: '1 час назад'
    },
    {
        id: 3,
        title: 'Помогите найти аниме про драконов',
        author: 'DragonFan',
        category: 'Вопрос',
        replies: 8,
        views: 56,
        lastReply: '2 часа назад'
    },
    {
        id: 4,
        title: 'Обсуждение финала "Стальной алхимик"',
        author: 'EdwardElric',
        category: 'Спойлеры',
        replies: 91,
        views: 512,
        lastReply: '3 часа назад'
    },
    {
        id: 5,
        title: 'Рекомендации романтических аниме',
        author: 'LoveAnime',
        category: 'Рекомендации',
        replies: 34,
        views: 203,
        lastReply: '5 часов назад'
    },
    {
        id: 6,
        title: 'Что вы думаете о новом сезоне "Демон-убийца"?',
        author: 'TanjiroFan',
        category: 'Обсуждение',
        replies: 67,
        views: 423,
        lastReply: '6 часов назад'
    }
];

// Данные пользователей
const users = [
    { username: 'Sakura_chan', postsCount: 45 },
    { username: 'Mugiwara', postsCount: 78 },
    { username: 'DragonFan', postsCount: 12 },
    { username: 'EdwardElric', postsCount: 134 },
    { username: 'LoveAnime', postsCount: 56 },
    { username: 'TanjiroFan', postsCount: 89 },
    { username: 'NarutoFan', postsCount: 23 },
    { username: 'AnimeLover', postsCount: 67 }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка темы
    loadTheme();
    
    // Проверка авторизации
    checkAuth();
    
    // Отрисовка контента
    renderNews();
    renderForum();
    
    // Обработчики событий
    setupEventListeners();
});

// Загрузка темы из localStorage
function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark');
    }
}

// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Проверка авторизации
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('username').textContent = currentUser.username;
        document.getElementById('userAvatar').textContent = currentUser.username[0].toUpperCase();
    } else {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
    }
}

// Вход
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const userData = { username: user.username, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        checkAuth();
        closeModal('loginModal');
        return true;
    } else {
        alert('Неверный email или пароль!');
        return false;
    }
}

// Регистрация
function register(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже существует!');
        return false;
    }
    
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const userData = { username, email };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    checkAuth();
    closeModal('registerModal');
    return true;
}

// Выход
function logout() {
    localStorage.removeItem('currentUser');
    checkAuth();
}

// Отрисовка новостей
function renderNews() {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = newsData.map(news => `
        <div class="news-card">
            <img src="${news.image}" alt="${news.title}">
            <div class="news-card-header">
                <div class="news-card-meta">
                    <span class="badge">${news.category}</span>
                    <div class="views">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>${news.views}</span>
                    </div>
                </div>
                <h3>${news.title}</h3>
                <p>${news.description}</p>
            </div>
            <div class="news-card-footer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${news.date}</span>
            </div>
        </div>
    `).join('');
}

// Отрисовка форума
function renderForum() {
    const forumList = document.getElementById('forumList');
    forumList.innerHTML = forumThreads.map(thread => `
        <div class="forum-card">
            <div class="forum-card-content">
                <div class="forum-avatar">${thread.author[0].toUpperCase()}</div>
                <div class="forum-info">
                    <div class="forum-badge">${thread.category}</div>
                    <h3>${thread.title}</h3>
                    <div class="forum-meta">
                        <div class="forum-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>${thread.author}</span>
                        </div>
                        <div class="forum-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span>${thread.replies} ответов</span>
                        </div>
                        <div class="forum-meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>${thread.lastReply}</span>
                        </div>
                    </div>
                </div>
                <div class="forum-stats">
                    <div class="forum-stats-number">${thread.views}</div>
                    <div class="forum-stats-label">просмотров</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Поиск
function search(query) {
    const searchResults = document.getElementById('searchResults');
    
    if (!query.trim()) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>Введите запрос для поиска</p>
            </div>
        `;
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    // Поиск в новостях
    newsData.forEach(news => {
        if (news.title.toLowerCase().includes(lowerQuery) || 
            news.description.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'news',
                ...news
            });
        }
    });
    
    // Поиск в форуме
    forumThreads.forEach(thread => {
        if (thread.title.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'forum',
                ...thread
            });
        }
    });
    
    // Поиск пользователей
    users.forEach(user => {
        if (user.username.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'user',
                ...user
            });
        }
    });
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <p>Ничего не найдено по запросу "${query}"</p>
            </div>
        `;
        return;
    }
    
    let html = `<div class="search-result-count">Найдено результатов: ${results.length}</div>`;
    
    results.forEach(result => {
        if (result.type === 'news') {
            html += `
                <div class="search-result-card">
                    <div class="search-result-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span class="badge">${result.category}</span>
                        <div class="views">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>${result.views}</span>
                        </div>
                    </div>
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-description">${result.description}</div>
                    <div class="search-result-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${result.date}</span>
                    </div>
                </div>
            `;
        } else if (result.type === 'forum') {
            html += `
                <div class="search-result-card">
                    <div class="search-result-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span class="forum-badge">${result.category}</span>
                    </div>
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-meta">
                        <span>${result.author}</span>
                        <span>•</span>
                        <span>${result.replies} ответов</span>
                        <span>•</span>
                        <span>${result.views} просмотров</span>
                    </div>
                </div>
            `;
        } else if (result.type === 'user') {
            html += `
                <div class="search-result-card">
                    <div class="search-user-card">
                        <div class="search-user-avatar">${result.username[0].toUpperCase()}</div>
                        <div>
                            <div class="search-result-header">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>${result.username}</span>
                            </div>
                            <div class="text-muted">${result.postsCount} сообщений</div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    searchResults.innerHTML = html;
}

// Открытие модального окна
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

// Закрытие модального окна
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Установка обработчиков событий
function setupEventListeners() {
    // Переключение темы
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Переключение вкладок
    document.querySelectorAll('.tab-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Убираем активный класс со всех вкладок
            document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
    
    // Модальные окна
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('registerBtn').addEventListener('click', () => openModal('registerModal'));
    document.getElementById('searchBtn').addEventListener('click', () => openModal('searchModal'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Закрытие модальных окон
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.dataset.modal);
        });
    });
    
    // Закрытие по клику вне модального окна
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Переключение между формами
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('loginModal');
        openModal('registerModal');
    });
    
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('registerModal');
        openModal('loginModal');
    });
    
    // Форма входа
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });
    
    // Форма регистрации
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        register(username, email, password, confirmPassword);
    });
    
    // Поиск
    document.getElementById('searchInput').addEventListener('input', function(e) {
        search(e.target.value);
    });
}
