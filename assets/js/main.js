document.addEventListener('DOMContentLoaded', () => {
    // Элементы каталога
    const catalogBtn = document.getElementById('catalogBtn');
    const menuBoxContainer = document.querySelector('.menu-box-container');
    const topItems = document.querySelectorAll('.mb-top-item');
    const categoryGroups = document.querySelectorAll('.menu-box-c-p-group');
    const categoryImages = document.querySelectorAll('.category-img');
    const menuBox = document.getElementById('menuBox');

    // Элементы навигации
    const navButtons = [
        { button: 'h-btn-products', menu: 'productsMenu' },
        { button: 'h-btn-services', menu: 'servicesMenu' },
        { button: 'h-btn-company', menu: 'companyMenu' },
        { button: 'h-btn-news', menu: 'newsMenu' }
    ];

    // Состояния
    let isCatalogOpen = false;
    let activeNavContainer = null;

    // Создаем оверлей
    let menuOverlay = null;

    if (menuBox) {
        menuBox.addEventListener('click', (e) => {
            e.stopPropagation();

            // Закрываем меню каталога
            const menuBoxContainer = document.querySelector('.menu-box-container');
            const catalogBtn = document.getElementById('catalogBtn');

            if (menuBoxContainer) {
                menuBoxContainer.classList.remove('active');
            }
            if (catalogBtn) {
                catalogBtn.classList.remove('active');
            }

            // Закрываем оверлей
            const menuOverlay = document.querySelector('.menu-overlay');
            if (menuOverlay) {
                menuOverlay.style.opacity = '0';
                menuOverlay.style.visibility = 'hidden';
            }

            // Убираем блюр с контента
            const mainContent = document.querySelector('main');
            const footer = document.querySelector('footer');
            if (mainContent) mainContent.style.filter = '';
            if (footer) footer.style.filter = '';
        });
    }
    function createMenuOverlay() {
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            menuOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.48);
            backdrop-filter: blur(8px);
            z-index: 98;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        `;
            document.body.appendChild(menuOverlay);

            // Закрытие всех меню при клике на оверлей
            menuOverlay.addEventListener('click', () => {
                closeCatalogMenu();
                closeAllNavMenus();
                hideOverlay();
            });
        }
        return menuOverlay;
    }

    function showOverlay() {
        const overlay = createMenuOverlay();
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';


        // Шапка должна быть выше оверлея
        const header = document.querySelector('header');
        if (header) {
            header.style.position = 'relative';
            header.style.zIndex = '100';
        }

        // Добавляем класс для блюра на основной контент
        const mainContent = document.querySelector('main');
        const footer = document.querySelector('footer');
        if (mainContent) mainContent.style.filter = 'blur(0px)';
        if (footer) footer.style.filter = 'blur(0px)';
    }

    function hideOverlay() {
        if (menuOverlay) {
            menuOverlay.style.opacity = '0';
            menuOverlay.style.visibility = 'hidden';
        }

        // Убираем блюр с контента
        const mainContent = document.querySelector('main');
        const footer = document.querySelector('footer');
        if (mainContent) mainContent.style.filter = '';
        if (footer) footer.style.filter = '';
    }

    // Функция закрытия меню каталога
    function closeCatalogMenu() {
        if (isCatalogOpen) {
            isCatalogOpen = false;
            if (catalogBtn) catalogBtn.classList.remove('active');
            if (menuBoxContainer) menuBoxContainer.classList.remove('active');
            hideOverlay();
        }
    }

    // Функция открытия меню каталога
    function openCatalogMenu() {
        // Сначала закрываем любое открытое навигационное меню
        closeAllNavMenus();

        isCatalogOpen = true;
        if (catalogBtn) catalogBtn.classList.add('active');
        if (menuBoxContainer) menuBoxContainer.classList.add('active');

        // Показываем оверлей
        showOverlay();

        // Активируем первую категорию по умолчанию
        if (topItems && topItems.length > 0) {
            activateCategory('0');
        }
    }

    // Функция закрытия всех навигационных меню
    function closeAllNavMenus() {
        if (activeNavContainer) {
            const prevButton = activeNavContainer.querySelector('.h-nav-btn');
            activeNavContainer.classList.remove('active');
            if (prevButton) prevButton.classList.remove('active');
            activeNavContainer = null;
        }

        // Дополнительная проверка: закрываем все контейнеры на всякий случай
        const navContainers = document.querySelectorAll('.nav-btn-container.active');
        if (navContainers && navContainers.length > 0) {
            navContainers.forEach(container => {
                if (container) {
                    const button = container.querySelector('.h-nav-btn');
                    container.classList.remove('active');
                    if (button) button.classList.remove('active');
                }
            });
        }

        // Скрываем оверлей, если каталог тоже закрыт
        if (!isCatalogOpen) {
            hideOverlay();
        }
    }

    // Функция закрытия конкретного навигационного меню
    function closeNavMenu(container) {
        if (container) {
            const button = container.querySelector('.h-nav-btn');
            container.classList.remove('active');
            if (button) button.classList.remove('active');
        }

        // Скрываем оверлей, если каталог тоже закрыт
        if (!isCatalogOpen) {
            hideOverlay();
        }
    }

    // Функция открытия навигационного меню
    function openNavMenu(container, button) {
        // Сначала закрываем меню каталога если открыто
        if (isCatalogOpen) {
            closeCatalogMenu();
        }

        // Закрываем другие навигационные меню
        if (activeNavContainer && activeNavContainer !== container) {
            closeNavMenu(activeNavContainer);
        }

        // Открываем текущее
        if (container) {
            container.classList.add('active');
        }
        if (button) {
            button.classList.add('active');
        }
        activeNavContainer = container;

        // Показываем оверлей
        showOverlay();
    }

    // 1. Логика открытия/закрытия меню каталога
    if (catalogBtn) {
        catalogBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (isCatalogOpen) {
                closeCatalogMenu();
            } else {
                openCatalogMenu();
            }
        });
    }

    // Закрытие меню каталога при клике вне его области
    if (catalogBtn || menuBoxContainer) {
        document.addEventListener('click', (e) => {
            if (isCatalogOpen && menuBoxContainer && catalogBtn) {
                const isClickInsideMenu = menuBoxContainer.contains(e.target);
                const isClickOnButton = catalogBtn.contains(e.target);

                if (!isClickInsideMenu && !isClickOnButton) {
                    closeCatalogMenu();
                }
            }
        });
    }

    // 2. Логика переключения категорий при наведении
    if (topItems && topItems.length > 0) {
        topItems.forEach(item => {
            if (item) {
                item.addEventListener('mouseenter', () => {
                    if (!isCatalogOpen) return;
                    const categoryId = item.getAttribute('data-category');
                    if (categoryId !== null) {
                        activateCategory(categoryId);
                    }
                });
            }
        });
    }

    // Функция активации категории по ID
    function activateCategory(categoryId) {
        // Убираем активный класс у всех пунктов слева
        if (topItems && topItems.length > 0) {
            topItems.forEach(item => {
                if (item) {
                    item.classList.remove('active');
                    if (item.getAttribute('data-category') === categoryId) {
                        item.classList.add('active');
                    }
                }
            });
        }

        // Переключаем группы ссылок в центре
        if (categoryGroups && categoryGroups.length > 0) {
            categoryGroups.forEach(group => {
                if (group) {
                    group.classList.remove('active');
                    if (group.getAttribute('data-category') === categoryId) {
                        group.classList.add('active');
                    }
                }
            });
        }

        // Переключаем картинки справа
        if (categoryImages && categoryImages.length > 0) {
            categoryImages.forEach(img => {
                if (img) {
                    img.classList.remove('active');
                    if (img.getAttribute('data-category') === categoryId) {
                        img.classList.add('active');
                    }
                }
            });
        }
    }

    // 3. Логика навигационных меню
    if (navButtons && navButtons.length > 0) {
        navButtons.forEach(item => {
            const button = document.getElementById(item.button);
            const menu = document.getElementById(item.menu);

            if (!button || !menu) return;

            const container = button.closest('.nav-btn-container');
            if (!container) return;

            // Клик по кнопке
            button.addEventListener('click', (e) => {
                e.stopPropagation();

                // Если это меню уже открыто - закрываем его
                if (container.classList.contains('active')) {
                    closeNavMenu(container);
                    if (activeNavContainer === container) {
                        activeNavContainer = null;
                    }
                } else {
                    // Открываем меню (при открытии автоматически закроется каталог и другие нав.меню)
                    openNavMenu(container, button);
                }
            });

            // Останавливаем всплытие клика внутри меню
            if (menu) {
                menu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }

    // Закрытие навигационных меню при клике вне их области
    document.addEventListener('click', (e) => {
        // Проверяем существование элементов каталога
        const isCatalogElement = catalogBtn && menuBoxContainer &&
            (catalogBtn.contains(e.target) || menuBoxContainer.contains(e.target));

        // Проверяем, не клик ли по навигационной кнопке или меню
        let isNavElement = false;
        if (activeNavContainer) {
            isNavElement = activeNavContainer.contains(e.target);
        }

        // Проверяем, не клик ли по любой навигационной кнопке
        let isAnyNavButton = false;
        const allNavBtns = document.querySelectorAll('.h-nav-btn');
        if (allNavBtns && allNavBtns.length > 0) {
            allNavBtns.forEach(btn => {
                if (btn && btn.contains(e.target)) {
                    isAnyNavButton = true;
                }
            });
        }

        // Если клик не по каталогу и не по навигации, и есть активное нав.меню
        if (!isCatalogElement && !isNavElement && !isAnyNavButton && activeNavContainer) {
            closeNavMenu(activeNavContainer);
            activeNavContainer = null;
        }
    });
});

//поиск
document.addEventListener('DOMContentLoaded', () => {
    // Десктопный поиск
    const openSearchBtn = document.getElementById('openSearch');
    const headerNav = document.getElementById('headerNav');
    const searchForm = document.getElementById('headerSearchForm');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    const headerCenter = document.getElementById('headerCenter');
    const headerSearchBox = document.querySelector('.header-search-box');

    // Мобильный поиск
    const openSearchMobileBtn = document.getElementById('openSearchMobile');
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchClear = document.getElementById('mobileSearchClear');
    const mobileSearchBack = document.getElementById('mobileSearchBack');
    const mobileSearchResults = document.getElementById('mobileSearchResults');

    let isDesktopSearchActive = false;
    let isMobileSearchActive = false;

    // Проверка ширины экрана
    function isMobile() {
        return window.innerWidth <= 1100;
    }


    // ========== ДЕСКТОПНЫЙ ПОИСК ==========
    // Создаем оверлей
    let searchOverlay = null;

    function createSearchOverlay() {
        if (!searchOverlay) {
            searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.48);
            backdrop-filter: blur(8px);
            z-index: 99;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        `;
            document.body.appendChild(searchOverlay);

            // Закрытие по клику на оверлей
            searchOverlay.addEventListener('click', closeDesktopSearch);
        }
        return searchOverlay;
    }

    function closeDesktopSearch() {
        isDesktopSearchActive = false;
        if (headerNav) headerNav.classList.remove('hidden');
        if (searchResults) searchResults.classList.remove('active');
        if (searchForm) searchForm.classList.remove('active');
        if (openSearchBtn) openSearchBtn.style.display = '';
        if (headerCenter) headerCenter.style.width = '';
        if (headerSearchBox) headerSearchBox.classList.remove('search-active');
        if (searchInput) searchInput.value = '';

        // Скрываем оверлей
        if (searchOverlay) {
            searchOverlay.style.opacity = '0';
            searchOverlay.style.visibility = 'hidden';
        }

        // Убираем блюр с шапки
        const header = document.querySelector('header');
        if (header) {
            header.style.position = '';
            header.style.zIndex = '';
        }
    }

    function openDesktopSearch() {
        isDesktopSearchActive = true;
        if (headerNav) headerNav.classList.add('hidden');
        if (headerCenter) headerCenter.style.width = '35%';
        if (openSearchBtn) openSearchBtn.style.display = 'none';
        if (headerSearchBox) headerSearchBox.classList.add('search-active');
        if (searchForm) searchForm.classList.add('active');

        // Создаем и показываем оверлей
        const overlay = createSearchOverlay();
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';

        // Шапка должна быть выше оверлея
        const header = document.querySelector('header');
        if (header) {
            header.style.position = 'relative';
            header.style.zIndex = '100';
        }

        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 100);
    }

    // Десктопный поиск - клик по кнопке
    if (openSearchBtn) {
        openSearchBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (isDesktopSearchActive) {
                closeDesktopSearch();
            } else {
                openDesktopSearch();
            }
        });
    }

    // Десктопный поиск - очистка
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (searchInput) {
                searchInput.value = '';
                if (searchResults) searchResults.classList.remove('active');
                searchInput.focus();
            }
        });
    }

    // Десктопный поиск - ввод
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const value = searchInput.value.trim();
            if (value.length > 0) {
                if (searchResults) searchResults.classList.add('active');
            } else {
                if (searchResults) searchResults.classList.remove('active');
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = searchInput.value.trim();
                if (value) {
                    console.log('Поиск:', value);
                }
            }
        });
    }


    // ========== МОБИЛЬНЫЙ ПОИСК ==========
    function closeMobileSearch() {
        isMobileSearchActive = false;
        document.body.classList.remove('search-active-mobile');
        if (mobileSearchForm) mobileSearchForm.classList.remove('active');
        if (mobileSearchResults) mobileSearchResults.classList.remove('active');
        if (mobileSearchInput) mobileSearchInput.value = '';
    }

    function openMobileSearch() {
        isMobileSearchActive = true;
        document.body.classList.add('search-active-mobile');
        if (mobileSearchForm) mobileSearchForm.classList.add('active');

        setTimeout(() => {
            if (mobileSearchInput) mobileSearchInput.focus();
        }, 100);
    }

    // Мобильный поиск - клик по кнопке
    if (openSearchMobileBtn) {
        openSearchMobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (isMobileSearchActive) {
                closeMobileSearch();
            } else {
                openMobileSearch();
            }
        });
    }

    // Мобильный поиск - ввод
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', () => {
            const value = mobileSearchInput.value.trim();
            if (value.length > 0) {
                if (mobileSearchResults) mobileSearchResults.classList.add('active');
            } else {
                if (mobileSearchResults) mobileSearchResults.classList.remove('active');
            }
        });

        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = mobileSearchInput.value.trim();
                if (value) {
                    console.log('Мобильный поиск:', value);
                }
            }
        });
    }

    // Мобильный поиск - очистка
    if (mobileSearchClear) {
        mobileSearchClear.addEventListener('click', () => {
            if (mobileSearchInput) {
                mobileSearchInput.value = '';
                mobileSearchInput.focus();
                if (mobileSearchResults) mobileSearchResults.classList.remove('active');
            }
        });
    }

    // Мобильный поиск - назад
    if (mobileSearchBack) {
        mobileSearchBack.addEventListener('click', () => {
            closeMobileSearch();
        });
    }


    // ========== ОБЩИЕ ОБРАБОТЧИКИ ==========
    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
        // Десктопный поиск
        if (!isMobile() && isDesktopSearchActive && searchForm && openSearchBtn && searchResults) {
            const isClickInsideForm = searchForm.contains(e.target);
            const isClickInsideResults = searchResults.contains(e.target);
            const isClickOnButton = openSearchBtn.contains(e.target);

            if (!isClickInsideForm && !isClickInsideResults && !isClickOnButton) {
                closeDesktopSearch();
            }
        }

        // Мобильный поиск
        if (isMobile() && isMobileSearchActive && mobileSearchForm && openSearchMobileBtn) {
            const isClickInsideForm = mobileSearchForm.contains(e.target);
            const isClickInsideResults = mobileSearchResults ? mobileSearchResults.contains(e.target) : false;
            const isClickOnButton = openSearchMobileBtn.contains(e.target);

            if (!isClickInsideForm && !isClickInsideResults && !isClickOnButton) {
                closeMobileSearch();
            }
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!isMobile() && isDesktopSearchActive) {
                closeDesktopSearch();
            } else if (isMobile() && isMobileSearchActive) {
                closeMobileSearch();
            }
        }
    });

    // Предотвращаем закрытие при клике внутри
    if (searchForm) {
        searchForm.addEventListener('click', (e) => e.stopPropagation());
    }
    if (searchResults) {
        searchResults.addEventListener('click', (e) => e.stopPropagation());
    }
    if (mobileSearchForm) {
        mobileSearchForm.addEventListener('click', (e) => e.stopPropagation());
    }
    if (mobileSearchResults) {
        mobileSearchResults.addEventListener('click', (e) => e.stopPropagation());
    }

    // При изменении размера окна
    window.addEventListener('resize', () => {
        if (!isMobile() && isMobileSearchActive) {
            closeMobileSearch();
        }
        if (isMobile() && isDesktopSearchActive) {
            closeDesktopSearch();
        }
    });
});

// Мобильное меню
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuBack = document.getElementById('mobileMenuBack');
    const openMobileCatalog = document.getElementById('openMobileCatalog');
    const catalogBtnPhone = document.getElementById('catalogBtnPhone');

    // Элементы каталога
    const catalogContainer = document.getElementById('mobileCatalogContainer');
    const subCatalogContainer = document.getElementById('mobileSubCatalogContainer');
    const categoryItems = document.querySelectorAll('#mobileCatalogContainer .mb-top-item');
    const categoryGroups = document.querySelectorAll('#mobileSubCatalogContainer .menu-box-c-p-group');
    const subtitle = document.querySelector('.mobile-menu-subtitle');
    const navSubtitle = document.querySelector('.mobile-menu-nav-subtitle');

    let isMenuOpen = false;
    let isCatalogOpen = false;
    let isSubCatalogOpen = false;

    // Функция активации категории
    function activateCategory(categoryId) {
        // Обновляем активный класс в каталоге
        categoryItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-category') === categoryId) {
                item.classList.add('active');
            }
        });

        // Обновляем активную группу подкатегорий
        categoryGroups.forEach(group => {
            group.classList.remove('active');
            if (group.getAttribute('data-category') === categoryId) {
                group.classList.add('active');
            }
        });
    }

    // Открыть меню
    function openMenu() {
        isMenuOpen = true;
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Закрыть меню
    // Закрыть меню
    function closeMenu() {
        isMenuOpen = false;
        isCatalogOpen = false;
        isSubCatalogOpen = false;
        mobileMenu.classList.remove('active');
        mobileMenu.classList.remove('mobile-catalog-open');
        mobileMenu.classList.remove('mobile-subcatalog-open');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Сбрасываем заголовки и subtitle при закрытии
        subtitle.textContent = 'Каталог';
        navSubtitle.style.display = 'none';
    }

    // Открыть каталог
    function openCatalog() {
        isCatalogOpen = true;
        isSubCatalogOpen = false;
        mobileMenu.classList.add('mobile-catalog-open');
        mobileMenu.classList.remove('mobile-subcatalog-open');
        // Активируем первую категорию
        activateCategory('0');
    }

    // Открыть подкатегории
    function openSubCatalog(categoryName) {
        isSubCatalogOpen = true;
        mobileMenu.classList.add('mobile-subcatalog-open');

        // меняем заголовки
        subtitle.textContent = categoryName;
        navSubtitle.style.display = 'block';
    }

    // Закрыть подкатегории (вернуться в каталог)
    function closeSubCatalog() {
        isSubCatalogOpen = false;
        mobileMenu.classList.remove('mobile-subcatalog-open');

        // возвращаем как было
        subtitle.textContent = 'Каталог';
        navSubtitle.style.display = 'none';
    }

    // Закрыть каталог (вернуться в главное меню)
    function closeCatalog() {
        isCatalogOpen = false;
        isSubCatalogOpen = false;
        mobileMenu.classList.remove('mobile-catalog-open');
        mobileMenu.classList.remove('mobile-subcatalog-open');
    }

    // Обработчики для категорий (клик вместо hover на мобилке)
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            const categoryId = item.getAttribute('data-category');
            const categoryName = item.querySelector('p').textContent;

            activateCategory(categoryId);
            openSubCatalog(categoryName);
        });
    });

    // Клик по кнопке каталога в мобильном хедере
    if (catalogBtnPhone) {
        catalogBtnPhone.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Клик по кнопке "Каталог" внутри меню
    if (openMobileCatalog) {
        openMobileCatalog.addEventListener('click', () => {
            openCatalog();
        });
    }

    // Кнопка назад (возврат из подкатегорий в каталог или из каталога в меню)
    if (mobileMenuBack) {
        mobileMenuBack.addEventListener('click', () => {
            if (isSubCatalogOpen) {
                closeSubCatalog();
            } else if (isCatalogOpen) {
                closeCatalog();
            }
        });
    }

    // Кнопка закрытия
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Закрытие по оверлею
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu);
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            if (isSubCatalogOpen) {
                closeSubCatalog();
            } else if (isCatalogOpen) {
                closeCatalog();
            } else {
                closeMenu();
            }
        }

    });

}
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
});
// Запускаем инициализацию слайдера  каталога
document.addEventListener('DOMContentLoaded', function () {

    // ========== ОСНОВНОЙ СЛАЙДЕР ==========
    const buttons = document.querySelectorAll('.ch-categ');
    const slides = document.querySelectorAll('.ch-swiper .swiper-slide');
    const swiperContainer = document.querySelector('.ch-swiper');

    let swiper = null;

    // Инициализация Swiper только если контейнер существует
    if (swiperContainer) {
        swiper = new Swiper('.ch-swiper', {
            slidesPerView: 1.1,
            spaceBetween: 12,

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            navigation: {
                nextEl: '.ch-swiper .swiper-button-next',
                prevEl: '.ch-swiper .swiper-button-prev',
            },

            breakpoints: {
                320: { slidesPerView: 1.5 },
                480: { slidesPerView: 1.3 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
                1440: { slidesPerView: 5 }
            }
        });
    }

    // Фильтрация по категориям
    if (buttons && buttons.length > 0) {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn) return;

                // Активная кнопка
                buttons.forEach(b => {
                    if (b) b.classList.remove('active');
                });
                btn.classList.add('active');

                const category = btn.getAttribute('data-CatHomeCategory');
                const categoryName = btn.textContent;
                const categoryCount = btn.getAttribute('data-count'); // Если есть атрибут с количеством

                // Обновляем заголовок и количество
                updateCatalogTitleAndCount(category, categoryName, categoryCount);

                // Фильтрация слайдов
                if (slides && slides.length > 0) {
                    slides.forEach(slide => {
                        if (!slide) return;

                        const item = slide.querySelector('.ch-item');
                        if (item) {
                            const itemCat = item.getAttribute('data-CatHomeCategory');
                            slide.style.display = (itemCat === category) ? 'block' : 'none';
                        }
                    });
                }

                // Обновление Swiper
                if (swiper && typeof swiper.update === 'function') {
                    swiper.update();
                    if (typeof swiper.slideTo === 'function') {
                        swiper.slideTo(0);
                    }
                }
            });
        });
    }

    function updateCatalogTitleAndCount(category, categoryName, categoryCount = null) {
        const titleElement = document.querySelector('.catalog-title');
        const countElement = document.querySelector('.catalog-num-product');

        if (!titleElement || !countElement) return;

        // Маппинг категорий на заголовки
        const categoryTitles = {
            'asic': 'ASIC майнеры',
            'gpu': 'GPU майнеры',
            'accessories': 'Аксессуары',
            'power_supply': 'Блоки питания',
            'miners': 'Майнеры',
            'all': 'Все товары'
        };

        const displayTitle = categoryTitles[category] || categoryName || 'Товары';
        titleElement.textContent = displayTitle;

        // Если количество передано атрибутом
        if (categoryCount) {
            countElement.textContent = getProductCountText(parseInt(categoryCount));
        } else {
            // Иначе считаем видимые слайды
            const visibleSlides = Array.from(document.querySelectorAll('.home-catalog-swiper-slide')).filter(slide => {
                return slide.style.display !== 'none';
            });
            countElement.textContent = getProductCountText(visibleSlides.length);
        }
    }

    function getProductCountText(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return `${count} товаров`;
        if (lastDigit === 1) return `${count} товар`;
        if (lastDigit >= 2 && lastDigit <= 4) return `${count} товара`;
        return `${count} товаров`;
    }

    // ========== СЛАЙДЕР В КАРТОЧКАХ ==========
    const itemSwiperElements = document.querySelectorAll('.ch-item-swiper');

    if (itemSwiperElements && itemSwiperElements.length > 0) {
        itemSwiperElements.forEach(swiperEl => {
            if (swiperEl) {
                const paginationEl = swiperEl.querySelector('.swiper-pagination');

                new Swiper(swiperEl, {
                    slidesPerView: 1,
                    spaceBetween: 0,

                    pagination: {
                        el: paginationEl,
                        clickable: true,
                    },
                });
            }
        });
    }


    // ========== СЛАЙДЕР КЕЙСОВ (CASE) ==========
    const caseSwiperContainer = document.querySelector('.case-swiper');
    let caseSwiper = null;

    if (caseSwiperContainer) {
        caseSwiper = new Swiper('.case-swiper', {
            slidesPerView: 1.1,
            spaceBetween: 16,

            pagination: {
                el: '.case-pagination .swiper-pagination',
                clickable: true,

            },

            navigation: {
                nextEl: '.case-pagination .swiper-button-next',
                prevEl: '.case-pagination .swiper-button-prev',
            },

            breakpoints: {
                320: {
                    slidesPerView: 1.1,
                    spaceBetween: 16,
                },

                740: {
                    slidesPerView: 1.9,
                    spaceBetween: 16,
                },

                1024: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                1280: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                }
            },


        });
    }

    // Дополнительная проверка для слайдера при изменении размера окна
    window.addEventListener('resize', function () {
        if (swiper && typeof swiper.update === 'function') {
            setTimeout(() => {
                swiper.update();
            }, 200);
        }
    });
});

//добавление контейнера в блоке расходов
document.addEventListener('DOMContentLoaded', function () {
    const expensesDown = document.querySelector('.expenses-down');

    function checkWidthAndAddClass() {
        if (!expensesDown) return;

        const windowWidth = window.innerWidth;

        if (windowWidth < 1100) {
            expensesDown.classList.add('container');
        } else {
            expensesDown.classList.remove('container');
        }
    }

    // Проверяем при загрузке
    checkWidthAndAddClass();

    // Проверяем при изменении размера окна
    window.addEventListener('resize', function () {
        checkWidthAndAddClass();
    });
});

//раскрытие открытие расчета
document.addEventListener('DOMContentLoaded', function () {
    const raschetBtn = document.getElementById('raschetBtn');
    const calcDownR = document.getElementById('calcDownR');

    let isOpen = false;

    // Сохраняем оригинальный текст
    const openText = 'Получить подробный расчет';
    const closeText = 'Закрыть подробный расчет';

    if (raschetBtn) {
        raschetBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            isOpen = !isOpen;

            if (raschetBtn && calcDownR) {
                // Меняем текст кнопки
                raschetBtn.textContent = isOpen ? closeText : openText;

                // Переключаем классы
                raschetBtn.classList.toggle('active', isOpen);
                calcDownR.classList.toggle('active', isOpen);
            }
        });
    }


    // Закрытие при клике вне блока
    document.addEventListener('click', function (e) {
        if (raschetBtn && calcDownR && isOpen) {
            if (!raschetBtn.contains(e.target) && !calcDownR.contains(e.target)) {
                isOpen = false;
                raschetBtn.textContent = openText;
                raschetBtn.classList.remove('active');
                calcDownR.classList.remove('active');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.calc-up-right');

    let startX;
    let scrollLeft;
    if (slider) {
        // touch
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX;
            const walk = (x - startX);
            slider.scrollLeft = scrollLeft - walk;
        });
    }

});

//форматирование
document.querySelectorAll('.price-input').forEach(input => {
    input.addEventListener('input', (e) => {
        const type = input.dataset.type;
        let value = input.value;

        if (type === 'number') {
            // убираем всё кроме цифр
            value = value.replace(/\D/g, '');

            // форматируем с пробелами
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        } else if (type === 'decimal') {
            // разрешаем цифры и запятую
            value = value.replace(/[^0-9,]/g, '');

            // только одна запятая
            const parts = value.split(',');
            if (parts.length > 2) {
                value = parts[0] + ',' + parts.slice(1).join('');
            }

            // форматируем целую часть с пробелами
            let [int, dec] = value.split(',');
            int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

            value = dec !== undefined ? int + ',' + dec : int;
        }

        input.value = value;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let swiper = null;

    function initSwiper() {
        if (window.innerWidth <= 910 && !swiper) {
            swiper = new Swiper('.variants-cards', {
                slidesPerView: 'auto',
                spaceBetween: 16,
            });
        } else if (window.innerWidth > 910 && swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
    }

    initSwiper();
    window.addEventListener('resize', initSwiper);
});

//подвал
// Мобильная навигация футера - версия без клонирования
function initMobileFooterNav() {
    const isMobile = window.innerWidth <= 1120;
    const footerRightContainer = document.querySelector('.footer-right-container');
    const footerListContainer = document.querySelector('.footer-list-container');
    const mobileNavContainer = document.querySelector('.footer-mobile-nav');

    if (isMobile) {
        // Если навигации в правой колонке нет - переносим
        if (!mobileNavContainer && footerListContainer && footerRightContainer) {
            // Создаем контейнер для мобильной навигации
            const mobileNav = document.createElement('div');
            mobileNav.className = 'footer-mobile-nav';

            // Переносим содержимое (не клонируем, а перемещаем)
            while (footerListContainer.firstChild) {
                mobileNav.appendChild(footerListContainer.firstChild);
            }

            // Добавляем классы
            mobileNav.querySelector('.footer-main-nav')?.classList.add('mobile-nav');

            // Вставляем в правую колонку
            const targetElement = footerRightContainer.querySelector('.footer-btn-container');
            if (targetElement) {
                footerRightContainer.insertBefore(mobileNav, targetElement);
            } else {
                footerRightContainer.appendChild(mobileNav);
            }

            // Скрываем оригинальный контейнер
            footerListContainer.style.display = 'none';
        }
    } else {
        // На десктопе возвращаем навигацию обратно
        const mobileNav = document.querySelector('.footer-mobile-nav');
        const footerMainContent = document.querySelector('.footer-main-content');
        const originalListContainer = document.querySelector('.footer-list-container');

        if (mobileNav && originalListContainer && footerMainContent) {
            // Возвращаем элементы обратно
            const mainNav = mobileNav.querySelector('.footer-main-nav');
            if (mainNav) {
                while (mainNav.firstChild) {
                    originalListContainer.appendChild(mainNav.firstChild);
                }
            }
            mobileNav.remove();
            originalListContainer.style.display = 'grid';
        }
    }

    // Обновляем обработчики
    attachAccordionHandlers();
}

// Обработчик аккордеона
function attachAccordionHandlers() {
    const isMobile = window.innerWidth <= 1120;
    const selector = isMobile ? '.footer-mobile-nav .footer-list-title-container' : '.footer-list-container .footer-list-title-container';
    const listTitles = document.querySelectorAll(selector);

    listTitles.forEach(title => {
        // Удаляем старый обработчик
        const newTitle = title.cloneNode(true);
        if (title.parentNode) {
            title.parentNode.replaceChild(newTitle, title);
        }

        newTitle.addEventListener('click', function (e) {
            e.stopPropagation();
            const listMain = this.closest('.footer-list-main');
            if (listMain) {
                listMain.classList.toggle('active');
            }
        });
    });
}

// Запуск
document.addEventListener('DOMContentLoaded', function () {
    initMobileFooterNav();
});

let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        initMobileFooterNav();
    }, 300);
});

//валдиация формы
document.addEventListener("DOMContentLoaded", () => {

    // ===== ФОРМАТ ТЕЛЕФОНА =====
    function formatPhone(phoneInput) {
        if (!phoneInput) return;

        let value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
        let formatted = "";

        if (value.length > 0) formatted += "(" + value.substring(0, 3);
        if (value.length >= 4) formatted += ") " + value.substring(3, 6);
        if (value.length >= 7) formatted += "-" + value.substring(6, 8);
        if (value.length >= 9) formatted += "-" + value.substring(8, 10);

        phoneInput.value = formatted;
    }

    // ===== EMAIL =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== ОШИБКИ =====
    function showError(input, message) {
        const container = input.closest(".input-container");

        if (container) {
            const error = container.querySelector(".input-error");
            if (error) error.textContent = message;
            container.classList.add("error");
        }

        const wrapper = input.closest(".input-wrapper");
        if (wrapper) wrapper.style.backgroundColor = "rgba(239,68,68,.16)";
    }

    function clearError(input) {
        const container = input.closest(".input-container");

        if (container) {
            const error = container.querySelector(".input-error");
            if (error) error.textContent = "";
            container.classList.remove("error");
        }

        const wrapper = input.closest(".input-wrapper");
        if (wrapper) wrapper.style.backgroundColor = "rgba(107,114,128,.12)";
    }

    // ===== CHECKBOX =====
    function validateCheckbox(checkbox) {
        if (!checkbox) return true;

        const container = checkbox.closest(".input-container");

        if (!checkbox.checked) {
            if (container) {
                container.classList.add("error");
                const error = container.querySelector(".input-error");
                if (error) error.textContent = "Поставьте галочку";
            }
            return false;
        }

        if (container) {
            container.classList.remove("error");
            const error = container.querySelector(".input-error");
            if (error) error.textContent = "";
        }

        return true;
    }

    // ===== ВАЛИДАЦИЯ =====
    function validateForm(form) {

        const nameInput = form.querySelector('input[name="firstName"]');
        const phoneInput = form.querySelector('input[name="tel"]');
        const emailInput = form.querySelector('input[name="email"]');
        const checkbox = form.querySelector(".checkbox");

        let valid = true;

        if (nameInput) {
            if (!nameInput.value.trim()) {
                showError(nameInput, "Введите имя");
                valid = false;
            } else {
                clearError(nameInput);
            }
        }

        if (phoneInput) {
            if (phoneInput.value.replace(/\D/g, "").length < 10) {
                showError(phoneInput, "Введите корректный телефон");
                valid = false;
            } else {
                clearError(phoneInput);
            }
        }

        if (emailInput && emailInput.value.trim()) {
            if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, "Введите корректный email");
                valid = false;
            } else {
                clearError(emailInput);
            }
        } else if (emailInput) {
            clearError(emailInput);
        }

        if (checkbox) {
            if (!validateCheckbox(checkbox)) valid = false;
        }

        return valid;
    }

    // ===== ОДНА ФОРМА =====
    function initForm(form) {
        if (!form) return;

        const modalContent = form.closest(".modal-content");
        const successBlock = modalContent?.querySelector(".feedback-success-container");
        const modalTitle = modalContent?.querySelector(".modal-title");

        const phoneInput = form.querySelector('input[name="tel"]');
        const checkbox = form.querySelector(".checkbox");

        if (phoneInput) {
            phoneInput.addEventListener("input", () => formatPhone(phoneInput));
        }

        if (checkbox) {
            checkbox.addEventListener("change", () => validateCheckbox(checkbox));
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!validateForm(form)) return;

            form.style.display = "none";

            if (modalTitle) modalTitle.style.display = "none";
            if (successBlock) successBlock.style.display = "flex";
        });
    }

    // ===== ВСЕ ФОРМЫ НА САЙТЕ =====
    document.querySelectorAll("form.footer-feedback").forEach(form => {
        initForm(form);
    });

});
/* модалки */
document.addEventListener('DOMContentLoaded', function () {
    // Все кнопки открытия модальных окон
    const openButtons = document.querySelectorAll('[data-modal]');

    // Функция открытия модального окна
    function openModal(modalName) {
        const modalOverlay = document.querySelector(`[data-modal-overlay="${modalName}"]`);
        if (!modalOverlay) return;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Функция закрытия модального окна
    function closeModal(modalName) {
        const modalOverlay = document.querySelector(`[data-modal-overlay="${modalName}"]`);
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Обработчики для всех кнопок открытия
    openButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const modalName = this.getAttribute('data-modal');
            openModal(modalName);
        });
    });

    // Обработчики для всех кнопок закрытия
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const modalName = this.getAttribute('data-modal-close');
            closeModal(modalName);
        });
    });

    // Закрытие по клику на оверлей
    const overlays = document.querySelectorAll('[data-modal-overlay]');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                const modalName = this.getAttribute('data-modal-overlay');
                closeModal(modalName);
            }
        });
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                const modalName = activeModal.getAttribute('data-modal-overlay');
                closeModal(modalName);
            }
        }
    });
});
// Инициализация кастомных селектов
function initCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select-container');

    customSelects.forEach(container => {
        const trigger = container.querySelector('.custom-select-trigger');
        const options = container.querySelectorAll('.custom-select-option');
        const valueSpan = container.querySelector('.custom-select-value');
        const label = container.querySelector('.custom-select-label');

        // Открытие/закрытие селекта
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Закрываем все другие селекты
            document.querySelectorAll('.custom-select-trigger.active').forEach(activeTrigger => {
                if (activeTrigger !== trigger) {
                    activeTrigger.classList.remove('active');
                }
            });
            trigger.classList.toggle('active');
        });

        // Выбор опции
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                // Обновляем значение
                valueSpan.textContent = text;

                // Добавляем класс has-value для поднятого лейбла
                trigger.classList.add('has-value');

                // Убираем активный класс у всех опций
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // Закрываем селект
                trigger.classList.remove('active');

                // Убираем ошибку если была
                container.classList.remove('error');

                // Триггерим событие change для валидации
                const changeEvent = new Event('change', { bubbles: true });
                trigger.dispatchEvent(changeEvent);
            });
        });

        // Закрытие при клике вне
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                trigger.classList.remove('active');
            }
        });

        // Для валидации - получение выбранного значения
        trigger.getSelectedValue = function () {
            const activeOption = container.querySelector('.custom-select-option.active');
            return activeOption ? activeOption.getAttribute('data-value') : null;
        };

        trigger.getSelectedText = function () {
            return valueSpan.textContent;
        };

        // Сброс селекта
        trigger.reset = function () {
            valueSpan.textContent = 'Бронза';
            options.forEach(opt => {
                if (opt.getAttribute('data-value') === 'bronza') {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
            trigger.classList.remove('has-value');
        };
    });
}

//ползунки
document.addEventListener("DOMContentLoaded", () => {

    // ===== 🔽 АККОРДЕОН =====
    const headers = document.querySelectorAll(".cat-page-filter-header-desktop");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.closest(".cat-page-filter-item");
            const content = item.querySelector(".cat-page-filter-content");
            const arrow = header.querySelector("img");

            if (!content) return;

            content.classList.toggle("active");

            if (arrow) {
                arrow.style.transform = content.classList.contains("active")
                    ? "rotate(180deg)"
                    : "rotate(0deg)";
            }
        });
    });

    // ===== 🎚 ВСЕ RANGE СЛАЙДЕРЫ =====
    const sliders = document.querySelectorAll(".range-slider-container");

    sliders.forEach(slider => {

        const minRange = slider.querySelectorAll("input[type='range']")[0];
        const maxRange = slider.querySelectorAll("input[type='range']")[1];
        const track = slider.querySelector(".range-track");

        const outputs = slider.closest(".cat-page-filter-content")
            ?.querySelectorAll(".c-p-filter-num");

        const minOutput = outputs?.[0];
        const maxOutput = outputs?.[1];

        // 🔒 проверка
        if (!minRange || !maxRange || !track || !minOutput || !maxOutput) {
            console.warn("Один из элементов слайдера не найден");
            return;
        }

        function format(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }

        function update() {
            let min = parseInt(minRange.value) || 0;
            let max = parseInt(maxRange.value) || 0;

            // защита от пересечения
            if (min > max - 1) {
                minRange.value = max - 1;
                min = max - 1;
            }

            if (max < min + 1) {
                maxRange.value = min + 1;
                max = min + 1;
            }

            // числа
            minOutput.textContent = format(min);
            maxOutput.textContent = format(max);

            const minPercent = (min / minRange.max) * 100;
            const maxPercent = (max / maxRange.max) * 100;

            track.style.background = `
                linear-gradient(to right,
                    #ddd ${minPercent}%,
                    #7086FC ${minPercent}%,
                    #7086FC ${maxPercent}%,
                    #ddd ${maxPercent}%
                )
            `;
        }

        minRange.addEventListener("input", update);
        maxRange.addEventListener("input", update);

        update();
    });

});

document.querySelectorAll('.custom-select-container').forEach(container => {
    const trigger = container.querySelector('.custom-select-trigger');
    const options = container.querySelectorAll('.custom-select-option');
    const value = container.querySelector('.custom-select-value');

    trigger.addEventListener('click', () => {
        trigger.classList.toggle('active');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {

            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            value.textContent = option.querySelector('span').textContent;

            trigger.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            trigger.classList.remove('active');
        }
    });
});

//свернуть в каталоге описание
document.addEventListener('DOMContentLoaded', function () {
    const bottomBtn = document.querySelector('.cp-bottom-btn');
    const bottomInfo = document.querySelector('.catalog-page-bottom-info');
    const btnText = document.querySelector('.cp-bottom-btn-p');
    const btnArrow = document.querySelector('.cp-bottom-btn img');

    if (bottomBtn && bottomInfo) {
        // Сохраняем полную высоту контента
        const fullHeight = bottomInfo.scrollHeight + 'px';

        // Устанавливаем начальное состояние (свернуто)
        bottomInfo.style.maxHeight = '85px';
        bottomInfo.classList.add('collapsed');

        bottomBtn.addEventListener('click', function () {
            if (bottomInfo.classList.contains('collapsed')) {
                // Разворачиваем
                bottomInfo.style.maxHeight = bottomInfo.scrollHeight + 'px';
                bottomInfo.classList.remove('collapsed');
                btnText.textContent = 'Свернуть';
                btnArrow.classList.add('rotated');
            } else {
                // Сворачиваем
                bottomInfo.style.maxHeight = '100px';
                bottomInfo.classList.add('collapsed');
                btnText.textContent = 'Развернуть';
                btnArrow.classList.remove('rotated');
            }
        });

        // Обновляем max-height при ресайзе окна
        window.addEventListener('resize', function () {
            if (!bottomInfo.classList.contains('collapsed')) {
                bottomInfo.style.maxHeight = bottomInfo.scrollHeight + 'px';
            }
        });
    }
});

//динамическое определение высоты шапки

function observeHeaderHeight() {
    const header = document.querySelector('.mob-menu-header-box');
    if (!header) return;

    const observer = new ResizeObserver(() => {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty(
            '--mobile-menu-header-height',
            height + 'px'
        );
    });

    observer.observe(header);
}
document.addEventListener('DOMContentLoaded', function () {
    observeHeaderHeight();
});

//основное моб меню
function initMobileMenuFilter() {
    const mobileMenu = document.getElementById('mobileMenuFilter');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlayFilter');
    const mobileMenuClose = document.getElementById('mobileMenuCloseFilter');
    const mobileMenuBack = document.getElementById('mobileMenuBackFilter');
    const openMobileFilters = document.getElementById('openMobileFilters');
    const mobileMenuSbros = document.getElementById('mobileMenuSbros');
    const mobileMenuTitleFilter = document.querySelector('.mobile-menu-title-filter');

    // Контейнеры для фильтров с чекбоксами
    const mainFilterContainer = document.querySelector('.filter-box-phone');
    const algoritmContainer = document.getElementById('mobileAlgoritmContainer');
    const moneyContainer = document.getElementById('mobileMoneyContainer');
    const brandContainer = document.getElementById('mobileBrandContainer');

    // Элементы шапки
    const subtitle = document.querySelector('#mobileMenuFilter .mobile-menu-subtitle');
    const menuTitle = document.querySelector('#mobileMenuFilter .mobile-menu-title');

    // Все пункты фильтров, которые имеют чекбоксы
    const filterItems = document.querySelectorAll('.filter-box-phone .cat-page-filter-item');

    let isMenuOpen = false;
    let isFilterOpen = false;
    let currentFilterContainer = null;
    let currentFilterTitle = '';
    let selectAllButton = null;
    let currentFilterType = '';

    // Сохраненные фильтры
    let savedMobileFilters = []; let appliedMobileFilters = [];

    // Временные фильтры для подменю
    let tempSubMenuFilters = [];

    // Флаг для отслеживания, было ли меню открыто через крестик (сброс)
    let shouldResetOnClose = false;

    // 🔥 ГЕТТЕР для доступа к применённым фильтрам из других функций
    window.getAppliedMobileFilters = () => appliedMobileFilters;

    function updateMobileButtonsState() {
        const filterBtn = document.getElementById('openMobileFilters');
        const hasFilters = appliedMobileFilters && appliedMobileFilters.length > 0;
        if (filterBtn) {
            filterBtn.classList.toggle('active', hasFilters);
        }
    }

    function limitMobileCheckboxes() {
        const containers = document.querySelectorAll('.checkbox-limit');
        containers.forEach(container => {
            const items = container.querySelectorAll('.cat-page-filter-checkbox-box');
            items.forEach((item, index) => {
                if (index >= 5) { item.style.display = 'none'; } else { item.style.display = ''; }
            });
        });
    }

    function getMainDisplayText(filterType, value) {
        switch (filterType) {
            case 'algorithm': return `Алгоритм: ${value}`;
            case 'coin': return `Монета: ${value}`;
            case 'brand': return `Бренд: ${value}`;
            case 'condition': return `Состояние: ${value}`;
            case 'special': return value;
            case 'toggle': return value;
            default: return value;
        }
    }

    function getSubDisplayText(filterType, value) { return value; }

    function syncMainTogglesWithSavedFilters() {
        const toggles = document.querySelectorAll('.filter-box-phone .toggle-filter');
        toggles.forEach(toggle => {
            const filterName = toggle.dataset.filterName;
            const isActive = savedMobileFilters.some(f => f.type === 'toggle' && f.value === filterName);
            if (toggle.checked !== isActive) { toggle.checked = isActive; }
        });
        syncSubTogglesWithSavedFilters();
    }

    function syncSubTogglesWithSavedFilters() {
        const subPrib = document.querySelector('#mobileMenuFilterPrib .toggle-filter');
        const subMosn = document.querySelector('#mobileMenuFilterMosn .toggle-filter');
        const subBets = document.querySelector('#mobileMenuFilterBets .toggle-filter');
        const subSkidka = document.querySelector('#mobileMenuFilterSkidka .toggle-filter');
        if (subPrib) { const isActive = savedMobileFilters.some(f => f.type === 'toggle' && f.value === 'Самый прибыльный'); if (subPrib.checked !== isActive) subPrib.checked = isActive; }
        if (subMosn) { const isActive = savedMobileFilters.some(f => f.type === 'toggle' && f.value === 'Самый мощный'); if (subMosn.checked !== isActive) subMosn.checked = isActive; }
        if (subBets) { const isActive = savedMobileFilters.some(f => f.type === 'toggle' && f.value === 'Бестселлер'); if (subBets.checked !== isActive) subBets.checked = isActive; }
        if (subSkidka) { const isActive = savedMobileFilters.some(f => f.type === 'toggle' && f.value === 'Скидка'); if (subSkidka.checked !== isActive) subSkidka.checked = isActive; }
    }

    function updateMobileActiveFiltersDisplay() {
        const mainActiveContainer = document.querySelector('.filter-box-phone .cat-filter-box-active');
        if (mainActiveContainer) {
            mainActiveContainer.innerHTML = '';
            savedMobileFilters.forEach(filter => {
                const filterElement = document.createElement('div');
                filterElement.className = 'catalog-page-cat-content-filter-active remove-filter-mobile';
                filterElement.setAttribute('data-filter-id', filter.id);
                filterElement.innerHTML = `<p class="cp-filter-active">${filter.displayText}</p><img src="assets/images/catalog/catalog-page/star.svg" alt="remove">`;
                mainActiveContainer.appendChild(filterElement);
            });
            if (savedMobileFilters.length >= 2) {
                const resetButton = document.createElement('div');
                resetButton.className = 'catalog-page-cat-content-filter-active filter-noactive';
                resetButton.id = 'resetAllFiltersMobile';
                resetButton.innerHTML = `<p class="cp-filter-active">Сбросить всё</p><img src="assets/images/catalog/catalog-page/sbros.svg" alt="reset">`;
                mainActiveContainer.appendChild(resetButton);
                document.getElementById('resetAllFiltersMobile')?.addEventListener('click', resetAllFiltersTopMenu);
            }
            mainActiveContainer.querySelectorAll('.remove-filter-mobile').forEach(btn => {
                btn.removeEventListener('click', handleRemoveClick);
                btn.addEventListener('click', handleRemoveClick);
            });
        }
        if (currentFilterContainer) {
            const subActiveContainer = currentFilterContainer.querySelector('.cat-filter-box-active');
            if (subActiveContainer) {
                subActiveContainer.innerHTML = '';
                tempSubMenuFilters.forEach(filter => {
                    const filterElement = document.createElement('div');
                    filterElement.className = 'catalog-page-cat-content-filter-active remove-filter-submobile';
                    filterElement.setAttribute('data-filter-id', filter.id);
                    filterElement.innerHTML = `<p class="cp-filter-active">${filter.displayText}</p><img src="assets/images/catalog/catalog-page/star.svg" alt="remove">`;
                    subActiveContainer.appendChild(filterElement);
                });

                // Кнопка «Сбросить всё» появляется при 2+ выбранных чекбоксах
                if (tempSubMenuFilters.length >= 2) {
                    const resetSubButton = document.createElement('div');
                    resetSubButton.className = 'catalog-page-cat-content-filter-active filter-noactive';
                    resetSubButton.id = 'resetAllFiltersSubMobile';
                    resetSubButton.innerHTML = `<p class="cp-filter-active">Сбросить всё</p><img src="assets/images/catalog/catalog-page/sbros.svg" alt="reset">`;
                    subActiveContainer.appendChild(resetSubButton);

                    resetSubButton.addEventListener('click', () => {
                        deselectAllCheckboxesInCurrentFilter();
                        updateMobileActiveFiltersDisplay();
                    });
                }

                subActiveContainer.querySelectorAll('.remove-filter-submobile').forEach(btn => {
                    btn.removeEventListener('click', handleSubRemoveClick);
                    btn.addEventListener('click', handleSubRemoveClick);
                });
            }
        }
        syncMainMenuCheckboxes();
        syncMainTogglesWithSavedFilters();
    }

    function handleRemoveClick(e) { e.stopPropagation(); removeFilterById(e.currentTarget.getAttribute('data-filter-id')); }
    function handleSubRemoveClick(e) { e.stopPropagation(); removeTempFilterById(e.currentTarget.getAttribute('data-filter-id')); }

    function removeFilterById(filterId) {
        const filterToRemove = savedMobileFilters.find(f => f.id == filterId);
        if (filterToRemove) {
            uncheckMainMenuFilter(filterToRemove);
            savedMobileFilters = savedMobileFilters.filter(f => f.id != filterId);
            if (isFilterOpen && currentFilterType === filterToRemove.type) {
                tempSubMenuFilters = tempSubMenuFilters.filter(f => f.id != filterId);
                syncSubMenuCheckboxes();
            }
            updateMobileActiveFiltersDisplay();
            updateMobileButtonsState();
        }
    }

    function removeTempFilterById(filterId) {
        const filterToRemove = tempSubMenuFilters.find(f => f.id == filterId);
        if (filterToRemove) {
            uncheckSubMenuFilter(filterToRemove);
            tempSubMenuFilters = tempSubMenuFilters.filter(f => f.id != filterId);
            updateMobileActiveFiltersDisplay();
        }
    }

    function uncheckMainMenuFilter(filter) {
        let selector = '';
        if (filter.type === 'algorithm') selector = `.filter-box-phone .alg-checkbox-mobile[data-filter-name="${filter.value}"]`;
        else if (filter.type === 'coin') selector = `.filter-box-phone .coin-checkbox-mobile[data-filter-name="${filter.value}"]`;
        else if (filter.type === 'brand') selector = `.filter-box-phone .brand-checkbox-mobile[data-filter-name="${filter.value}"]`;
        else if (filter.type === 'special') selector = `.special-checkbox-mobile[data-filter-name="${filter.value}"]`;
        else if (filter.type === 'condition') selector = `.condition-checkbox-mobile[data-filter-name="${filter.value}"]`;
        else if (filter.type === 'toggle') selector = `.toggle-filter[data-filter-name="${filter.value}"]`;
        const checkbox = document.querySelector(selector);
        if (checkbox) checkbox.checked = false;
    }

    function uncheckSubMenuFilter(filter) {
        if (currentFilterContainer && filter.type === currentFilterType) {
            let selector = '';
            if (currentFilterType === 'algorithm') selector = `.alg-checkbox-mobile[data-filter-name="${filter.value}"]`;
            else if (currentFilterType === 'coin') selector = `.coin-checkbox-mobile[data-filter-name="${filter.value}"]`;
            else if (currentFilterType === 'brand') selector = `.brand-checkbox-mobile[data-filter-name="${filter.value}"]`;
            const checkbox = currentFilterContainer.querySelector(selector);
            if (checkbox) checkbox.checked = false;
        }
    }

    function syncMainMenuCheckboxes() {
        const allCheckboxes = document.querySelectorAll('.filter-box-phone .alg-checkbox-mobile, .filter-box-phone .coin-checkbox-mobile, .filter-box-phone .brand-checkbox-mobile, .special-checkbox-mobile, .condition-checkbox-mobile, .toggle-filter');
        allCheckboxes.forEach(cb => { cb.checked = false; });
        savedMobileFilters.forEach(filter => {
            let selector = null;
            switch (filter.type) {
                case 'algorithm': selector = `.filter-box-phone .alg-checkbox-mobile[data-filter-name="${filter.value}"]`; break;
                case 'coin': selector = `.filter-box-phone .coin-checkbox-mobile[data-filter-name="${filter.value}"]`; break;
                case 'brand': selector = `.filter-box-phone .brand-checkbox-mobile[data-filter-name="${filter.value}"]`; break;
                case 'special': selector = `.special-checkbox-mobile[data-filter-name="${filter.value}"]`; break;
                case 'condition': selector = `.condition-checkbox-mobile[data-filter-name="${filter.value}"]`; break;
                case 'toggle': selector = `.toggle-filter[data-filter-name="${filter.value}"]`; break;
                default: return;
            }
            if (selector) { const el = document.querySelector(selector); if (el) el.checked = true; }
        });
    }

    function syncSubMenuCheckboxes() {
        if (!currentFilterContainer) return;
        let checkboxClass = '';
        if (currentFilterType === 'algorithm') checkboxClass = 'alg-checkbox-mobile';
        else if (currentFilterType === 'coin') checkboxClass = 'coin-checkbox-mobile';
        else if (currentFilterType === 'brand') checkboxClass = 'brand-checkbox-mobile';
        const checkboxes = currentFilterContainer.querySelectorAll(`.${checkboxClass}`);
        checkboxes.forEach(cb => { cb.checked = false; });
        tempSubMenuFilters.forEach(filter => {
            const checkbox = currentFilterContainer.querySelector(`.${checkboxClass}[data-filter-name="${filter.value}"]`);
            if (checkbox) checkbox.checked = true;
        });
        updateSelectAllButtonText();
    }

    function saveSubMenuChanges() {
        savedMobileFilters = savedMobileFilters.filter(f => f.type !== currentFilterType);
        tempSubMenuFilters.forEach(filter => {
            savedMobileFilters.push({ ...filter, displayText: getMainDisplayText(filter.type, filter.value) });
        });
        updateMobileActiveFiltersDisplay();
        updateMobileButtonsState();
    }

    function revertSubMenuChanges() {
        tempSubMenuFilters = [];
        const savedForType = savedMobileFilters.filter(f => f.type === currentFilterType);
        savedForType.forEach(filter => { tempSubMenuFilters.push({ ...filter, displayText: filter.value }); });
        syncSubMenuCheckboxes();
        updateMobileActiveFiltersDisplay();
    }

    function toggleTempFilter(filterType, filterValue, isChecked) {
        if (isChecked) {
            const exists = tempSubMenuFilters.some(f => f.type === filterType && f.value === filterValue);
            if (!exists) { tempSubMenuFilters.push({ id: Date.now() + Math.random(), type: filterType, value: filterValue, displayText: getSubDisplayText(filterType, filterValue) }); }
        } else { tempSubMenuFilters = tempSubMenuFilters.filter(f => !(f.type === filterType && f.value === filterValue)); }
        updateMobileActiveFiltersDisplay();
    }

    function toggleMainFilter(filterType, filterValue, isChecked) {
        if (isChecked) {
            const exists = savedMobileFilters.some(f => f.type === filterType && f.value === filterValue);
            if (!exists) {
                const newFilter = { id: Date.now() + Math.random(), type: filterType, value: filterValue, displayText: getMainDisplayText(filterType, filterValue) };
                savedMobileFilters.push(newFilter);
                if (isFilterOpen && currentFilterType === filterType) {
                    const tempExists = tempSubMenuFilters.some(f => f.type === filterType && f.value === filterValue);
                    if (!tempExists) { tempSubMenuFilters.push({ ...newFilter, displayText: getSubDisplayText(filterType, filterValue) }); syncSubMenuCheckboxes(); }
                }
            }
        } else {
            savedMobileFilters = savedMobileFilters.filter(f => !(f.type === filterType && f.value === filterValue));
            if (isFilterOpen && currentFilterType === filterType) { tempSubMenuFilters = tempSubMenuFilters.filter(f => !(f.type === filterType && f.value === filterValue)); syncSubMenuCheckboxes(); }
        }
        updateMobileActiveFiltersDisplay();
        updateMobileButtonsState();
    }
    function applyFiltersToSystem() {
        // Фиксируем применённые фильтры из черновика
        appliedMobileFilters = savedMobileFilters.map(f => ({ ...f }));

        if (typeof activeFilters !== 'undefined') {
            activeFilters.length = 0;
            appliedMobileFilters.forEach(filter => { activeFilters.push({ ...filter }); });
            syncDesktopCheckboxesWithFilters();
            if (typeof updateActiveFiltersDisplay === 'function') { updateActiveFiltersDisplay(); }
        }
        // Оповещаем об изменении применённых фильтров
        document.dispatchEvent(new CustomEvent('mobileFiltersApplied'));
    }
    window.applyMobileFilters = function () {
        applyFiltersToSystem();
        updateMobileButtonsState();
        filtersSnapshot = savedMobileFilters.map(f => ({ ...f }));
        if (typeof window.updateMobileFilterButtons === 'function') {
            window.updateMobileFilterButtons();
        }
    };

    function resetAllFilters() {
        savedMobileFilters = [];
        appliedMobileFilters = []; // сбрасываем и применённые
        tempSubMenuFilters = [];
        document.querySelectorAll('.alg-checkbox-mobile, .coin-checkbox-mobile, .brand-checkbox-mobile, .special-checkbox-mobile, .condition-checkbox-mobile, .toggle-filter').forEach(cb => { cb.checked = false; });
        if (isFilterOpen && currentFilterContainer) { syncSubMenuCheckboxes(); }
        resetAllRangeSliders(); resetAllSwitches();
        updateMobileActiveFiltersDisplay(); updateMobileButtonsState();
        if (typeof window.updateMobileFilterButtons === 'function') {
            window.updateMobileFilterButtons();
        }
    }
    function resetAllFiltersTopMenu() {
        savedMobileFilters = [];
        tempSubMenuFilters = [];
        document.querySelectorAll('.alg-checkbox-mobile, .coin-checkbox-mobile, .brand-checkbox-mobile, .special-checkbox-mobile, .condition-checkbox-mobile, .toggle-filter').forEach(cb => { cb.checked = false; });
        if (isFilterOpen && currentFilterContainer) { syncSubMenuCheckboxes(); }
        resetAllRangeSliders(); resetAllSwitches();
        updateMobileActiveFiltersDisplay(); updateMobileButtonsState();

    }

    function resetAllRangeSliders() {
        const rangeContainers = document.querySelectorAll('#mobileMenuFilter .range-slider-container');
        rangeContainers.forEach(container => {
            const inputs = container.querySelectorAll('input[type="range"]');
            const minInput = inputs[0]; const maxInput = inputs[1];
            if (minInput && maxInput) {
                const minVal = parseFloat(minInput.min); const maxVal = parseFloat(maxInput.max);
                minInput.value = minVal; maxInput.value = maxVal;
                const polzHeader = container.closest('.cat-page-filter-content-mobile')?.querySelector('.cat-page-filter-polz-header');
                if (polzHeader) {
                    const minDisplay = polzHeader.querySelector('.c-p-filter:first-child .c-p-filter-num');
                    const maxDisplay = polzHeader.querySelector('.c-p-filter:last-child .c-p-filter-num');
                    if (minDisplay) minDisplay.textContent = minVal;
                    if (maxDisplay) maxDisplay.textContent = maxVal;
                }
                minInput.dispatchEvent(new Event('input', { bubbles: true }));
                maxInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    function resetAllSwitches() { const switches = document.querySelectorAll('#mobileMenuFilter .switch input[type="checkbox"]'); switches.forEach(sw => { sw.checked = false; }); }

    function areAllCheckboxesSelected() {
        if (!currentFilterContainer) return false;
        let checkboxClass = '';
        if (currentFilterType === 'algorithm') checkboxClass = 'alg-checkbox-mobile';
        else if (currentFilterType === 'coin') checkboxClass = 'coin-checkbox-mobile';
        else if (currentFilterType === 'brand') checkboxClass = 'brand-checkbox-mobile';
        const checkboxes = currentFilterContainer.querySelectorAll(`.${checkboxClass}`);
        if (checkboxes.length === 0) return false;
        return Array.from(checkboxes).every(checkbox => checkbox.checked);
    }

    function selectAllCheckboxesInCurrentFilter() {
        if (!currentFilterContainer) return;
        let checkboxClass = '';
        if (currentFilterType === 'algorithm') checkboxClass = 'alg-checkbox-mobile';
        else if (currentFilterType === 'coin') checkboxClass = 'coin-checkbox-mobile';
        else if (currentFilterType === 'brand') checkboxClass = 'brand-checkbox-mobile';
        const checkboxes = currentFilterContainer.querySelectorAll(`.${checkboxClass}`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            const filterName = checkbox.dataset.filterName;
            const exists = tempSubMenuFilters.some(f => f.type === currentFilterType && f.value === filterName);
            if (!exists) { tempSubMenuFilters.push({ id: Date.now() + Math.random(), type: currentFilterType, value: filterName, displayText: getSubDisplayText(currentFilterType, filterName) }); }
        });
        updateSelectAllButtonText(); updateMobileActiveFiltersDisplay();
    }

    function deselectAllCheckboxesInCurrentFilter() {
        if (!currentFilterContainer) return;
        let checkboxClass = '';
        if (currentFilterType === 'algorithm') checkboxClass = 'alg-checkbox-mobile';
        else if (currentFilterType === 'coin') checkboxClass = 'coin-checkbox-mobile';
        else if (currentFilterType === 'brand') checkboxClass = 'brand-checkbox-mobile';
        const checkboxes = currentFilterContainer.querySelectorAll(`.${checkboxClass}`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const filterName = checkbox.dataset.filterName;
            tempSubMenuFilters = tempSubMenuFilters.filter(f => !(f.type === currentFilterType && f.value === filterName));
        });
        updateSelectAllButtonText(); updateMobileActiveFiltersDisplay();
    }

    function updateSelectAllButtonText() { if (!selectAllButton) return; const allSelected = areAllCheckboxesSelected(); selectAllButton.textContent = allSelected ? 'Снять всё' : 'Выбрать всё'; }

    function addSelectAllButtonToHeader() {
        const existingBtn = document.querySelector('#mobileMenuFilter .mobile-menu-select-all');
        if (existingBtn) existingBtn.remove();
        selectAllButton = document.createElement('button');
        selectAllButton.className = 'see-all-filter-btn mobile-menu-select-all';
        selectAllButton.textContent = 'Выбрать всё';
        selectAllButton.addEventListener('click', (e) => { e.stopPropagation(); const allSelected = areAllCheckboxesSelected(); if (allSelected) { deselectAllCheckboxesInCurrentFilter(); } else { selectAllCheckboxesInCurrentFilter(); } });
        const mobileMenuHeader = document.querySelector('#mobileMenuFilter .mobile-menu-header');
        if (mobileMenuHeader) { const closeBtn = mobileMenuHeader.querySelector('.mobile-menu-close'); if (closeBtn) { mobileMenuHeader.insertBefore(selectAllButton, closeBtn); } else { mobileMenuHeader.appendChild(selectAllButton); } }
    }

    function removeSelectAllButtonFromHeader() { if (selectAllButton) { selectAllButton.remove(); selectAllButton = null; } }

    function updateHeaderButtons(isFilterMode) { if (mobileMenuBack) mobileMenuBack.style.display = isFilterMode ? 'flex' : 'none'; if (mobileMenuClose) mobileMenuClose.style.display = isFilterMode ? 'none' : 'flex'; }
    function updateHeaderForFilter(title) { if (subtitle) subtitle.textContent = title; if (menuTitle) menuTitle.textContent = title; updateHeaderButtons(true); }
    function resetHeaderAfterClose() { if (subtitle) subtitle.textContent = 'Фильтры'; if (menuTitle) menuTitle.textContent = 'Фильтры'; updateHeaderButtons(false); }
    function hideAllFilterContainers() { if (algoritmContainer) algoritmContainer.classList.remove('active'); if (moneyContainer) moneyContainer.classList.remove('active'); if (brandContainer) brandContainer.classList.remove('active'); if (mainFilterContainer) mainFilterContainer.classList.remove('filter-hidden'); }

    function openSubMenu(container, title, filterType) {
        isFilterOpen = true; currentFilterContainer = container; currentFilterTitle = title; currentFilterType = filterType;
        tempSubMenuFilters = [];
        const savedForType = savedMobileFilters.filter(f => f.type === filterType);
        savedForType.forEach(filter => { tempSubMenuFilters.push({ ...filter, displayText: getSubDisplayText(filter.type, filter.value) }); });
        if (mobileMenuTitleFilter) { mobileMenuTitleFilter.classList.add('filter-active'); mobileMenuTitleFilter.style.fontSize = '20px'; }
        hideAllFilterContainers();
        if (container) container.classList.add('active');
        if (mainFilterContainer) mainFilterContainer.classList.add('filter-hidden');
        updateHeaderForFilter(title); addSelectAllButtonToHeader();
        setTimeout(() => { syncSubMenuCheckboxes(); updateMobileActiveFiltersDisplay(); }, 50);
        mobileMenu.classList.add('mobile-filter-open');
    }

    function closeSubMenu() {
        isFilterOpen = false;
        if (mobileMenuTitleFilter) { mobileMenuTitleFilter.classList.remove('filter-active'); mobileMenuTitleFilter.style.fontSize = '24px'; }
        currentFilterContainer = null; currentFilterTitle = ''; currentFilterType = '';
        hideAllFilterContainers(); if (mainFilterContainer) mainFilterContainer.classList.remove('filter-hidden');
        resetHeaderAfterClose(); removeSelectAllButtonFromHeader();
        mobileMenu.classList.remove('mobile-filter-open');
        updateMobileActiveFiltersDisplay();
    }

    function setupDoneButtons() {
        const doneButtons = document.querySelectorAll('#mobileAlgoritmContainer .blue-btn, #mobileMoneyContainer .blue-btn, #mobileBrandContainer .blue-btn');
        doneButtons.forEach(btn => { btn.addEventListener('click', () => { saveSubMenuChanges(); closeSubMenu(); }); });
    }

    let filtersSnapshot = []; // снимок фильтров на момент открытия

    function openMenu() {
        shouldResetOnClose = false;
        isMenuOpen = true;
        // Сохраняем снимок текущих применённых фильтров
        filtersSnapshot = savedMobileFilters.map(f => ({ ...f }));
        mobileMenu.classList.add('active'); mobileMenuOverlay.classList.add('active'); document.body.style.overflow = 'hidden';
        updateHeaderButtons(false);
        if (mobileMenuTitleFilter) mobileMenuTitleFilter.style.fontSize = '24px';
        updateMobileButtonsState();
    }

    function closeMenu(isReset = false) {
        if (isReset) {
            resetAllFilters();
        } else {
            // Откатываем черновик к снимку, применённые не трогаем
            savedMobileFilters = filtersSnapshot.map(f => ({ ...f }));
            syncMainMenuCheckboxes();
            restoreSlidersFromFilters();
            updateMobileActiveFiltersDisplay();
            if (typeof window.updateMobileFilterButtons === 'function') {
                window.updateMobileFilterButtons();
            }
        }
        isMenuOpen = false;
        isFilterOpen = false;
        tempSubMenuFilters = [];
        currentFilterContainer = null;
        currentFilterType = '';
        mobileMenu.classList.remove('active');
        mobileMenu.classList.remove('mobile-filter-open');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        hideAllFilterContainers();
        if (mainFilterContainer) mainFilterContainer.classList.remove('filter-hidden');
        resetHeaderAfterClose();
        removeSelectAllButtonFromHeader();
        if (mobileMenuTitleFilter) mobileMenuTitleFilter.style.fontSize = '24px';
        updateMobileActiveFiltersDisplay();
        shouldResetOnClose = false;
    }
    function restoreSlidersFromFilters() {
        // Цена
        const priceFilter = savedMobileFilters.find(f => f.type === 'price');
        const priceMin = document.getElementById('priceMinRangeMobile');
        const priceMax = document.getElementById('priceMaxRangeMobile');
        if (priceMin && priceMax) {
            const [min, max] = priceFilter ? priceFilter.value.split('-').map(Number) : [0, 1696500];
            priceMin.value = min; priceMax.value = max;
            const minDisplay = document.getElementById('priceMinValueMobile');
            const maxDisplay = document.getElementById('priceMaxValueMobile');
            if (minDisplay) minDisplay.textContent = min;
            if (maxDisplay) maxDisplay.textContent = max;
        }

        // Хешрейт
        const hashFilter = savedMobileFilters.find(f => f.type === 'hashrate');
        const hashMin = document.getElementById('hashrateMinRangeMobile');
        const hashMax = document.getElementById('hashrateMaxRangeMobile');
        if (hashMin && hashMax) {
            const [min, max] = hashFilter ? hashFilter.value.split('-').map(Number) : [9, 20000];
            hashMin.value = min; hashMax.value = max;
            const minDisplay = document.getElementById('hashrateMinValueMobile');
            const maxDisplay = document.getElementById('hashrateMaxValueMobile');
            if (minDisplay) minDisplay.textContent = min;
            if (maxDisplay) maxDisplay.textContent = max;
        }

        // Потребление
        const powerFilter = savedMobileFilters.find(f => f.type === 'power');
        const powerMin = document.getElementById('powerMinRangeMobile');
        const powerMax = document.getElementById('powerMaxRangeMobile');
        if (powerMin && powerMax) {
            const [min, max] = powerFilter ? powerFilter.value.split('-').map(Number) : [800, 11180];
            powerMin.value = min; powerMax.value = max;
            const minDisplay = document.getElementById('powerMinValueMobile');
            const maxDisplay = document.getElementById('powerMaxValueMobile');
            if (minDisplay) minDisplay.textContent = min;
            if (maxDisplay) maxDisplay.textContent = max;
        }
    }
    function syncDesktopCheckboxesWithFilters() {
        document.querySelectorAll('.alg-checkbox, .brand-checkbox, .coin-checkbox, .special-checkbox, .condition-checkbox, .toggle-filter').forEach(cb => { cb.checked = false; });
        const priceMin = document.getElementById('priceMinRange'); const priceMax = document.getElementById('priceMaxRange');
        if (priceMin && priceMax) { priceMin.value = 0; priceMax.value = 1696500; document.getElementById('priceMinValue').textContent = 0; document.getElementById('priceMaxValue').textContent = 1696500; }
        const hashrateMin = document.getElementById('hashrateMinRange'); const hashrateMax = document.getElementById('hashrateMaxRange');
        if (hashrateMin && hashrateMax) { hashrateMin.value = 9; hashrateMax.value = 20000; document.getElementById('hashrateMinValue').textContent = 9; document.getElementById('hashrateMaxValue').textContent = 20000; }
        const powerMin = document.getElementById('powerMinRange'); const powerMax = document.getElementById('powerMaxRange');
        if (powerMin && powerMax) { powerMin.value = 800; powerMax.value = 11180; document.getElementById('powerMinValue').textContent = 800; document.getElementById('powerMaxValue').textContent = 11180; }
        if (typeof activeFilters !== 'undefined') {
            activeFilters.forEach(filter => {
                if (filter.type === 'algorithm') { document.querySelectorAll(`.alg-checkbox[data-filter-name="${filter.value}"]`).forEach(cb => cb.checked = true); }
                else if (filter.type === 'coin') { document.querySelectorAll(`.coin-checkbox[data-filter-name="${filter.value}"]`).forEach(cb => cb.checked = true); }
                else if (filter.type === 'brand') { document.querySelectorAll(`.brand-checkbox[data-filter-name="${filter.value}"]`).forEach(cb => cb.checked = true); }
                else if (filter.type === 'special') { document.querySelectorAll(`.special-checkbox[data-filter-name="${filter.value}"]`).forEach(cb => cb.checked = true); }
                else if (filter.type === 'condition') { document.querySelectorAll(`.condition-checkbox[data-filter-name="${filter.value}"]`).forEach(cb => cb.checked = true); }
                else if (filter.type === 'toggle') { document.querySelectorAll(`.toggle-filter[data-filter-name="${filter.value}"]`).forEach(toggle => toggle.checked = true); }
            });
        }
    }

    // === ПОЛЗУНКИ ===
    // === ПОЛЗУНКИ ===
    function initSliders() {
        const priceMinMobile = document.getElementById('priceMinRangeMobile');
        const priceMaxMobile = document.getElementById('priceMaxRangeMobile');
        const priceMinValueMobile = document.getElementById('priceMinValueMobile');
        const priceMaxValueMobile = document.getElementById('priceMaxValueMobile');

        function updatePriceFilterMobile() {
            if (!priceMinMobile || !priceMaxMobile) return;
            let minVal = parseInt(priceMinMobile.value);
            let maxVal = parseInt(priceMaxMobile.value);
            if (minVal > maxVal) {
                [minVal, maxVal] = [maxVal, minVal];
                priceMinMobile.value = minVal;
                priceMaxMobile.value = maxVal;
            }
            if (priceMinValueMobile) priceMinValueMobile.textContent = minVal;
            if (priceMaxValueMobile) priceMaxValueMobile.textContent = maxVal;

            const isDefault = (minVal === 0 && maxVal === 1696500);
            if (!isDefault) {
                const displayText = `Цена: от ${minVal.toLocaleString()} до ${maxVal.toLocaleString()}`;
                const existingIndex = savedMobileFilters.findIndex(f => f.type === 'price');
                if (existingIndex !== -1) {
                    savedMobileFilters[existingIndex].displayText = displayText;
                    savedMobileFilters[existingIndex].value = `${minVal}-${maxVal}`;
                } else {
                    savedMobileFilters.push({ id: Date.now() + Math.random(), type: 'price', value: `${minVal}-${maxVal}`, displayText: displayText });
                }
            } else {
                savedMobileFilters = savedMobileFilters.filter(f => f.type !== 'price');
            }
            updateMobileActiveFiltersDisplay();

            updateMobileButtonsState(); // 🔥 ДОБАВЛЕНО: обновляем состояние кнопки "Фильтр"
        }

        if (priceMinMobile && priceMaxMobile) {
            priceMinMobile.addEventListener('input', updatePriceFilterMobile);
            priceMaxMobile.addEventListener('input', updatePriceFilterMobile);
        }

        const hashrateMinMobile = document.getElementById('hashrateMinRangeMobile');
        const hashrateMaxMobile = document.getElementById('hashrateMaxRangeMobile');
        const hashrateMinValueMobile = document.getElementById('hashrateMinValueMobile');
        const hashrateMaxValueMobile = document.getElementById('hashrateMaxValueMobile');

        function updateHashrateFilterMobile() {
            if (!hashrateMinMobile || !hashrateMaxMobile) return;
            let minVal = parseInt(hashrateMinMobile.value);
            let maxVal = parseInt(hashrateMaxMobile.value);
            if (minVal > maxVal) {
                [minVal, maxVal] = [maxVal, minVal];
                hashrateMinMobile.value = minVal;
                hashrateMaxMobile.value = maxVal;
            }
            if (hashrateMinValueMobile) hashrateMinValueMobile.textContent = minVal;
            if (hashrateMaxValueMobile) hashrateMaxValueMobile.textContent = maxVal;

            const isDefault = (minVal === 9 && maxVal === 20000);
            if (!isDefault) {
                const displayText = `Хешрейт: от ${minVal} до ${maxVal}`;
                const existingIndex = savedMobileFilters.findIndex(f => f.type === 'hashrate');
                if (existingIndex !== -1) {
                    savedMobileFilters[existingIndex].displayText = displayText;
                    savedMobileFilters[existingIndex].value = `${minVal}-${maxVal}`;
                } else {
                    savedMobileFilters.push({ id: Date.now() + Math.random(), type: 'hashrate', value: `${minVal}-${maxVal}`, displayText: displayText });
                }
            } else {
                savedMobileFilters = savedMobileFilters.filter(f => f.type !== 'hashrate');
            }
            updateMobileActiveFiltersDisplay();

            updateMobileButtonsState(); // 🔥 ДОБАВЛЕНО: обновляем состояние кнопки "Фильтр"
        }

        if (hashrateMinMobile && hashrateMaxMobile) {
            hashrateMinMobile.addEventListener('input', updateHashrateFilterMobile);
            hashrateMaxMobile.addEventListener('input', updateHashrateFilterMobile);
        }

        const powerMinMobile = document.getElementById('powerMinRangeMobile');
        const powerMaxMobile = document.getElementById('powerMaxRangeMobile');
        const powerMinValueMobile = document.getElementById('powerMinValueMobile');
        const powerMaxValueMobile = document.getElementById('powerMaxValueMobile');

        function updatePowerFilterMobile() {
            if (!powerMinMobile || !powerMaxMobile) return;
            let minVal = parseInt(powerMinMobile.value);
            let maxVal = parseInt(powerMaxMobile.value);
            if (minVal > maxVal) {
                [minVal, maxVal] = [maxVal, minVal];
                powerMinMobile.value = minVal;
                powerMaxMobile.value = maxVal;
            }
            if (powerMinValueMobile) powerMinValueMobile.textContent = minVal;
            if (powerMaxValueMobile) powerMaxValueMobile.textContent = maxVal;

            const isDefault = (minVal === 800 && maxVal === 11180);
            if (!isDefault) {
                const displayText = `Потребление: от ${minVal} до ${maxVal} Вт/ч`;
                const existingIndex = savedMobileFilters.findIndex(f => f.type === 'power');
                if (existingIndex !== -1) {
                    savedMobileFilters[existingIndex].displayText = displayText;
                    savedMobileFilters[existingIndex].value = `${minVal}-${maxVal}`;
                } else {
                    savedMobileFilters.push({ id: Date.now() + Math.random(), type: 'power', value: `${minVal}-${maxVal}`, displayText: displayText });
                }
            } else {
                savedMobileFilters = savedMobileFilters.filter(f => f.type !== 'power');
            }
            updateMobileActiveFiltersDisplay();

            updateMobileButtonsState(); // 🔥 ДОБАВЛЕНО: обновляем состояние кнопки "Фильтр"
        }

        if (powerMinMobile && powerMaxMobile) {
            powerMinMobile.addEventListener('input', updatePowerFilterMobile);
            powerMaxMobile.addEventListener('input', updatePowerFilterMobile);
        }
    }

    function initMainMenuHandlers() {
        document.querySelectorAll('.filter-box-phone .alg-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleMainFilter('algorithm', this.dataset.filterName, this.checked); }); });
        document.querySelectorAll('.filter-box-phone .coin-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleMainFilter('coin', this.dataset.filterName, this.checked); }); });
        document.querySelectorAll('.filter-box-phone .brand-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleMainFilter('brand', this.dataset.filterName, this.checked); }); });
        document.querySelectorAll('.special-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleMainFilter('special', this.dataset.filterName, this.checked); }); });
        document.querySelectorAll('.condition-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleMainFilter('condition', this.dataset.filterName, this.checked); }); });
        document.querySelectorAll('.toggle-filter').forEach(toggle => {
            toggle.addEventListener('change', function () {
                const filterName = this.dataset.filterName;
                toggleMainFilter('toggle', filterName, this.checked);
                let subToggle = null;
                switch (filterName) {
                    case 'Самый прибыльный': subToggle = document.querySelector('#mobileMenuFilterPrib .toggle-filter'); break;
                    case 'Самый мощный': subToggle = document.querySelector('#mobileMenuFilterMosn .toggle-filter'); break;
                    case 'Бестселлер': subToggle = document.querySelector('#mobileMenuFilterBets .toggle-filter'); break;
                    case 'Скидка': subToggle = document.querySelector('#mobileMenuFilterSkidka .toggle-filter'); break;
                }
                if (subToggle && subToggle.checked !== this.checked) { subToggle.checked = this.checked; }
            });
        });
    }

    function initSubMenuHandlers() {
        document.querySelectorAll('#mobileAlgoritmContainer .alg-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleTempFilter('algorithm', this.dataset.filterName, this.checked); updateSelectAllButtonText(); }); });
        document.querySelectorAll('#mobileMoneyContainer .coin-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleTempFilter('coin', this.dataset.filterName, this.checked); updateSelectAllButtonText(); }); });
        document.querySelectorAll('#mobileBrandContainer .brand-checkbox-mobile').forEach(checkbox => { checkbox.addEventListener('change', function () { toggleTempFilter('brand', this.dataset.filterName, this.checked); updateSelectAllButtonText(); }); });
    }

    function createSeeAllButtons() {
        filterItems.forEach(item => {
            const checkboxCount = getCheckboxCount(item);
            if (checkboxCount > 5) {
                const header = item.querySelector('.cat-page-filter-header');
                const content = item.querySelector('.cat-page-filter-content-mobile');
                const filterTitle = header.querySelector('.cat-page-filter-header-p').textContent;
                let targetContainer = null; let filterType = '';
                if (filterTitle === 'Алгоритм') { targetContainer = algoritmContainer; filterType = 'algorithm'; }
                else if (filterTitle === 'Добываемые монеты') { targetContainer = moneyContainer; filterType = 'coin'; }
                else if (filterTitle === 'Бренд') { targetContainer = brandContainer; filterType = 'brand'; }
                if (targetContainer) {
                    const seeAllBtn = document.createElement('button');
                    seeAllBtn.className = 'see-all-filter-btn'; seeAllBtn.textContent = 'Смотреть всё';
                    content.appendChild(seeAllBtn);
                    seeAllBtn.addEventListener('click', (e) => { e.stopPropagation(); openSubMenu(targetContainer, filterTitle, filterType); });
                }
            }
        });
    }

    function getCheckboxCount(filterItem) { const checkboxes = filterItem.querySelectorAll('.cat-page-filter-content-checkbox .cat-page-filter-checkbox-box'); return checkboxes.length; }

    if (mobileMenuSbros) {
        mobileMenuSbros.addEventListener('click', () => {
            resetAllFilters();
            closeMenu(true); // Закрываем без дополнительного сброса
            // 🔥 Фиксируем сброс в appliedMobileFilters
            if (typeof window.applyMobileFilters === 'function') {
                window.applyMobileFilters();
            }
        });
    }
    if (mobileMenuBack) { mobileMenuBack.style.display = 'none'; mobileMenuBack.addEventListener('click', () => { if (isFilterOpen) { revertSubMenuChanges(); closeSubMenu(); } else { closeMenu(false); } }); }
    if (mobileMenuClose) {
        mobileMenuClose.style.display = 'flex';
        mobileMenuClose.addEventListener('click', () => {
            closeMenu(false); // Просто закрываем, без сброса
        });
    }
    const mobileSubmitFilters = document.getElementById('mobileSubmitFilters');
    if (mobileSubmitFilters) {
        mobileSubmitFilters.addEventListener('click', () => {
            if (isFilterOpen) {
                saveSubMenuChanges();
                closeSubMenu();
            }
            applyFiltersToSystem();               // фиксируем appliedMobileFilters
            updateMobileButtonsState();           // теперь читает appliedMobileFilters
            filtersSnapshot = savedMobileFilters.map(f => ({ ...f })); // обновляем снимок
            if (typeof window.updateMobileFilterButtons === 'function') {
                window.updateMobileFilterButtons(); // обновляем кнопки-теги
            }
            closeMenu(false);
        });
    }
    if (openMobileFilters) { openMobileFilters.addEventListener('click', (e) => { e.stopPropagation(); if (isMenuOpen) { closeMenu(false); } else { openMenu(); } }); }
    if (mobileMenuOverlay) { mobileMenuOverlay.addEventListener('click', () => closeMenu(false)); }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isMenuOpen) { if (isFilterOpen) { revertSubMenuChanges(); closeSubMenu(); } else { closeMenu(false); } } });
    const filterScrollContainer = document.querySelector('.filter-box-phone');

    if (filterScrollContainer && mobileMenuTitleFilter) {
        let isScrolled = false;

        filterScrollContainer.addEventListener('scroll', () => {
            const shouldBeScrolled = filterScrollContainer.scrollTop > 10;

            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;

                if (isScrolled) {
                    mobileMenuTitleFilter.classList.add('scrolled');
                } else {
                    mobileMenuTitleFilter.classList.remove('scrolled');
                }
            }
        });
    }
    initSliders(); initMainMenuHandlers(); initSubMenuHandlers(); createSeeAllButtons(); setupDoneButtons(); limitMobileCheckboxes();
}

function initMobileFilterButtons() {
    const filterButtonsContainer = document.querySelector('.catalog-filter-box-mobile');
    if (!filterButtonsContainer) return;
    const sortButton = document.getElementById('mobileMenuPSortOpen');
    const mainFilterButton = document.getElementById('openMobileFilters');

    // 🔥 ПРОВЕРКА АКТИВНОСТИ ТЕПЕРЬ ИДЁТ ПО savedMobileFilters (ПРИМЕНЁННЫМ), А НЕ ПО DOM
    function hasRangeFilterActive(filterType) {
        const applied = typeof window.getAppliedMobileFilters === 'function' ? window.getAppliedMobileFilters() : [];
        switch (filterType) {
            case 'price': { const f = applied.find(x => x.type === 'price'); if (f) { const [min, max] = f.value.split('-').map(Number); return !(min === 0 && max === 1696500); } return false; }
            case 'hash': { const f = applied.find(x => x.type === 'hashrate'); if (f) { const [min, max] = f.value.split('-').map(Number); return !(min === 9 && max === 20000); } return false; }
            case 'power': { const f = applied.find(x => x.type === 'power'); if (f) { const [min, max] = f.value.split('-').map(Number); return !(min === 800 && max === 11180); } return false; }
            default: return false;
        }
    }

    function hasCheckboxFilterActive(filterType) {
        const applied = typeof window.getAppliedMobileFilters === 'function' ? window.getAppliedMobileFilters() : [];
        return applied.some(f => f.type === filterType);
    }

    function hasToggleFilterActive(toggleName) {
        const applied = typeof window.getAppliedMobileFilters === 'function' ? window.getAppliedMobileFilters() : [];
        return applied.some(f => f.type === 'toggle' && f.value === toggleName);
    }

    const filterButtons = [
        { element: document.getElementById('mobileMenuPriceOpen'), type: 'price', name: 'Цена', alwaysShow: true, checkActive: () => hasRangeFilterActive('price') },
        { element: document.getElementById('mobileMenuBrandOpen'), type: 'brand', name: 'Бренд', alwaysShow: true, checkActive: () => hasCheckboxFilterActive('brand') },
        { element: document.getElementById('mobileMenuHashOpen'), type: 'hash', name: 'Хешрейт', alwaysShow: true, checkActive: () => hasRangeFilterActive('hash') },
        { element: document.getElementById('mobileMenuAlgOpen'), type: 'alg', name: 'Алгоритм', alwaysShow: true, checkActive: () => hasCheckboxFilterActive('algorithm') },
        { element: document.getElementById('mobileMenuPribOpen'), type: 'toggle', name: 'Самый прибыльный', alwaysShow: true, toggleValue: 'Самый прибыльный', checkActive: () => hasToggleFilterActive('Самый прибыльный') },
        { element: document.getElementById('mobileMenuMoneyOpen'), type: 'money', name: 'Монеты', alwaysShow: false, checkActive: () => hasCheckboxFilterActive('coin') },
        { element: document.getElementById('mobileMenuPotrebOpen'), type: 'potreb', name: 'Потребление', alwaysShow: false, checkActive: () => hasRangeFilterActive('power') },
        { element: document.getElementById('mobileMenuMosnOpen'), type: 'toggle', name: 'Самый мощный', alwaysShow: false, toggleValue: 'Самый мощный', checkActive: () => hasToggleFilterActive('Самый мощный') },
        { element: document.getElementById('mobileMenuBetsOpen'), type: 'toggle', name: 'Бестселлер', alwaysShow: false, toggleValue: 'Бестселлер', checkActive: () => hasToggleFilterActive('Бестселлер') },
        { element: document.getElementById('mobileMenuSkidkaOpen'), type: 'toggle', name: 'Скидка', alwaysShow: false, toggleValue: 'Скидка', checkActive: () => hasToggleFilterActive('Скидка') },
        { element: document.getElementById('mobileMenuSpecialOpen'), type: 'special', name: 'Специальные предложения', alwaysShow: false, checkActive: () => hasCheckboxFilterActive('special') },
        { element: document.getElementById('mobileMenuSostOpen'), type: 'sost', name: 'Состояние', alwaysShow: false, checkActive: () => hasCheckboxFilterActive('condition') }
    ];

    function resetSingleFilter(btnConfig) {
        if (!btnConfig) return;

        function triggerChange(selector) {
            document.querySelectorAll(selector).forEach(el => {
                el.checked = false;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

        function triggerRange(minId, maxId, minVal, maxVal) {
            const min = document.getElementById(minId);
            const max = document.getElementById(maxId);
            if (min && max) {
                min.value = minVal;
                max.value = maxVal;
                min.dispatchEvent(new Event('input', { bubbles: true }));
                max.dispatchEvent(new Event('input', { bubbles: true }));
                min.dispatchEvent(new Event('change', { bubbles: true }));
                max.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        switch (btnConfig.type) {
            case 'price': triggerRange('priceMinRangeMobile', 'priceMaxRangeMobile', 0, 1696500); break;
            case 'hash': triggerRange('hashrateMinRangeMobile', 'hashrateMaxRangeMobile', 9, 20000); break;
            case 'potreb': triggerRange('powerMinRangeMobile', 'powerMaxRangeMobile', 800, 11180); break;
            case 'brand': triggerChange('.brand-checkbox-mobile'); break;
            case 'alg': triggerChange('.alg-checkbox-mobile'); break;
            case 'money': triggerChange('.coin-checkbox-mobile'); break;
            case 'special': triggerChange('.special-checkbox-mobile'); break;
            case 'sost': triggerChange('.condition-checkbox-mobile'); break;
            case 'toggle':
                // Сброс toggle-фильтра по его значению
                if (btnConfig.toggleValue) {
                    triggerChange(`.toggle-filter[data-filter-name="${btnConfig.toggleValue}"]`);
                }
                break;
        }
        if (typeof window.applyMobileFilters === 'function') {
            window.applyMobileFilters();
        }
        updateAllFilterButtons();
    }

    function applyToggleFilter(toggleValue, isActive) {
        const mainToggle = document.querySelector(`.filter-box-phone .toggle-filter[data-filter-name="${toggleValue}"]`);
        if (mainToggle) {
            if (mainToggle.checked !== isActive) {
                mainToggle.checked = isActive;
                mainToggle.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        let subMenuId = '';
        switch (toggleValue) {
            case 'Самый прибыльный': subMenuId = 'mobileMenuFilterPrib'; break;
            case 'Самый мощный': subMenuId = 'mobileMenuFilterMosn'; break;
            case 'Бестселлер': subMenuId = 'mobileMenuFilterBets'; break;
            case 'Скидка': subMenuId = 'mobileMenuFilterSkidka'; break;
        }

        if (subMenuId) {
            const subToggle = document.querySelector(`#${subMenuId} .toggle-filter`);
            if (subToggle && subToggle.checked !== isActive) {
                subToggle.checked = isActive;
            }
        }

        // Сразу применяем — toggle из панели кнопок применяется без меню
        if (typeof window.applyMobileFilters === 'function') {
            window.applyMobileFilters();
        }
        updateAllFilterButtons();
    }
    // Обходим все кнопки
    filterButtons.forEach(btn => {
        if (!btn.element) return;

        const img = btn.element.querySelector('img');
        if (img) {
            img.addEventListener('click', function (e) {
                if (!btn.element.classList.contains('active-filter-btn')) return;
                e.preventDefault();
                e.stopPropagation();
                resetSingleFilter(btn);
            });
        }

        // 🔥 ОСНОВНОЙ КЛИК ПО КНОПКЕ - для toggle-фильтров работаем напрямую
        btn.element.addEventListener('click', function (e) {
            // Если клик был по иконке ✕ - он уже обработан выше, пропускаем
            if (e.target.closest('img')) return;

            // Если это toggle-фильтр (Самый прибыльный, Самый мощный и т.д.)
            if (btn.type === 'toggle') {
                e.preventDefault();
                e.stopPropagation();

                const isCurrentlyActive = btn.checkActive();

                if (isCurrentlyActive) {
                    // Если активен - СБРАСЫВАЕМ
                    resetSingleFilter(btn);
                } else {
                    // Если не активен - ПРИМЕНЯЕМ
                    applyToggleFilter(btn.toggleValue, true);
                }
            }
            // Для остальных типов - стандартное поведение (открытие подменю)
        });
    });

    function updateButtonStyle(button, isActive) {
        if (!button) return;
        if (isActive) {
            button.classList.add('active-filter-btn');
            const img = button.querySelector('img');
            if (img && !img.hasAttribute('data-original-src')) {
                img.setAttribute('data-original-src', img.src);
                img.src = 'assets/images/catalog/catalog-page/close-icon.svg';
            }
        } else {
            button.classList.remove('active-filter-btn');
            const img = button.querySelector('img');
            if (img && img.hasAttribute('data-original-src')) {
                img.src = img.getAttribute('data-original-src');
                img.removeAttribute('data-original-src');
            }
        }
    }

    function updateButtonsVisibility() {
        filterButtons.forEach(btn => {
            if (btn.element) {
                if (btn.alwaysShow) {
                    btn.element.style.display = 'flex';
                } else {
                    const hasActiveFilter = btn.checkActive();
                    btn.element.style.display = hasActiveFilter ? 'flex' : 'none';
                }
            }
        });
    }

    function reorderButtons() {
        const children = Array.from(filterButtonsContainer.children);
        const priorityButtons = [sortButton, mainFilterButton].filter(btn => btn && btn.parentElement === filterButtonsContainer);
        const activeFilterElements = [];
        const inactiveFilterElements = [];

        filterButtons.forEach(btn => {
            if (btn.element && btn.element.parentElement === filterButtonsContainer && btn.element.style.display !== 'none') {
                const isActive = btn.checkActive();
                if (isActive) {
                    activeFilterElements.push(btn.element);
                } else {
                    inactiveFilterElements.push(btn.element);
                }
            }
        });

        const newOrder = [...priorityButtons, ...activeFilterElements, ...inactiveFilterElements];
        children.forEach(child => {
            if (!priorityButtons.includes(child) && !filterButtons.some(btn => btn.element === child) && !newOrder.includes(child)) {
                newOrder.push(child);
            }
        });

        newOrder.forEach(child => {
            if (child && child.parentElement === filterButtonsContainer) {
                filterButtonsContainer.appendChild(child);
            }
        });
    }

    function updateAllFilterButtons() {
        filterButtons.forEach(btn => {
            if (btn.element) {
                const isActive = btn.checkActive();
                updateButtonStyle(btn.element, isActive);
            }
        });
        updateButtonsVisibility();
        reorderButtons();
    }

    function addFilterChangeListeners() {
        const rangeInputs = ['priceMinRangeMobile', 'priceMaxRangeMobile', 'hashrateMinRangeMobile', 'hashrateMaxRangeMobile', 'powerMinRangeMobile', 'powerMaxRangeMobile'];
        rangeInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.removeEventListener('input', updateAllFilterButtons);
                input.addEventListener('input', updateAllFilterButtons);
            }
        });

        const checkboxSelectors = ['.brand-checkbox-mobile', '.alg-checkbox-mobile', '.coin-checkbox-mobile', '.special-checkbox-mobile', '.condition-checkbox-mobile'];
        checkboxSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(cb => {
                cb.removeEventListener('change', updateAllFilterButtons);
                cb.addEventListener('change', updateAllFilterButtons);
            });
        });

        document.querySelectorAll('.toggle-filter').forEach(toggle => {
            toggle.removeEventListener('change', updateAllFilterButtons);
            toggle.addEventListener('change', updateAllFilterButtons);
        });
    }
    window.updateMobileFilterButtons = updateAllFilterButtons;

    addFilterChangeListeners();
    setTimeout(() => { updateAllFilterButtons(); }, 100);
    const applyButton = document.getElementById('mobileSubmitFilters');
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            updateAllFilterButtons();
        });
    }


}


// Функция для синхронизации брендов между ПК, мобильным основным меню и подменю
function initBrandButtonsSync() {
    // Находим все кнопки брендов
    const brandButtons = document.querySelectorAll('.catalog-brand');
    const catalogHomeCateg = document.querySelector('.catalog-home-categ-page');
    const catalogBrandsSection = document.querySelector('.catalog-brands');
    const catalogTitle = document.querySelector('.catalog-title');
    const catalogNumProduct = document.querySelector('.catalog-num-product');
    const breadcrumbs = document.querySelector('.breadcrumbs');

    // Флаг, указывающий, что фильтр был применён через кнопку бренда
    let isBrandButtonFilterActive = false;
    let activeBrandButtonName = null;

    // Делаем флаг глобально доступным для проверки в hasActiveFilters
    window.isBrandButtonFilterActive = false;

    // Функция для обновления хлебных крошек
    function updateBreadcrumbs(brandName, brandCount) {
        if (!breadcrumbs) return;
        if (!brandName) {
            breadcrumbs.innerHTML = `
                <a href="index.html" class="breadcrumb">Главная</a>
                <img src="assets/images/banner/IconLibrary.svg" alt="icon">
                <a href="index.html" class="breadcrumb">Каталог</a>
                <img src="assets/images/banner/IconLibrary.svg" alt="icon">
                <a href="index.html" class="breadcrumb active">ASIC-майнеры</a>
            `;
        } else {
            breadcrumbs.innerHTML = `
                <a href="index.html" class="breadcrumb">Главная</a>
                <img src="assets/images/banner/IconLibrary.svg" alt="icon">
                <a href="index.html" class="breadcrumb">Каталог</a>
                <img src="assets/images/banner/IconLibrary.svg" alt="icon">
                <a href="index.html" class="breadcrumb">ASIC-майнеры</a>
                <img src="assets/images/banner/IconLibrary.svg" alt="icon">
                <a href="#" class="breadcrumb active">ASIC-майнеры ${brandName}</a>
            `;
        }
    }

    // Функция для обновления заголовка и количества товаров
    function updateCatalogHeader(brandName, brandCount) {
        if (!catalogTitle || !catalogNumProduct) return;
        if (!brandName) {
            catalogTitle.textContent = 'ASIC майнеры';
            catalogNumProduct.textContent = '252 товара';
        } else {
            catalogTitle.textContent = `ASIC майнеры ${brandName}`;
            catalogNumProduct.textContent = `${brandCount} товаров`;
        }
    }

    // 🔥 Функция для полного сброса UI (возврат к исходному состоянию)
    function resetBrandUI() {
        // Сбрасываем флаги
        window.isBrandButtonFilterActive = false;
        isBrandButtonFilterActive = false;
        activeBrandButtonName = null;

        // Показываем все чекбоксы брендов обратно
        toggleBrandCheckboxesVisibility(null);

        // Возвращаем обычный вид страницы
        if (catalogHomeCateg) catalogHomeCateg.style.display = '';
        if (catalogBrandsSection) catalogBrandsSection.style.display = '';

        // Обновляем хлебные крошки и заголовок
        updateBreadcrumbs(null);
        updateCatalogHeader(null);

        // Обновляем видимость кнопки сброса на ПК
        if (typeof window.updatePcResetButtonVisibility === 'function') {
            setTimeout(function () {
                window.updatePcResetButtonVisibility();
            }, 50);
        }
    }

    // Делаем функцию глобально доступной
    window.resetBrandUI = resetBrandUI;

    // 🔥 Функция для скрытия/показа всех чекбоксов брендов
    function toggleBrandCheckboxesVisibility(selectedBrandName) {
        // ПК чекбоксы брендов
        const pcBrandCheckboxes = document.querySelectorAll('.brand-checkbox');
        pcBrandCheckboxes.forEach(checkbox => {
            const checkboxContainer = checkbox.closest('.cat-page-filter-checkbox-box');
            if (checkboxContainer) {
                if (selectedBrandName && checkbox.getAttribute('data-filter-name') !== selectedBrandName) {
                    checkboxContainer.style.display = 'none';
                } else if (!selectedBrandName) {
                    checkboxContainer.style.display = '';
                }
            }
        });

        // Мобильные чекбоксы брендов в основном меню
        const mobileBrandCheckboxes = document.querySelectorAll('.filter-box-phone .brand-checkbox-mobile');
        mobileBrandCheckboxes.forEach(checkbox => {
            const checkboxContainer = checkbox.closest('.cat-page-filter-checkbox-box');
            if (checkboxContainer) {
                if (selectedBrandName && checkbox.getAttribute('data-filter-name') !== selectedBrandName) {
                    checkboxContainer.style.display = 'none';
                } else if (!selectedBrandName) {
                    checkboxContainer.style.display = '';
                }
            }
        });

        // Мобильные чекбоксы брендов в подменю mobileMenuFilterBrand
        const subBrandCheckboxes = document.querySelectorAll('#mobileMenuFilterBrand .cat-page-filter-checkbox-box');
        subBrandCheckboxes.forEach(container => {
            const brandNameElement = container.querySelector('.checkbox-desc-catalog');
            const brandName = brandNameElement ? brandNameElement.textContent.trim() : '';

            if (selectedBrandName && brandName !== selectedBrandName) {
                container.style.display = 'none';
            } else if (!selectedBrandName) {
                container.style.display = '';
            }
        });

        // Обрабатываем чекбоксы в mobileBrandContainer
        const brandContainerCheckboxes = document.querySelectorAll('#mobileBrandContainer .brand-checkbox-mobile');
        brandContainerCheckboxes.forEach(checkbox => {
            const checkboxContainer = checkbox.closest('.cat-page-filter-checkbox-box');
            if (checkboxContainer) {
                if (selectedBrandName && checkbox.getAttribute('data-filter-name') !== selectedBrandName) {
                    checkboxContainer.style.display = 'none';
                } else if (!selectedBrandName) {
                    checkboxContainer.style.display = '';
                }
            }
        });
    }

    // 🔥 Функция для синхронизации бренда с мобильными фильтрами
    function syncBrandWithMobileFilters(brandName, shouldSelect) {
        // Находим мобильный чекбокс бренда в основном меню
        const mobileBrandCheckbox = document.querySelector(`.filter-box-phone .brand-checkbox-mobile[data-filter-name="${brandName}"]`);

        if (mobileBrandCheckbox) {
            if (shouldSelect) {
                if (!mobileBrandCheckbox.checked) {
                    mobileBrandCheckbox.checked = true;
                    mobileBrandCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                if (mobileBrandCheckbox.checked) {
                    mobileBrandCheckbox.checked = false;
                    mobileBrandCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        // Синхронизируем с подменю mobileMenuFilterBrand
        const allSubContainers = document.querySelectorAll('#mobileMenuFilterBrand .cat-page-filter-checkbox-box');
        allSubContainers.forEach(container => {
            const brandNameElement = container.querySelector('.checkbox-desc-catalog');
            const containerBrandName = brandNameElement ? brandNameElement.textContent.trim() : '';
            const checkbox = container.querySelector('.checkbox');

            if (checkbox && containerBrandName === brandName) {
                if (shouldSelect) {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            } else if (checkbox && shouldSelect) {
                if (checkbox.checked) {
                    checkbox.checked = false;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        // Синхронизируем с подменю брендов через mobileBrandContainer
        const brandContainerCheckbox = document.querySelector(`#mobileBrandContainer .brand-checkbox-mobile[data-filter-name="${brandName}"]`);
        if (brandContainerCheckbox) {
            if (shouldSelect) {
                if (!brandContainerCheckbox.checked) {
                    brandContainerCheckbox.checked = true;
                    brandContainerCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                if (brandContainerCheckbox.checked) {
                    brandContainerCheckbox.checked = false;
                    brandContainerCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }
    }

    // 🔥 Функция для снятия всех активных брендов
    function clearAllBrandFilters() {
        const appliedFilters = typeof window.getAppliedMobileFilters === 'function'
            ? window.getAppliedMobileFilters()
            : [];

        const activeBrands = appliedFilters.filter(f => f.type === 'brand');
        activeBrands.forEach(brand => {
            syncBrandWithMobileFilters(brand.value, false);
        });
    }

    // 🔥 Функция для добавления фильтра бренда (через кнопку)
    function addBrandFilterFromButton(brandName, brandCount) {
        window.isBrandButtonFilterActive = true;
        isBrandButtonFilterActive = true;
        activeBrandButtonName = brandName;

        clearAllBrandFilters();
        toggleBrandCheckboxesVisibility(brandName);

        if (catalogHomeCateg) catalogHomeCateg.style.display = 'none';
        if (catalogBrandsSection) catalogBrandsSection.style.display = 'none';

        updateBreadcrumbs(brandName, brandCount);
        updateCatalogHeader(brandName, brandCount);

        syncBrandWithMobileFilters(brandName, true);

        const pcBrandCheckbox = document.querySelector(`.brand-checkbox[data-filter-name="${brandName}"]`);
        if (pcBrandCheckbox && !pcBrandCheckbox.checked) {
            pcBrandCheckbox.checked = true;
            pcBrandCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 🔥 Фиксируем в appliedMobileFilters и обновляем кнопки-теги
        if (typeof window.applyMobileFilters === 'function') {
            window.applyMobileFilters();
        }

        if (typeof window.updatePcResetButtonVisibility === 'function') {
            setTimeout(function () {
                window.updatePcResetButtonVisibility();
            }, 50);
        }
    }

    // Добавляем обработчики для кнопок брендов
    brandButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const brandName = this.getAttribute('data-brand');
            const brandCount = this.getAttribute('data-brand-count');

            if (!brandName) return;

            const appliedFilters = typeof window.getAppliedMobileFilters === 'function'
                ? window.getAppliedMobileFilters()
                : [];
            const isAlreadyActive = appliedFilters.some(f => f.type === 'brand' && f.value === brandName);

            if (isAlreadyActive && isBrandButtonFilterActive && activeBrandButtonName === brandName) {
                // Если уже активен этот бренд через кнопку - снимаем фильтр и сбрасываем UI
                clearAllBrandFilters();
                resetBrandUI();
            } else {
                // Применяем фильтр через кнопку
                addBrandFilterFromButton(brandName, brandCount);
            }
        });
    });

    // 🔥 Функция для проверки и сброса UI при сбросе всех фильтров
    function checkAndResetOnFilterClear() {
        const appliedFilters = typeof window.getAppliedMobileFilters === 'function'
            ? window.getAppliedMobileFilters()
            : [];
        const activeBrands = appliedFilters.filter(f => f.type === 'brand');

        // Если активных брендов нет и был активен фильтр через кнопку - сбрасываем UI
        if (activeBrands.length === 0 && isBrandButtonFilterActive) {
            resetBrandUI();
        }

        // Обновляем видимость кнопки сброса на ПК
        if (typeof window.updatePcResetButtonVisibility === 'function') {
            window.updatePcResetButtonVisibility();
        }
    }

    document.addEventListener('mobileFiltersApplied', function () {
        checkAndResetOnFilterClear();
    });

    // 🔥 Слушаем удаление фильтра через крестик в активных фильтрах
    document.addEventListener('click', function (e) {
        if (e.target.closest('.remove-filter-mobile') || e.target.closest('.remove-filter')) {
            setTimeout(function () {
                checkAndResetOnFilterClear();
            }, 100);
        }
    });


}
// Функция для управления кнопкой сброса на ПК
function initPcResetButton() {
    const resetButton = document.getElementById('FilterSbros');
    if (!resetButton) return;

    // Функция для проверки наличия активных фильтров
    function hasActiveFilters() {
        // Проверяем активные фильтры в ПК версии
        const pcActiveFilters = typeof activeFilters !== 'undefined' ? activeFilters : [];
        if (pcActiveFilters.length > 0) return true;

        // Проверяем активные фильтры в мобильной версии (через геттер)
        const mobileFilters = typeof window.getAppliedMobileFilters === 'function'
            ? window.getAppliedMobileFilters()
            : [];
        if (mobileFilters.length > 0) return true;

        // Проверяем, активен ли фильтр через кнопку бренда
        if (window.isBrandButtonFilterActive === true) return true;

        return false;
    }

    // Функция для обновления видимости кнопки
    function updateResetButtonVisibility() {
        const hasFilters = hasActiveFilters();
        if (hasFilters) {
            resetButton.style.display = 'flex';
        } else {
            resetButton.style.display = 'none';
        }
    }

    // Делаем функцию глобально доступной для вызова из других функций
    window.updatePcResetButtonVisibility = updateResetButtonVisibility;

    // Функция для полного сброса всех фильтров
    function resetAllFiltersFull() {
        // 1. Сбрасываем ПК фильтры
        if (typeof resetAllFilters === 'function') {
            resetAllFilters();
        }

        // 2. Сбрасываем мобильные фильтры
        if (typeof window.resetAllMobileFilters === 'function') {
            window.resetAllMobileFilters();
        } else {
            // Альтернативный сброс мобильных фильтров
            const mobileFilters = typeof window.getAppliedMobileFilters === 'function'
                ? window.getAppliedMobileFilters()
                : [];
            if (mobileFilters.length > 0) {
                // Триггерим сброс через мобильное меню, если есть такая функция
                const resetBtn = document.getElementById('mobileMenuSbros');
                if (resetBtn) {
                    resetBtn.click();
                }
            }
        }

        // 3. Сбрасываем UI брендов (возвращаем всё как было)
        if (typeof window.resetBrandUI === 'function') {
            window.resetBrandUI();
        }

        // 4. Снимаем все чекбоксы на ПК (дублируем для надёжности)
        document.querySelectorAll('.alg-checkbox, .brand-checkbox, .coin-checkbox, .special-checkbox, .condition-checkbox, .toggle-filter').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // 5. Сбрасываем слайдеры на ПК
        const priceMin = document.getElementById('priceMinRange');
        const priceMax = document.getElementById('priceMaxRange');
        if (priceMin) {
            priceMin.value = 0;
            priceMin.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (priceMax) {
            priceMax.value = 1696500;
            priceMax.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const hashrateMin = document.getElementById('hashrateMinRange');
        const hashrateMax = document.getElementById('hashrateMaxRange');
        if (hashrateMin) {
            hashrateMin.value = 9;
            hashrateMin.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (hashrateMax) {
            hashrateMax.value = 20000;
            hashrateMax.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const powerMin = document.getElementById('powerMinRange');
        const powerMax = document.getElementById('powerMaxRange');
        if (powerMin) {
            powerMin.value = 800;
            powerMin.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (powerMax) {
            powerMax.value = 11180;
            powerMax.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 6. Обновляем видимость кнопки
        setTimeout(function () {
            updateResetButtonVisibility();
        }, 100);
    }

    // Добавляем обработчик клика на кнопку сброса
    resetButton.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        resetAllFiltersFull();
    });

    document.addEventListener('mobileFiltersApplied', function () {
        updateResetButtonVisibility();
    });

    // Наблюдаем за изменениями DOM для ПК фильтров
    const observer = new MutationObserver(function () {
        updateResetButtonVisibility();
    });

    // Наблюдаем за контейнером активных фильтров
    const activeContainer = document.getElementById('activeFiltersContainer');
    if (activeContainer) {
        observer.observe(activeContainer, { childList: true, subtree: true });
    }

    // Начальное обновление видимости
    setTimeout(function () {
        updateResetButtonVisibility();
    }, 100);
}

// Также добавим функцию сброса мобильных фильтров в глобальную область
function initMobileResetFunction() {
    window.resetAllMobileFilters = function () {
        // Пытаемся сбросить через кнопку в мобильном меню
        const resetBtn = document.getElementById('mobileMenuSbros');
        if (resetBtn) {
            resetBtn.click();
        } else {
            // Альтернативный сброс через сохранённые фильтры
            const mobileFilters = typeof window.getAppliedMobileFilters === 'function'
                ? window.getAppliedMobileFilters()
                : [];
            if (mobileFilters.length > 0) {
                // Снимаем все мобильные чекбоксы
                document.querySelectorAll('.filter-box-phone .brand-checkbox-mobile, .filter-box-phone .alg-checkbox-mobile, .filter-box-phone .coin-checkbox-mobile, .special-checkbox-mobile, .condition-checkbox-mobile, .toggle-filter').forEach(cb => {
                    cb.checked = false;
                    cb.dispatchEvent(new Event('change', { bubbles: true }));
                });

                // Сбрасываем мобильные слайдеры
                const priceMin = document.getElementById('priceMinRangeMobile');
                const priceMax = document.getElementById('priceMaxRangeMobile');
                if (priceMin) {
                    priceMin.value = 0;
                    priceMin.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (priceMax) {
                    priceMax.value = 1696500;
                    priceMax.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const hashrateMin = document.getElementById('hashrateMinRangeMobile');
                const hashrateMax = document.getElementById('hashrateMaxRangeMobile');
                if (hashrateMin) {
                    hashrateMin.value = 9;
                    hashrateMin.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (hashrateMax) {
                    hashrateMax.value = 20000;
                    hashrateMax.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const powerMin = document.getElementById('powerMinRangeMobile');
                const powerMax = document.getElementById('powerMaxRangeMobile');
                if (powerMin) {
                    powerMin.value = 800;
                    powerMin.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (powerMax) {
                    powerMax.value = 11180;
                    powerMax.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }

        // Сбрасываем UI брендов
        if (typeof window.resetBrandUI === 'function') {
            window.resetBrandUI();
        }
    };
}



//появление активных фильтров  пк
let activeFilters = [];

// DOM элементы
const activeFiltersContainer = document.getElementById('activeFiltersContainer');

// Функция обновления отображения активных фильтров
function updateActiveFiltersDisplay() {
    // Очищаем контейнер
    activeFiltersContainer.innerHTML = '';

    // Добавляем каждый активный фильтр
    activeFilters.forEach(filter => {
        const filterElement = document.createElement('div');
        filterElement.className = 'catalog-page-cat-content-filter-active remove-filter';
        filterElement.setAttribute('data-filter-id', filter.id);
        filterElement.innerHTML = `
            <p class="cp-filter-active">${filter.displayText}</p>
            <img src="assets/images/catalog/catalog-page/star.svg" alt="remove" >
        `;
        activeFiltersContainer.appendChild(filterElement);
    });

    // Добавляем кнопку "Сбросить всё", если активных фильтров >= 2
    if (activeFilters.length >= 2) {
        const resetButton = document.createElement('div');
        resetButton.className = 'catalog-page-cat-content-filter-active filter-noactive';
        resetButton.id = 'resetAllFilters';
        resetButton.innerHTML = `
            <p class="cp-filter-active">Сбросить всё</p>
            <img src="assets/images/catalog/catalog-page/sbros.svg" alt="reset">
        `;
        activeFiltersContainer.appendChild(resetButton);

        // Добавляем обработчик сброса
        document.getElementById('resetAllFilters').addEventListener('click', resetAllFilters);
    }

    // Добавляем обработчики удаления отдельных фильтров
    document.querySelectorAll('.remove-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterId = btn.dataset.filterId;
            removeFilterById(filterId);
        });
    });
}

// Функция добавления фильтра
function addFilter(filterType, filterValue, displayText) {
    // Проверяем, не добавлен ли уже такой фильтр
    const existingIndex = activeFilters.findIndex(f => f.type === filterType && f.value === filterValue);

    if (existingIndex === -1) {
        const newFilter = {
            id: Date.now() + Math.random(),
            type: filterType,
            value: filterValue,
            displayText: displayText
        };
        activeFilters.push(newFilter);
        updateActiveFiltersDisplay();
    }
}

// Функция удаления фильтра по ID
function removeFilterById(filterId) {
    const filterToRemove = activeFilters.find(f => f.id == filterId);
    if (filterToRemove) {
        // Снимаем соответствующий элемент управления
        removeFilterFromControl(filterToRemove);
        // Удаляем из массива
        activeFilters = activeFilters.filter(f => f.id != filterId);
        updateActiveFiltersDisplay();
    }
}

// Функция снятия фильтра с элемента управления
function removeFilterFromControl(filter) {
    if (filter.type === 'brand') {
        const checkbox = document.querySelector(`.brand-checkbox[data-filter-name="${filter.value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (filter.type === 'algorithm') {
        const checkbox = document.querySelector(`.alg-checkbox[data-filter-name="${filter.value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (filter.type === 'coin') {
        const checkbox = document.querySelector(`.coin-checkbox[data-filter-name="${filter.value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (filter.type === 'special') {
        const checkbox = document.querySelector(`.special-checkbox[data-filter-name="${filter.value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (filter.type === 'condition') {
        const checkbox = document.querySelector(`.condition-checkbox[data-filter-name="${filter.value}"]`);
        if (checkbox) checkbox.checked = false;
    } else if (filter.type === 'toggle') {
        const toggle = document.querySelector(`.toggle-filter[data-filter-name="${filter.value}"]`);
        if (toggle) toggle.checked = false;
    } else if (filter.type === 'price') {
        // Возвращаем слайдеры цены к значениям по умолчанию
        const priceMin = document.getElementById('priceMinRange');
        const priceMax = document.getElementById('priceMaxRange');
        if (priceMin) priceMin.value = 0;
        if (priceMax) priceMax.value = 1696500;
        document.getElementById('priceMinValue').textContent = 0;
        document.getElementById('priceMaxValue').textContent = 1696500;
    } else if (filter.type === 'hashrate') {
        const hashrateMin = document.getElementById('hashrateMinRange');
        const hashrateMax = document.getElementById('hashrateMaxRange');
        if (hashrateMin) hashrateMin.value = 9;
        if (hashrateMax) hashrateMax.value = 20000;
        document.getElementById('hashrateMinValue').textContent = 9;
        document.getElementById('hashrateMaxValue').textContent = 20000;
    } else if (filter.type === 'power') {
        const powerMin = document.getElementById('powerMinRange');
        const powerMax = document.getElementById('powerMaxRange');
        if (powerMin) powerMin.value = 800;
        if (powerMax) powerMax.value = 11180;
        document.getElementById('powerMinValue').textContent = 800;
        document.getElementById('powerMaxValue').textContent = 11180;
    }
}

// Сброс всех фильтров
function resetAllFilters() {
    // Снимаем все чекбоксы алгоритмов
    document.querySelectorAll('.alg-checkbox').forEach(cb => cb.checked = false);
    // Снимаем все чекбоксы брендов
    document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = false);
    // Снимаем все чекбоксы монет
    document.querySelectorAll('.coin-checkbox').forEach(cb => cb.checked = false);
    // Снимаем все чекбоксы спецпредложений
    document.querySelectorAll('.special-checkbox').forEach(cb => cb.checked = false);
    // Снимаем все чекбоксы состояния
    document.querySelectorAll('.condition-checkbox').forEach(cb => cb.checked = false);
    // Снимаем все переключатели
    document.querySelectorAll('.toggle-filter').forEach(toggle => toggle.checked = false);

    // Сбрасываем слайдер цены
    const priceMin = document.getElementById('priceMinRange');
    const priceMax = document.getElementById('priceMaxRange');
    if (priceMin) priceMin.value = 0;
    if (priceMax) priceMax.value = 1696500;
    document.getElementById('priceMinValue').textContent = 0;
    document.getElementById('priceMaxValue').textContent = 1696500;

    // Сбрасываем слайдер хешрейта
    const hashrateMin = document.getElementById('hashrateMinRange');
    const hashrateMax = document.getElementById('hashrateMaxRange');
    if (hashrateMin) hashrateMin.value = 9;
    if (hashrateMax) hashrateMax.value = 20000;
    document.getElementById('hashrateMinValue').textContent = 9;
    document.getElementById('hashrateMaxValue').textContent = 20000;

    // Сбрасываем слайдер потребления
    const powerMin = document.getElementById('powerMinRange');
    const powerMax = document.getElementById('powerMaxRange');
    if (powerMin) powerMin.value = 800;
    if (powerMax) powerMax.value = 11180;
    document.getElementById('powerMinValue').textContent = 800;
    document.getElementById('powerMaxValue').textContent = 11180;

    // Очищаем массив активных фильтров
    activeFilters = [];
    updateActiveFiltersDisplay();
}

// Обработчики событий для фильтров

// Чекбоксы алгоритмов
document.querySelectorAll('.alg-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const filterName = this.dataset.filterName;
        if (this.checked) {
            addFilter('algorithm', filterName, `Алгоритм: ${filterName}`);
        } else {
            const filterToRemove = activeFilters.find(f => f.type === 'algorithm' && f.value === filterName);
            if (filterToRemove) {
                removeFilterById(filterToRemove.id);
            }
        }
    });
});

// Чекбоксы брендов
document.querySelectorAll('.brand-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const filterName = this.dataset.filterName;
        if (this.checked) {
            addFilter('brand', filterName, `Бренд: ${filterName}`);
        } else {
            const filterToRemove = activeFilters.find(f => f.type === 'brand' && f.value === filterName);
            if (filterToRemove) {
                removeFilterById(filterToRemove.id);
            }
        }
    });
});

// Чекбоксы добываемых монет
document.querySelectorAll('.coin-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const filterName = this.dataset.filterName;
        if (this.checked) {
            addFilter('coin', filterName, `Монета: ${filterName}`);
        } else {
            const filterToRemove = activeFilters.find(f => f.type === 'coin' && f.value === filterName);
            if (filterToRemove) {
                removeFilterById(filterToRemove.id);
            }
        }
    });
});

// Чекбоксы спецпредложений
document.querySelectorAll('.special-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const filterName = this.dataset.filterName;
        if (this.checked) {
            addFilter('special', filterName, filterName);
        } else {
            const filterToRemove = activeFilters.find(f => f.type === 'special' && f.value === filterName);
            if (filterToRemove) {
                removeFilterById(filterToRemove.id);
            }
        }
    });
});

// Чекбоксы состояния
document.querySelectorAll('.condition-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const filterName = this.dataset.filterName;
        if (this.checked) {
            addFilter('condition', filterName, `Состояние: ${filterName}`);
        } else {
            const filterToRemove = activeFilters.find(f => f.type === 'condition' && f.value === filterName);
            if (filterToRemove) {
                removeFilterById(filterToRemove.id);
            }
        }
    });
});

// Переключатели (самый прибыльный, самый мощный, бестселлер, скидка)
document.querySelectorAll('.toggle-filter').forEach(toggle => {
    toggle.addEventListener('change', function () {
        const filterName = this.dataset.filterName;
        if (this.checked) {
            addFilter('toggle', filterName, filterName);
        } else {
            const filterToRemove = activeFilters.find(f => f.type === 'toggle' && f.value === filterName);
            if (filterToRemove) {
                removeFilterById(filterToRemove.id);
            }
        }
    });
});

// Слайдер цены
const priceMinRange = document.getElementById('priceMinRange');
const priceMaxRange = document.getElementById('priceMaxRange');
const priceMinValue = document.getElementById('priceMinValue');
const priceMaxValue = document.getElementById('priceMaxValue');

function updatePriceFilter() {
    const minVal = parseInt(priceMinRange.value);
    const maxVal = parseInt(priceMaxRange.value);
    priceMinValue.textContent = minVal;
    priceMaxValue.textContent = maxVal;

    const isDefault = (minVal === 0 && maxVal === 1696500);

    if (!isDefault) {
        const displayText = `Цена: от ${minVal.toLocaleString()} до ${maxVal.toLocaleString()}`;
        const existingPriceFilter = activeFilters.find(f => f.type === 'price');
        if (existingPriceFilter) {
            existingPriceFilter.displayText = displayText;
            existingPriceFilter.value = `${minVal}-${maxVal}`;
        } else {
            addFilter('price', `${minVal}-${maxVal}`, displayText);
        }
    } else {
        const priceFilter = activeFilters.find(f => f.type === 'price');
        if (priceFilter) {
            removeFilterById(priceFilter.id);
        }
    }
    updateActiveFiltersDisplay();
}

if (priceMinRange && priceMaxRange) {
    priceMinRange.addEventListener('input', function () {
        if (parseInt(priceMinRange.value) > parseInt(priceMaxRange.value)) {
            priceMinRange.value = priceMaxRange.value;
        }
        updatePriceFilter();
    });

    priceMaxRange.addEventListener('input', function () {
        if (parseInt(priceMaxRange.value) < parseInt(priceMinRange.value)) {
            priceMaxRange.value = priceMinRange.value;
        }
        updatePriceFilter();
    });
}

// Слайдер хешрейта
const hashrateMinRange = document.getElementById('hashrateMinRange');
const hashrateMaxRange = document.getElementById('hashrateMaxRange');
const hashrateMinValue = document.getElementById('hashrateMinValue');
const hashrateMaxValue = document.getElementById('hashrateMaxValue');

function updateHashrateFilter() {
    const minVal = parseInt(hashrateMinRange.value);
    const maxVal = parseInt(hashrateMaxRange.value);
    hashrateMinValue.textContent = minVal;
    hashrateMaxValue.textContent = maxVal;

    const isDefault = (minVal === 9 && maxVal === 20000);

    if (!isDefault) {
        const displayText = `Хешрейт: от ${minVal} до ${maxVal}`;
        const existingFilter = activeFilters.find(f => f.type === 'hashrate');
        if (existingFilter) {
            existingFilter.displayText = displayText;
            existingFilter.value = `${minVal}-${maxVal}`;
        } else {
            addFilter('hashrate', `${minVal}-${maxVal}`, displayText);
        }
    } else {
        const hashrateFilter = activeFilters.find(f => f.type === 'hashrate');
        if (hashrateFilter) {
            removeFilterById(hashrateFilter.id);
        }
    }
    updateActiveFiltersDisplay();
}

if (hashrateMinRange && hashrateMaxRange) {
    hashrateMinRange.addEventListener('input', function () {
        if (parseInt(hashrateMinRange.value) > parseInt(hashrateMaxRange.value)) {
            hashrateMinRange.value = hashrateMaxRange.value;
        }
        updateHashrateFilter();
    });

    hashrateMaxRange.addEventListener('input', function () {
        if (parseInt(hashrateMaxRange.value) < parseInt(hashrateMinRange.value)) {
            hashrateMaxRange.value = hashrateMinRange.value;
        }
        updateHashrateFilter();
    });
}

// Слайдер потребления
const powerMinRange = document.getElementById('powerMinRange');
const powerMaxRange = document.getElementById('powerMaxRange');
const powerMinValue = document.getElementById('powerMinValue');
const powerMaxValue = document.getElementById('powerMaxValue');

function updatePowerFilter() {
    const minVal = parseInt(powerMinRange.value);
    const maxVal = parseInt(powerMaxRange.value);
    powerMinValue.textContent = minVal;
    powerMaxValue.textContent = maxVal;

    const isDefault = (minVal === 800 && maxVal === 11180);

    if (!isDefault) {
        const displayText = `Потребление: от ${minVal} до ${maxVal} Вт/ч`;
        const existingFilter = activeFilters.find(f => f.type === 'power');
        if (existingFilter) {
            existingFilter.displayText = displayText;
            existingFilter.value = `${minVal}-${maxVal}`;
        } else {
            addFilter('power', `${minVal}-${maxVal}`, displayText);
        }
    } else {
        const powerFilter = activeFilters.find(f => f.type === 'power');
        if (powerFilter) {
            removeFilterById(powerFilter.id);
        }
    }
    updateActiveFiltersDisplay();
}

if (powerMinRange && powerMaxRange) {
    powerMinRange.addEventListener('input', function () {
        if (parseInt(powerMinRange.value) > parseInt(powerMaxRange.value)) {
            powerMinRange.value = powerMaxRange.value;
        }
        updatePowerFilter();
    });

    powerMaxRange.addEventListener('input', function () {
        if (parseInt(powerMaxRange.value) < parseInt(powerMinRange.value)) {
            powerMaxRange.value = powerMinRange.value;
        }
        updatePowerFilter();
    });
}




// меню по кнопкам 
function initMobileMenuFilterSub() {
    // Конфигурация фильтров
    const filters = [
        { id: 'Sort', openBtnId: 'mobileMenuPSortOpen', menuId: 'mobileMenuFilterSort', overlayId: 'mobileMenuOverlayFilterSort', closeId: 'mobileMenuCloseFilterSort', type: 'sort' },
        { id: 'Price', openBtnId: 'mobileMenuPriceOpen', menuId: 'mobileMenuFilterPrice', overlayId: 'mobileMenuOverlayFilterPrice', closeId: 'mobileMenuCloseFilterPrice', type: 'range' },
        { id: 'Brand', openBtnId: 'mobileMenuBrandOpen', menuId: 'mobileMenuFilterBrand', overlayId: 'mobileMenuOverlayFilterBrand', closeId: 'mobileMenuCloseFilterBrand', type: 'checkbox' },
        { id: 'Hash', openBtnId: 'mobileMenuHashOpen', menuId: 'mobileMenuFilterHash', overlayId: 'mobileMenuOverlayFilterHash', closeId: 'mobileMenuCloseFilterHash', type: 'range' },
        { id: 'Alg', openBtnId: 'mobileMenuAlgOpen', menuId: 'mobileMenuFilterAlg', overlayId: 'mobileMenuOverlayFilterAlg', closeId: 'mobileMenuCloseFilterAlg', type: 'checkbox' },
        { id: 'Prib', openBtnId: 'mobileMenuPribOpen', menuId: 'mobileMenuFilterPrib', overlayId: 'mobileMenuOverlayFilterPrib', closeId: 'mobileMenuCloseFilterPrib', type: 'switch' },
        { id: 'Mosn', openBtnId: 'mobileMenuMosnOpen', menuId: 'mobileMenuFilterMosn', overlayId: 'mobileMenuOverlayFilterMosn', closeId: 'mobileMenuCloseFilterMosn', type: 'switch' },
        { id: 'Bets', openBtnId: 'mobileMenuBetsOpen', menuId: 'mobileMenuFilterBets', overlayId: 'mobileMenuOverlayFilterBets', closeId: 'mobileMenuCloseFilterBets', type: 'switch' },
        { id: 'Skidka', openBtnId: 'mobileMenuSkidkaOpen', menuId: 'mobileMenuFilterSkidka', overlayId: 'mobileMenuOverlayFilterSkidka', closeId: 'mobileMenuCloseFilterSkidka', type: 'switch' },
        { id: 'Special', openBtnId: 'mobileMenuSpecialOpen', menuId: 'mobileMenuFilterSpecial', overlayId: 'mobileMenuOverlayFilterSpecial', closeId: 'mobileMenuCloseFilterSpecial', type: 'checkbox' },
        { id: 'Money', openBtnId: 'mobileMenuMoneyOpen', menuId: 'mobileMenuFilterMoney', overlayId: 'mobileMenuOverlayFilterMoney', closeId: 'mobileMenuCloseFilterMoney', type: 'checkbox' },
        { id: 'Potreb', openBtnId: 'mobileMenuPotrebOpen', menuId: 'mobileMenuFilterPotreb', overlayId: 'mobileMenuOverlayFilterPotreb', closeId: 'mobileMenuCloseFilterPotreb', type: 'range' },
        { id: 'Sost', openBtnId: 'mobileMenuSostOpen', menuId: 'mobileMenuFilterSost', overlayId: 'mobileMenuOverlayFilterSost', closeId: 'mobileMenuCloseFilterSost', type: 'checkbox' }
    ];

    let activeMenu = null;
    let isMenuOpen = false;


    function getActiveSortValue(menuElement) {
        const active = menuElement.querySelector('.custom-select-option.active');
        return active ? active.dataset.value : null;
    }


    // Хранилище исходных значений для каждого меню
    const originalValues = new Map();

    // === ФУНКЦИИ СИНХРОНИЗАЦИИ ИЗ ОСНОВНОГО МЕНЮ В ПОДМЕНЮ (ПРИ ОТКРЫТИИ) ===

    function syncSubRangeWithMain(menuId) {
        // Синхронизация цены
        if (menuId === 'mobileMenuFilterPrice') {
            const priceMinMain = document.getElementById('priceMinRangeMobile');
            const priceMaxMain = document.getElementById('priceMaxRangeMobile');
            const priceMinSub = document.querySelector('#mobileMenuFilterPrice .minRange');
            const priceMaxSub = document.querySelector('#mobileMenuFilterPrice .maxRange');
            const priceMinNumSub = document.querySelector('#mobileMenuFilterPrice .c-p-filter:first-child .c-p-filter-num');
            const priceMaxNumSub = document.querySelector('#mobileMenuFilterPrice .c-p-filter:last-child .c-p-filter-num');

            if (priceMinMain && priceMinSub) {
                priceMinSub.value = priceMinMain.value;
                priceMaxSub.value = priceMaxMain.value;
                if (priceMinNumSub) priceMinNumSub.textContent = priceMinMain.value;
                if (priceMaxNumSub) priceMaxNumSub.textContent = priceMaxMain.value;

                // Обновляем трек ползунка
                const track = document.querySelector('#mobileMenuFilterPrice .range-track');
                if (track) {
                    const min = parseFloat(priceMinSub.min);
                    const max = parseFloat(priceMaxSub.max);
                    const minVal = parseFloat(priceMinSub.value);
                    const maxVal = parseFloat(priceMaxSub.value);
                    const minPercent = ((minVal - min) / (max - min)) * 100;
                    const maxPercent = ((maxVal - min) / (max - min)) * 100;
                    track.style.background = `linear-gradient(to right, #E5E7EB ${minPercent}%, #2563EB ${minPercent}%, #2563EB ${maxPercent}%, #E5E7EB ${maxPercent}%)`;
                }
            }
        }

        // Синхронизация хешрейта
        if (menuId === 'mobileMenuFilterHash') {
            const hashMinMain = document.getElementById('hashrateMinRangeMobile');
            const hashMaxMain = document.getElementById('hashrateMaxRangeMobile');
            const hashMinSub = document.querySelector('#mobileMenuFilterHash .minRange');
            const hashMaxSub = document.querySelector('#mobileMenuFilterHash .maxRange');
            const hashMinNumSub = document.querySelector('#mobileMenuFilterHash .c-p-filter:first-child .c-p-filter-num');
            const hashMaxNumSub = document.querySelector('#mobileMenuFilterHash .c-p-filter:last-child .c-p-filter-num');

            if (hashMinMain && hashMinSub) {
                hashMinSub.value = hashMinMain.value;
                hashMaxSub.value = hashMaxMain.value;
                if (hashMinNumSub) hashMinNumSub.textContent = hashMinMain.value;
                if (hashMaxNumSub) hashMaxNumSub.textContent = hashMaxMain.value;

                const track = document.querySelector('#mobileMenuFilterHash .range-track');
                if (track) {
                    const min = parseFloat(hashMinSub.min);
                    const max = parseFloat(hashMaxSub.max);
                    const minVal = parseFloat(hashMinSub.value);
                    const maxVal = parseFloat(hashMaxSub.value);
                    const minPercent = ((minVal - min) / (max - min)) * 100;
                    const maxPercent = ((maxVal - min) / (max - min)) * 100;
                    track.style.background = `linear-gradient(to right, #E5E7EB ${minPercent}%, #2563EB ${minPercent}%, #2563EB ${maxPercent}%, #E5E7EB ${maxPercent}%)`;
                }
            }
        }

        // Синхронизация потребления
        if (menuId === 'mobileMenuFilterPotreb') {
            const powerMinMain = document.getElementById('powerMinRangeMobile');
            const powerMaxMain = document.getElementById('powerMaxRangeMobile');
            const powerMinSub = document.querySelector('#mobileMenuFilterPotreb .minRange');
            const powerMaxSub = document.querySelector('#mobileMenuFilterPotreb .maxRange');
            const powerMinNumSub = document.querySelector('#mobileMenuFilterPotreb .c-p-filter:first-child .c-p-filter-num');
            const powerMaxNumSub = document.querySelector('#mobileMenuFilterPotreb .c-p-filter:last-child .c-p-filter-num');

            if (powerMinMain && powerMinSub) {
                powerMinSub.value = powerMinMain.value;
                powerMaxSub.value = powerMaxMain.value;
                if (powerMinNumSub) powerMinNumSub.textContent = powerMinMain.value;
                if (powerMaxNumSub) powerMaxNumSub.textContent = powerMaxMain.value;

                const track = document.querySelector('#mobileMenuFilterPotreb .range-track');
                if (track) {
                    const min = parseFloat(powerMinSub.min);
                    const max = parseFloat(powerMaxSub.max);
                    const minVal = parseFloat(powerMinSub.value);
                    const maxVal = parseFloat(powerMaxSub.value);
                    const minPercent = ((minVal - min) / (max - min)) * 100;
                    const maxPercent = ((maxVal - min) / (max - min)) * 100;
                    track.style.background = `linear-gradient(to right, #E5E7EB ${minPercent}%, #2563EB ${minPercent}%, #2563EB ${maxPercent}%, #E5E7EB ${maxPercent}%)`;
                }
            }
        }
    }

    function syncSubCheckboxWithMain(menuId) {
        // Синхронизация чекбоксов брендов
        if (menuId === 'mobileMenuFilterBrand') {
            const mainBrands = document.querySelectorAll('.brand-checkbox-mobile');
            const subBrands = document.querySelectorAll('#mobileMenuFilterBrand .checkbox');
            subBrands.forEach((sub, index) => {
                if (mainBrands[index] && sub.checked !== mainBrands[index].checked) {
                    sub.checked = mainBrands[index].checked;
                }
            });
        }

        // Синхронизация чекбоксов алгоритмов
        if (menuId === 'mobileMenuFilterAlg') {
            const mainAlgs = document.querySelectorAll('.alg-checkbox-mobile');
            const subAlgs = document.querySelectorAll('#mobileMenuFilterAlg .checkbox');
            subAlgs.forEach((sub, index) => {
                if (mainAlgs[index] && sub.checked !== mainAlgs[index].checked) {
                    sub.checked = mainAlgs[index].checked;
                }
            });
        }

        // Синхронизация чекбоксов монет
        if (menuId === 'mobileMenuFilterMoney') {
            const mainMoney = document.querySelectorAll('.coin-checkbox-mobile');
            const subMoney = document.querySelectorAll('#mobileMenuFilterMoney .checkbox');
            subMoney.forEach((sub, index) => {
                if (mainMoney[index] && sub.checked !== mainMoney[index].checked) {
                    sub.checked = mainMoney[index].checked;
                }
            });
        }

        // Синхронизация чекбоксов спецпредложений
        if (menuId === 'mobileMenuFilterSpecial') {
            const mainSpecial = document.querySelectorAll('.special-checkbox-mobile');
            const subSpecial = document.querySelectorAll('#mobileMenuFilterSpecial .checkbox');
            subSpecial.forEach((sub, index) => {
                if (mainSpecial[index] && sub.checked !== mainSpecial[index].checked) {
                    sub.checked = mainSpecial[index].checked;
                }
            });
        }

        // Синхронизация чекбоксов состояния
        if (menuId === 'mobileMenuFilterSost') {
            const mainSost = document.querySelectorAll('.condition-checkbox-mobile');
            const subSost = document.querySelectorAll('#mobileMenuFilterSost .checkbox');
            subSost.forEach((sub, index) => {
                if (mainSost[index] && sub.checked !== mainSost[index].checked) {
                    sub.checked = mainSost[index].checked;
                }
            });
        }
    }

    function syncSubToggleWithMain() {
        const mainToggles = document.querySelectorAll('.filter-box-phone .toggle-filter');

        mainToggles.forEach(mainToggle => {
            const toggleName = mainToggle.dataset.filterName;
            let subToggle = null;

            switch (toggleName) {
                case 'Самый прибыльный':
                    subToggle = document.querySelector('#mobileMenuFilterPrib .toggle-filter');
                    break;
                case 'Самый мощный':
                    subToggle = document.querySelector('#mobileMenuFilterMosn .toggle-filter');
                    break;
                case 'Бестселлер':
                    subToggle = document.querySelector('#mobileMenuFilterBets .toggle-filter');
                    break;
                case 'Скидка':
                    subToggle = document.querySelector('#mobileMenuFilterSkidka .toggle-filter');
                    break;
            }

            if (subToggle && subToggle.checked !== mainToggle.checked) {
                subToggle.checked = mainToggle.checked;
                subToggle.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // === ФУНКЦИИ СИНХРОНИЗАЦИИ ИЗ ПОДМЕНЮ В ОСНОВНОЕ (ПРИ ПРИМЕНЕНИИ) ===

    function syncMainRangeFromSub(menuId) {
        if (menuId === 'mobileMenuFilterPrice') {
            const priceMinSub = document.querySelector('#mobileMenuFilterPrice .minRange');
            const priceMaxSub = document.querySelector('#mobileMenuFilterPrice .maxRange');
            const priceMinMain = document.getElementById('priceMinRangeMobile');
            const priceMaxMain = document.getElementById('priceMaxRangeMobile');
            const priceMinValue = document.getElementById('priceMinValueMobile');
            const priceMaxValue = document.getElementById('priceMaxValueMobile');

            if (priceMinSub && priceMinMain) {
                priceMinMain.value = priceMinSub.value;
                priceMaxMain.value = priceMaxSub.value;
                if (priceMinValue) priceMinValue.textContent = priceMinSub.value;
                if (priceMaxValue) priceMaxValue.textContent = priceMaxSub.value;

                priceMinMain.dispatchEvent(new Event('input', { bubbles: true }));
                priceMaxMain.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        if (menuId === 'mobileMenuFilterHash') {
            const hashMinSub = document.querySelector('#mobileMenuFilterHash .minRange');
            const hashMaxSub = document.querySelector('#mobileMenuFilterHash .maxRange');
            const hashMinMain = document.getElementById('hashrateMinRangeMobile');
            const hashMaxMain = document.getElementById('hashrateMaxRangeMobile');
            const hashMinValue = document.getElementById('hashrateMinValueMobile');
            const hashMaxValue = document.getElementById('hashrateMaxValueMobile');

            if (hashMinSub && hashMinMain) {
                hashMinMain.value = hashMinSub.value;
                hashMaxMain.value = hashMaxSub.value;
                if (hashMinValue) hashMinValue.textContent = hashMinSub.value;
                if (hashMaxValue) hashMaxValue.textContent = hashMaxSub.value;

                hashMinMain.dispatchEvent(new Event('input', { bubbles: true }));
                hashMaxMain.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        if (menuId === 'mobileMenuFilterPotreb') {
            const powerMinSub = document.querySelector('#mobileMenuFilterPotreb .minRange');
            const powerMaxSub = document.querySelector('#mobileMenuFilterPotreb .maxRange');
            const powerMinMain = document.getElementById('powerMinRangeMobile');
            const powerMaxMain = document.getElementById('powerMaxRangeMobile');
            const powerMinValue = document.getElementById('powerMinValueMobile');
            const powerMaxValue = document.getElementById('powerMaxValueMobile');

            if (powerMinSub && powerMinMain) {
                powerMinMain.value = powerMinSub.value;
                powerMaxMain.value = powerMaxSub.value;
                if (powerMinValue) powerMinValue.textContent = powerMinSub.value;
                if (powerMaxValue) powerMaxValue.textContent = powerMaxSub.value;

                powerMinMain.dispatchEvent(new Event('input', { bubbles: true }));
                powerMaxMain.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    function syncMainCheckboxFromSub(menuId) {
        if (menuId === 'mobileMenuFilterBrand') {
            const subBrands = document.querySelectorAll('#mobileMenuFilterBrand .checkbox');
            const mainBrands = document.querySelectorAll('.brand-checkbox-mobile');
            subBrands.forEach((sub, index) => {
                if (mainBrands[index]) {
                    mainBrands[index].checked = sub.checked;
                    mainBrands[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        if (menuId === 'mobileMenuFilterAlg') {
            const subAlgs = document.querySelectorAll('#mobileMenuFilterAlg .checkbox');
            const mainAlgs = document.querySelectorAll('.alg-checkbox-mobile');
            subAlgs.forEach((sub, index) => {
                if (mainAlgs[index]) {
                    mainAlgs[index].checked = sub.checked;
                    mainAlgs[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        if (menuId === 'mobileMenuFilterMoney') {
            const subMoney = document.querySelectorAll('#mobileMenuFilterMoney .checkbox');
            const mainMoney = document.querySelectorAll('.coin-checkbox-mobile');
            subMoney.forEach((sub, index) => {
                if (mainMoney[index]) {
                    mainMoney[index].checked = sub.checked;
                    mainMoney[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        if (menuId === 'mobileMenuFilterSpecial') {
            const subSpecial = document.querySelectorAll('#mobileMenuFilterSpecial .checkbox');
            const mainSpecial = document.querySelectorAll('.special-checkbox-mobile');
            subSpecial.forEach((sub, index) => {
                if (mainSpecial[index]) {
                    mainSpecial[index].checked = sub.checked;
                    mainSpecial[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        if (menuId === 'mobileMenuFilterSost') {
            const subSost = document.querySelectorAll('#mobileMenuFilterSost .checkbox');
            const mainSost = document.querySelectorAll('.condition-checkbox-mobile');
            subSost.forEach((sub, index) => {
                if (mainSost[index]) {
                    mainSost[index].checked = sub.checked;
                    mainSost[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }
    }

    function syncMainToggleFromSub(menuId) {
        let subToggle = null;
        let mainToggle = null;

        switch (menuId) {
            case 'mobileMenuFilterPrib':
                subToggle = document.querySelector('#mobileMenuFilterPrib .toggle-filter');
                mainToggle = document.querySelector('.filter-box-phone .toggle-filter[data-filter-name="Самый прибыльный"]');
                break;
            case 'mobileMenuFilterMosn':
                subToggle = document.querySelector('#mobileMenuFilterMosn .toggle-filter');
                mainToggle = document.querySelector('.filter-box-phone .toggle-filter[data-filter-name="Самый мощный"]');
                break;
            case 'mobileMenuFilterBets':
                subToggle = document.querySelector('#mobileMenuFilterBets .toggle-filter');
                mainToggle = document.querySelector('.filter-box-phone .toggle-filter[data-filter-name="Бестселлер"]');
                break;
            case 'mobileMenuFilterSkidka':
                subToggle = document.querySelector('#mobileMenuFilterSkidka .toggle-filter');
                mainToggle = document.querySelector('.filter-box-phone .toggle-filter[data-filter-name="Скидка"]');
                break;
        }

        if (subToggle && mainToggle && mainToggle.checked !== subToggle.checked) {
            mainToggle.checked = subToggle.checked;
            mainToggle.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // === ОСНОВНЫЕ ФУНКЦИИ ===

    function saveOriginalValues(menuElement, filterType) {
        const values = {};

        if (filterType === 'range') {
            const minInput = menuElement.querySelector('input[type="range"].minRange, input[type="range"]:first-of-type');
            const maxInput = menuElement.querySelector('input[type="range"].maxRange, input[type="range"]:last-of-type');
            if (minInput && maxInput) {
                values.min = minInput.value;
                values.max = maxInput.value;
                values.minDefault = minInput.min;
                values.maxDefault = maxInput.max;
            }
        } else if (filterType === 'checkbox') {
            const checkboxes = menuElement.querySelectorAll('input[type="checkbox"]');
            values.checkboxes = Array.from(checkboxes).map(cb => cb.checked);
        } else if (filterType === 'switch') {
            const switches = menuElement.querySelectorAll('.switch input[type="checkbox"]');
            values.switches = Array.from(switches).map(s => s.checked);
        } else if (filterType === 'sort') {
            const activeOption = menuElement.querySelector('.custom-select-option.active');
            values.activeValue = activeOption ? activeOption.getAttribute('data-value') : null;
        }

        originalValues.set(menuElement.id, values);
    }
    function resetFilter(menuElement, filterType) {
        if (filterType === 'range') {
            const minInput = menuElement.querySelector('input[type="range"].minRange, input[type="range"]:first-of-type');
            const maxInput = menuElement.querySelector('input[type="range"].maxRange, input[type="range"]:last-of-type');
            if (minInput && maxInput) {
                minInput.value = parseFloat(minInput.min);
                maxInput.value = parseFloat(maxInput.max);
                const minDisplay = menuElement.querySelector('.c-p-filter:first-child .c-p-filter-num');
                const maxDisplay = menuElement.querySelector('.c-p-filter:last-child .c-p-filter-num');
                if (minDisplay) minDisplay.textContent = minInput.min;
                if (maxDisplay) maxDisplay.textContent = maxInput.max;
                minInput.dispatchEvent(new Event('input', { bubbles: true }));
                maxInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (filterType === 'checkbox') {
            menuElement.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
        } else if (filterType === 'switch') {
            menuElement.querySelectorAll('.switch input[type="checkbox"]').forEach(s => { s.checked = false; });
        } else if (filterType === 'sort') {
            const options = menuElement.querySelectorAll('.custom-select-option');
            const defaultOption = menuElement.querySelector('.custom-select-option[data-default="true"]');
            options.forEach(opt => {
                opt.classList.remove('active');
                if (defaultOption && opt === defaultOption) opt.classList.add('active');
            });
        }

        const resetBtn = menuElement.querySelector('.mobile-menu-reset');
        if (resetBtn) resetBtn.style.display = 'none';

        // Только обновляем отображение внутри подменю — НЕ применяем к системе
        if (typeof updateMobileActiveFiltersDisplay === 'function') {
            updateMobileActiveFiltersDisplay();
        }
    }

    // Вспомогательная функция для получения типа фильтра по ID меню
    function getFilterTypeFromMenuId(menuId) {
        switch (menuId) {
            case 'mobileMenuFilterBrand': return 'brand';
            case 'mobileMenuFilterAlg': return 'algorithm';
            case 'mobileMenuFilterMoney': return 'coin';
            case 'mobileMenuFilterSpecial': return 'special';
            case 'mobileMenuFilterSost': return 'condition';
            case 'mobileMenuFilterPrib': return 'toggle';
            case 'mobileMenuFilterMosn': return 'toggle';
            case 'mobileMenuFilterBets': return 'toggle';
            case 'mobileMenuFilterSkidka': return 'toggle';
            case 'mobileMenuFilterPrice': return 'price';
            case 'mobileMenuFilterHash': return 'hashrate';
            case 'mobileMenuFilterPotreb': return 'power';
            default: return null;
        }
    }

    function updateResetButton(menuElement, filterType) {
        const resetBtn = menuElement.querySelector('.mobile-menu-reset');
        if (!resetBtn) return;

        let hasChanges = false;

        if (filterType === 'range') {
            const minInput = menuElement.querySelector('input[type="range"].minRange, input[type="range"]:first-of-type');
            const maxInput = menuElement.querySelector('input[type="range"].maxRange, input[type="range"]:last-of-type');
            if (minInput && maxInput) {
                // Проверяем, отличаются ли текущие значения от дефолтных
                const isDefault = (parseFloat(minInput.value) === parseFloat(minInput.min) &&
                    parseFloat(maxInput.value) === parseFloat(maxInput.max));
                hasChanges = !isDefault;
            }
        } else if (filterType === 'checkbox') {
            const checkboxes = menuElement.querySelectorAll('input[type="checkbox"]');
            // Проверяем, есть ли хоть один отмеченный чекбокс
            hasChanges = Array.from(checkboxes).some(cb => cb.checked === true);
        } else if (filterType === 'switch') {
            const switches = menuElement.querySelectorAll('.switch input[type="checkbox"]');
            // Проверяем, есть ли хоть один включенный переключатель
            hasChanges = Array.from(switches).some(s => s.checked === true);
        } else if (filterType === 'sort') {
            const activeOption = menuElement.querySelector('.custom-select-option.active');
            const defaultOption = menuElement.querySelector('.custom-select-option[data-default="true"]');
            const currentValue = activeOption ? activeOption.getAttribute('data-value') : null;
            const defaultValue = defaultOption ? defaultOption.getAttribute('data-value') : null;
            hasChanges = currentValue !== defaultValue;
        }

        resetBtn.style.display = hasChanges ? 'flex' : 'none';
    }
    function applyFilter(menuElement, filterType) {
        saveOriginalValues(menuElement, filterType);
        const resetBtn = menuElement.querySelector('.mobile-menu-reset');
        if (resetBtn) resetBtn.style.display = 'none';
    }

    function closeAllMenus() {
        if (activeMenu) {
            activeMenu.classList.remove('active');
            const overlay = document.getElementById(activeMenu.getAttribute('data-overlay-id'));
            if (overlay) overlay.classList.remove('active');
        }
        filters.forEach(filter => {
            const menu = document.getElementById(filter.menuId);
            const overlay = document.getElementById(filter.overlayId);
            if (menu) menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
        document.body.style.overflow = '';
        activeMenu = null;
        isMenuOpen = false;
    }

    function openMenu(menuElement, overlayElement, filterType, menuId) {
        closeAllMenus();
        if (menuElement) {
            // Синхронизируем значения из основного меню в подменю перед открытием
            if (filterType === 'range') {
                syncSubRangeWithMain(menuId);
            } else if (filterType === 'checkbox') {
                syncSubCheckboxWithMain(menuId);
            } else if (filterType === 'switch') {
                syncSubToggleWithMain();
            }

            menuElement.classList.add('active');
            menuElement.setAttribute('data-overlay-id', overlayElement.id);
            activeMenu = menuElement;
            saveOriginalValues(menuElement, filterType);
            updateResetButton(menuElement, filterType); // Обновлено для проверки наличия любых отметок
        }
        if (overlayElement) overlayElement.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
    }

    function attachChangeListeners(menuElement, filterType) {
        if (filterType === 'range') {
            const inputs = menuElement.querySelectorAll('input[type="range"]');
            inputs.forEach(input => {
                input.addEventListener('input', () => updateResetButton(menuElement, filterType));
                input.addEventListener('input', function () {
                    const isMin = this.classList.contains('minRange') ||
                        (menuElement.querySelectorAll('input[type="range"]')[0] === this);
                    const displayElement = isMin ?
                        menuElement.querySelector('.c-p-filter:first-child .c-p-filter-num') :
                        menuElement.querySelector('.c-p-filter:last-child .c-p-filter-num');
                    if (displayElement) displayElement.textContent = this.value;
                });
            });
        } else if (filterType === 'checkbox') {
            const checkboxes = menuElement.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => updateResetButton(menuElement, filterType));
            });
        } else if (filterType === 'switch') {
            const switches = menuElement.querySelectorAll('.switch input[type="checkbox"]');
            switches.forEach(s => {
                s.addEventListener('change', () => updateResetButton(menuElement, filterType));
            });
        } else if (filterType === 'sort') {
            const options = menuElement.querySelectorAll('.custom-select-option');

            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    options.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                });
            });

        }
    }

    // === НАСТРОЙКА ОБРАБОТЧИКОВ ДЛЯ КАЖДОГО ФИЛЬТРА ===
    filters.forEach(filter => {
        const openBtn = document.getElementById(filter.openBtnId);
        const menu = document.getElementById(filter.menuId);
        const overlay = document.getElementById(filter.overlayId);
        const closeBtn = document.getElementById(filter.closeId);
        const applyBtn = menu ? menu.querySelector('.cat-page-menu-mobile-btns .mobile-btn') : null;
        const resetBtn = menu ? menu.querySelector('.mobile-menu-reset') : null;

        if (openBtn && menu && overlay) {
            openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isMenuOpen && activeMenu === menu) {
                    closeAllMenus();
                } else {
                    openMenu(menu, overlay, filter.type, filter.menuId);
                }
            });
        }

        if (closeBtn && menu && overlay) {
            closeBtn.addEventListener('click', () => {
                closeAllMenus();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                closeAllMenus();
            });
        }

        // Кнопка "Применить" - синхронизируем изменения в основное меню
        if (applyBtn && menu) {
            const newApplyBtn = applyBtn.cloneNode(true);
            applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
            newApplyBtn.addEventListener('click', (e) => {
                e.preventDefault();

                // SORT логика
                if (filter.type === 'sort') {
                    const value = getActiveSortValue(menu);
                    const openBtn = document.getElementById(filter.openBtnId);



                    if (openBtn) {
                        openBtn.dataset.sortValue = value;

                        if (value) {
                            openBtn.classList.add('active');
                        } else {
                            openBtn.classList.remove('active');
                        }
                    }
                }

                if (filter.type === 'range') {
                    syncMainRangeFromSub(filter.menuId);
                } else if (filter.type === 'checkbox') {
                    syncMainCheckboxFromSub(filter.menuId);
                } else if (filter.type === 'switch') {
                    syncMainToggleFromSub(filter.menuId);
                }

                applyFilter(menu, filter.type);

                // Применяем к системе только здесь
                if (typeof window.applyMobileFilters === 'function') {
                    window.applyMobileFilters();
                }

                closeAllMenus();
            });
        }

        if (resetBtn && menu) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetFilter(menu, filter.type);
            });
        }

        if (menu) {
            attachChangeListeners(menu, filter.type);
        }
    });
    function initAllResetButtons() {
        filters.forEach(filter => {
            const menu = document.getElementById(filter.menuId);
            if (menu) {
                const resetBtn = menu.querySelector('.mobile-menu-reset');
                if (resetBtn) {
                    // Удаляем старый обработчик
                    const newResetBtn = resetBtn.cloneNode(true);
                    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);

                    newResetBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        resetFilter(menu, filter.type);
                    });
                }
            }
        });
    }

    // Вызовите эту функцию в конце initMobileMenuFilterSub, перед initSubMenuToggleHandlers()
    initAllResetButtons();

    function initSubMenuToggleHandlers() {
        const subToggles = document.querySelectorAll('#mobileMenuFilterPrib .toggle-filter, #mobileMenuFilterMosn .toggle-filter, #mobileMenuFilterBets .toggle-filter, #mobileMenuFilterSkidka .toggle-filter');

        subToggles.forEach(subToggle => {
            // Удаляем старый обработчик, если есть
            const newSubToggle = subToggle.cloneNode(true);
            subToggle.parentNode.replaceChild(newSubToggle, subToggle);

            newSubToggle.addEventListener('change', function () {
                // Обновляем только отображение кнопки сброса, НЕ синхронизируем с основным меню
                const menu = this.closest('.mobile-menu');
                if (menu) {
                    const resetBtn = menu.querySelector('.mobile-menu-reset');
                    if (resetBtn) {
                        // Показываем кнопку сброса, так как есть изменения
                        resetBtn.style.display = 'flex';
                    }
                }
            });
        });
    }

    initSubMenuToggleHandlers();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeAllMenus();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenuFilter();
    initMobileMenuFilterSub();
    initMobileFilterButtons();
    initBrandButtonsSync(); initPcResetButton();
    initMobileResetFunction();
});

// Автоподстановка продукта и цены в поля формы + запрет ручного ввода
function initAutoFillProductInputs() {

    // блокировка ручного ввода
    function lockInput(input) {
        if (!input) return;

        input.readOnly = true;
        input.style.cursor = 'pointer';

        input.addEventListener('keydown', e => e.preventDefault());
        input.addEventListener('paste', e => e.preventDefault());
        input.addEventListener('input', e => e.preventDefault());
    }

    // получить название товара
    function getProductName(card) {
        return (
            card.querySelector('.ch-item-desc')?.textContent.trim() ||
            card.querySelector('.featured-image-title')?.textContent.trim() ||
            ''
        );
    }

    // получить цену


    // заполнение модалки
    function fillModal(modalName, card) {
        if (!card) return;

        const modal = document.querySelector(
            `.modal-overlay[data-modal-overlay="${modalName}"]`
        );

        if (!modal) return;

        const productInput = modal.querySelector('input[data-type="product"]');
        const priceInput = modal.querySelector('input[data-type="product-price"]');

        const productName = getProductName(card);


        lockInput(productInput);
        lockInput(priceInput);

        if (productInput) productInput.value = productName;

    }

    // ВСЕ кнопки модалок
    const buttons = document.querySelectorAll(
        '[data-modal="zakaz"], [data-modal="findPrice"]'
    );

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {

            const modalName = this.dataset.modal;

            // карточка товара
            const card =
                this.closest('.ch-item') ||
                this.closest('.featured-image');

            fillModal(modalName, card);
        });
    });
}

document.addEventListener('DOMContentLoaded', initAutoFillProductInputs);

// ========== ВЗАИМНОЕ ЗАКРЫТИЕ ПОИСКА И КАТАЛОГА ==========
// Функция для запрета скролла фона
function disableBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

// Функция для включения скролла фона
function enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Закрытие поиска (десктоп + мобильный)
window.closeAllSearch = function () {
    // Десктопный поиск
    const headerNav = document.getElementById('headerNav');
    const searchResults = document.getElementById('searchResults');
    const searchForm = document.getElementById('headerSearchForm');
    const openSearchBtn = document.getElementById('openSearch');
    const headerCenter = document.getElementById('headerCenter');
    const headerSearchBox = document.querySelector('.header-search-box');
    const searchInput = document.getElementById('searchInput');
    const searchOverlay = document.querySelector('.search-overlay');

    if (searchForm && searchForm.classList.contains('active')) {
        if (headerNav) headerNav.classList.remove('hidden');
        if (searchResults) searchResults.classList.remove('active');
        if (searchForm) searchForm.classList.remove('active');
        if (openSearchBtn) openSearchBtn.style.display = '';
        if (headerCenter) headerCenter.style.width = '';
        if (headerSearchBox) headerSearchBox.classList.remove('search-active');
        if (searchInput) searchInput.value = '';
        if (searchOverlay) {
            searchOverlay.style.opacity = '0';
            searchOverlay.style.visibility = 'hidden';
        }
        document.querySelector('header').style.position = '';
        document.querySelector('header').style.zIndex = '';

        // Включаем скролл фона
        enableBodyScroll();
    }
};

// Закрытие каталога
window.closeAllCatalogs = function () {
    const menuBoxContainer = document.querySelector('.menu-box-container');
    const catalogBtn = document.getElementById('catalogBtn');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuBoxContainer && menuBoxContainer.classList.contains('active')) {
        if (menuBoxContainer) menuBoxContainer.classList.remove('active');
        if (catalogBtn) catalogBtn.classList.remove('active');
        if (menuOverlay) {
            menuOverlay.style.opacity = '0';
            menuOverlay.style.visibility = 'hidden';
        }

        // Убираем блюр
        const mainContent = document.querySelector('main');
        const footer = document.querySelector('footer');
        if (mainContent) mainContent.style.filter = '';
        if (footer) footer.style.filter = '';

        // Включаем скролл фона
        enableBodyScroll();
    }

    // Закрываем навигационные меню
    const navContainers = document.querySelectorAll('.nav-btn-container.active');
    navContainers.forEach(container => {
        container.classList.remove('active');
        const button = container.querySelector('.h-nav-btn');
        if (button) button.classList.remove('active');
    });
};

// Открытие поиска 
function openSearchHandler() {
    closeAllCatalogs();
    disableBodyScroll();
    // остальной код открытия поиска...
}

// Открытие каталога 
function openCatalogHandler() {
    closeAllSearch();
    disableBodyScroll();
    // остальной код открытия каталога...
}

// Открытие навигационного меню
function openNavMenu(menuId) {
    closeAllSearch();
    disableBodyScroll();
    // остальной код открытия меню...
}

// Перехватываем клик по кнопке каталога
const catalogBtnElem = document.getElementById('catalogBtn');
if (catalogBtnElem) {
    catalogBtnElem.addEventListener('click', (e) => {
        window.closeAllSearch();
        // Проверяем, открывается ли каталог
        const menuBoxContainer = document.querySelector('.menu-box-container');
        if (menuBoxContainer && !menuBoxContainer.classList.contains('active')) {
            disableBodyScroll();
        } else {
            enableBodyScroll();
        }
    }, true);
}

// Перехватываем клик по кнопке поиска
const openSearchElem = document.getElementById('openSearch');
if (openSearchElem) {
    openSearchElem.addEventListener('click', (e) => {
        window.closeAllCatalogs();
        const searchForm = document.getElementById('headerSearchForm');
        if (searchForm && !searchForm.classList.contains('active')) {
            disableBodyScroll();
        } else {
            enableBodyScroll();
        }
    }, true);
}



// Перехватываем клики по навигационным кнопкам
const navButtonsList = ['h-btn-products', 'h-btn-services', 'h-btn-company', 'h-btn-news'];
navButtonsList.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', () => {
            window.closeAllSearch();
            // Проверяем, открывается ли меню
            const btnContainer = btn.closest('.nav-btn-container');
            if (btnContainer && !btnContainer.classList.contains('active')) {
                disableBodyScroll();
            } else {
                enableBodyScroll();
            }
        }, true);
    }
});

// Дополнительно: закрытие по Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const anyOverlayActive =
            document.querySelector('.menu-box-container.active') ||
            document.querySelector('#headerSearchForm.active') ||
            document.querySelector('#mobileSearchForm.active') ||
            document.querySelector('.nav-btn-container.active');

        if (anyOverlayActive) {
            closeAllSearch();
            closeAllCatalogs();
            enableBodyScroll();
        }
    }
});

// Закрытие по клику на оверлей (если есть)
document.addEventListener('click', function (e) {
    const menuOverlay = document.querySelector('.menu-overlay');
    const searchOverlay = document.querySelector('.search-overlay');

    if (menuOverlay && e.target === menuOverlay) {
        closeAllCatalogs();
        enableBodyScroll();
    }

    if (searchOverlay && e.target === searchOverlay) {
        closeAllSearch();
        enableBodyScroll();
    }
});

//слайдеры в белой версии главной
// circumference for r=24: 2*π*24 ≈ 150.796
const CIRC = 150.796;

document.querySelectorAll('.service-block').forEach(block => {
    const sliderSide = block.querySelector('.slider-side');
    const slides = [...sliderSide.querySelectorAll('.slide')];
    const thumbItems = [...sliderSide.querySelectorAll('.thumb-item')];
    const prevBtn = sliderSide.querySelector('.prev-btn');
    const nextBtn = sliderSide.querySelector('.next-btn');
    let current = 0;

    // ── Circular progress helpers ─────────────────────────────────────────
    function getProgressEl(slide) { return slide.querySelector('.vpb-progress'); }
    function getProgressSvg(slide) { return slide.querySelector('.vpb-svg'); }
    function getIconSvg(slide) { return slide.querySelector('.vpb-icon svg'); }

    function setArc(slide, fraction) {
        const arc = getProgressEl(slide);
        if (!arc) return;
        arc.style.strokeDashoffset = CIRC * (1 - fraction);
    }

    function setPlayIcon(slide, playing) {
        const icon = getIconSvg(slide);
        if (!icon) return;
        if (playing) {
            icon.innerHTML = '<rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/>';
        } else {
            icon.innerHTML = '<polygon points="6,3 20,12 6,21"/>';
        }
        const svg = getProgressSvg(slide);
        if (svg) svg.classList.toggle('spinning', playing);
    }

    const rafMap = new WeakMap();

    function startProgress(slide, video) {
        function tick() {
            if (!video.paused && !video.ended) {
                const frac = video.duration ? video.currentTime / video.duration : 0;
                setArc(slide, frac);
                rafMap.set(video, requestAnimationFrame(tick));
            }
        }
        const old = rafMap.get(video);
        if (old) cancelAnimationFrame(old);
        rafMap.set(video, requestAnimationFrame(tick));
    }

    function stopProgress(slide, video) {
        const id = rafMap.get(video);
        if (id) cancelAnimationFrame(id);
    }

    // ── Navigation ────────────────────────────────────────────────────────
    function goTo(idx) {
        const oldSlide = slides[current];
        const oldVideo = oldSlide.querySelector('video');
        if (oldVideo && !oldVideo.paused) {
            oldVideo.pause();
            stopProgress(oldSlide, oldVideo);
            setPlayIcon(oldSlide, false);
            setArc(oldSlide, 0);
        }
        oldSlide.classList.remove('active');
        thumbItems[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        thumbItems[current].classList.add('active');
        ensureThumbVisible(current);
    }

    function ensureThumbVisible(idx) {
        const wrapper = sliderSide.querySelector('.thumbs-wrapper');
        const list = sliderSide.querySelector('.thumbs-list');
        const thumb = thumbItems[idx];
        if (!wrapper || !list || !thumb) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const thumbRect = thumb.getBoundingClientRect();

        if (thumbRect.left < wrapperRect.left) {
            wrapper.scrollLeft -= (wrapperRect.left - thumbRect.left + 10);
        } else if (thumbRect.right > wrapperRect.right) {
            wrapper.scrollLeft += (thumbRect.right - wrapperRect.right + 10);
        }
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    thumbItems.forEach(t => t.addEventListener('click', () => goTo(+t.dataset.index)));

    // ── Video play/pause ──────────────────────────────────────────────────
    sliderSide.querySelectorAll('.video-play-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const slide = btn.closest('.slide');
            const video = slide.querySelector('video');
            if (!video) return;
            if (video.paused) {
                video.play();
                setPlayIcon(slide, true);
                startProgress(slide, video);
            } else {
                video.pause();
                stopProgress(slide, video);
                setPlayIcon(slide, false);
            }
        });
    });

    sliderSide.querySelectorAll('video').forEach(video => {
        video.addEventListener('seeked', () => {
            const slide = video.closest('.slide');
            if (!video.paused) startProgress(slide, video);
        });
    });

    // ⭐ КЛЮЧЕВОЕ: начальная прокрутка к активной миниатюре
    setTimeout(() => {
        ensureThumbVisible(current);
    }, 100);
});

//слайдер миниатюр
const slider = document.querySelector('.thumbs-list');

if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('dragging');

        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    document.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('dragging');
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('dragging');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        e.preventDefault();

        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
}

//перенос блока в о компании
(function () {
    function moveContentForMobile() {
        const isMobile = window.innerWidth < 1100;
        const sourceContainer = document.querySelector('.container-r-about');
        const targetContainer = document.querySelector('.mobile-inserted-content');
        const originalContent = document.querySelector('.sticky-scroll');

        if (!sourceContainer || !targetContainer) return;

        if (isMobile) {
            // Если блок еще не перемещен, перемещаем его
            if (!targetContainer.hasChildNodes() && originalContent) {
                const clonedContent = originalContent.cloneNode(true);
                targetContainer.appendChild(clonedContent);
            }
        } else {
            // Если ширина больше 1100px, очищаем target контейнер
            while (targetContainer.firstChild) {
                targetContainer.removeChild(targetContainer.firstChild);
            }
        }
    }

    // Выполняем при загрузке
    moveContentForMobile();

    // Выполняем при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(moveContentForMobile, 250);
    });
})();


document.addEventListener('DOMContentLoaded', () => {
    const geoBlock = document.querySelector('.geography-content');
    if (!geoBlock) return;

    const topItems = geoBlock.querySelectorAll('.mb-top-item');
    const imgEl = geoBlock.querySelector('.geo-img-box img');
    const titleEl = geoBlock.querySelector('.geo-info-up p');
    const statEls = geoBlock.querySelectorAll('[data-geo-info]');

    function activateGeoItem(item) {
        // переключаем активный пункт слева
        topItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const { title, img, power, count, uptime, monitoring } = item.dataset;

        if (titleEl && title) titleEl.textContent = title;
        if (imgEl && img) imgEl.src = img;

        const statsMap = { '1': power, '2': count, '3': uptime, '4': monitoring };
        statEls.forEach(el => {
            const key = el.getAttribute('data-geo-info');
            if (key && statsMap[key]) el.textContent = statsMap[key];
        });
    }

    topItems.forEach(item => {
        item.addEventListener('mouseenter', () => activateGeoItem(item));
    });
});

document.addEventListener('DOMContentLoaded', function () {

    // ==========  СЛАЙДЕР для наград==========
    const slides = document.querySelectorAll('.prize-swiper .swiper-slide');
    const swiperContainer = document.querySelector('.prize-swiper');

    let swiper = null;

    // Инициализация Swiper только если контейнер существует
    if (swiperContainer) {
        swiper = new Swiper('.prize-swiper', {
            slidesPerView: 1.1,
            spaceBetween: 12,

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            navigation: {
                nextEl: '.prize-swiper .swiper-button-next',
                prevEl: '.prize-swiper .swiper-button-prev',
            },

            breakpoints: {
                320: { slidesPerView: 2.3 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4.1 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
                1440: { slidesPerView: 7 }
            }
        });
    }
})

document.addEventListener('DOMContentLoaded', function () {
  // ========== СЛАЙДЕР для форумов ==========
  const eventsSwiperContainer = document.querySelector('.events-swiper');

  if (eventsSwiperContainer) {
    const eventsSwiper = new Swiper('.events-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 12,

      initialSlide: 2, 

      centeredSlides: true,
  
      slideToClickedSlide: true,

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      breakpoints: {
        320: { slidesPerView: 1.2 },
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1440: { slidesPerView: 5 }
      }
    });
  }
});

/* видео в   новостях */
document.addEventListener('DOMContentLoaded', function () {

    // ========== СЛАЙДЕР для видео в медиа-блоке ==========
    const mediaVideosContainer = document.querySelector('.media-news-videos');

    if (mediaVideosContainer) {
        new Swiper('.media-news-videos', {
            slidesPerView: 1.3,
            spaceBetween: 16,

            navigation: {
                nextEl: '.media-videos-button-next',
                prevEl: '.media-videos-button-prev',
            },

            breakpoints: {
                320: { slidesPerView: 1.3 },
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 5 }
            }
        });
    }

    // ========== Модальное окно для видео ==========
    const videoModal = document.getElementById('videoModal');
    const videoModalPlayer = document.getElementById('videoModalPlayer');
    const videoModalClose = videoModal ? videoModal.querySelector('.video-modal-close') : null;
    const videoModalOverlay = videoModal ? videoModal.querySelector('.video-modal-overlay') : null;

    function openVideoModal(src) {
        if (!videoModal || !videoModalPlayer) return;
        videoModalPlayer.src = src;
        videoModalPlayer.muted = false; // звук включён в модалке
        videoModal.classList.add('is-open');
        videoModalPlayer.play();
    }

    function closeVideoModal() {
        if (!videoModal || !videoModalPlayer) return;
        videoModalPlayer.pause();
        videoModalPlayer.removeAttribute('src');
        videoModalPlayer.load();
        videoModal.classList.remove('is-open');
    }

    document.querySelectorAll('.media-news-videos .video-trigger').forEach(function (card) {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const src = card.getAttribute('data-video');
            if (src) openVideoModal(src);
        });
    });

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoModalOverlay) videoModalOverlay.addEventListener('click', closeVideoModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeVideoModal();
    });
});

document.addEventListener('DOMContentLoaded', function () {

    // ========== Автоподстановка длительности видео ==========
    function formatDuration(seconds) {
        if (!isFinite(seconds) || isNaN(seconds)) return '';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    document.querySelectorAll('.media-news-video').forEach(function (card) {
        const video = card.querySelector('video');
        const timeLabel = card.querySelector('.media-video-time');
        if (!video || !timeLabel) return;

        // если метаданные уже загружены (например, видео из кэша)
        if (video.readyState >= 1 && video.duration) {
            timeLabel.textContent = formatDuration(video.duration);
        }

        video.addEventListener('loadedmetadata', function () {
            timeLabel.textContent = formatDuration(video.duration);
        });
    });

});

document.addEventListener('DOMContentLoaded', function() {
    const topButton = document.querySelector('.top');
    const banner = document.querySelector('.banner-home'); 
    
    if (!topButton || !banner) return;
    
    // Создаем наблюдатель
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Баннер виден - скрываем кнопку
                topButton.classList.add('hidden');
            } else {
                // Баннер не виден - показываем кнопку
                topButton.classList.remove('hidden');
            }
        });
    }, {
        threshold: 0.1 // Срабатывает когда 10% баннера видно
    });
    
    // Начинаем наблюдение за баннером
    observer.observe(banner);
});