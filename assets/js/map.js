// map.js для API Яндекс.Карт версии 3 с загрузкой стиля из JSON файла
let contactMap = null;
let placemarks = {};
let activeId = 'office-moscow';
let customStyle = null;

const locations = {
    'office-moscow': { coords: [37.509730, 55.783332] },
    'support': { coords: [37.415963, 55.824754] },
    'dc-voronezh': { coords: [39.200, 51.660] },
    'dc-perm': { coords: [56.250, 58.010] },
};

// Функция для расчета границ всех маркеров
function getBounds() {
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    Object.values(locations).forEach(loc => {
        const [lon, lat] = loc.coords;
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
    });

    return { minLon, maxLon, minLat, maxLat };
}

// Функция для расчета оптимального зума и центра
function getOptimalView() {
    const bounds = getBounds();
    const centerLon = (bounds.minLon + bounds.maxLon) / 2;
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;

    // Расчет разницы координат
    const lonDiff = bounds.maxLon - bounds.minLon;
    const latDiff = bounds.maxLat - bounds.minLat;
    const maxDiff = Math.max(lonDiff, latDiff);

    // Определение зума в зависимости от разброса координат
    let zoom = 4; // Начальный зум для всей России

    if (maxDiff <= 0.5) zoom = 10;
    else if (maxDiff <= 1) zoom = 8;
    else if (maxDiff <= 2) zoom = 7;
    else if (maxDiff <= 5) zoom = 6;
    else if (maxDiff <= 10) zoom = 5;
    else if (maxDiff <= 20) zoom = 4;
    else zoom = 3;

    return { center: [centerLon, centerLat], zoom: zoom };
}

// Загрузка кастомного стиля из JSON файла
async function loadCustomStyle() {
    if (customStyle) return customStyle;
    try {
        const response = await fetch('assets/customization.json');
        if (!response.ok) throw new Error('Не удалось загрузить стиль карты');
        customStyle = await response.json();
        return customStyle;
    } catch (error) {
        console.warn('Ошибка загрузки стиля, используем стандартный:', error);
        return [];
    }
}

async function initContactMap() {
    if (contactMap) return;

    try {
        await ymaps3.ready;

        const style = await loadCustomStyle();
        const {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapMarker,
        } = ymaps3;

        const container = document.getElementById('map-container');
        if (!container) return;

        container.innerHTML = '';

        // Получаем оптимальный центр и зум для отображения всех маркеров
        const optimalView = getOptimalView();

        console.log('Оптимальный центр:', optimalView.center);
        console.log('Оптимальный зум:', optimalView.zoom);

        // Создаем карту с оптимальным отображением
        contactMap = new YMap(container, {
            location: {
                center: optimalView.center,
                zoom: optimalView.zoom
            }
        });

        // Добавляем базовый слой карты с кастомным стилем
        contactMap.addChild(new YMapDefaultSchemeLayer({
            customization: style
        }));

        // Добавляем слой с объектами (необходимо для корректной работы)
        contactMap.addChild(new YMapDefaultFeaturesLayer({}));

        // Создаем кастомные маркеры
     Object.entries(locations).forEach(([id, loc]) => {
    const MARKER_WIDTH = 46;
    const MARKER_HEIGHT = 58;

    const markerContainer = document.createElement('div');
    markerContainer.style.cssText = `
        cursor: pointer;
        position: absolute;
        width: 0;
        height: 0;
        overflow: visible;
    `;
markerContainer.classList.add('marker-transition');
    const img = document.createElement('img');
    img.src = id === activeId
        ? 'assets/images/pay-del/Pin-active.svg'
        : 'assets/images/pay-del/Pin.svg';


img.style.cssText = `
    width: ${MARKER_WIDTH}px;
    height: ${MARKER_HEIGHT}px;
    display: block;
    position: absolute;
    left: ${-MARKER_WIDTH / 2}px;
    top: ${-MARKER_HEIGHT}px;
    transform-origin: bottom center;
       transition: transform 0.3s ease !important;
`;
img.alt = id;

    markerContainer.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
    });
    markerContainer.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
    markerContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        activateItemById(id);
    });

    markerContainer.appendChild(img);

    const marker = new YMapMarker(
        {
            coordinates: loc.coords,
            anchor: [0, 0],
        },
        markerContainer
    );

    contactMap.addChild(marker);
    placemarks[id] = { container: markerContainer, img: img };
});

        console.log('Карта с кастомным стилем успешно загружена');
        console.log('Все маркеры отображаются на карте');

    } catch (error) {
        console.error('Ошибка инициализации карты:', error);
    }
}

function updateMarkers(newActiveId) {
    Object.entries(placemarks).forEach(([id, elements]) => {
        elements.img.src = id === newActiveId
            ? 'assets/images/pay-del/Pin-active.svg'
            : 'assets/images/pay-del/Pin.svg';
    });
}

function activateItemById(id) {
    if (activeId === id) return;

    activeId = id;
    updateMarkers(id);

    document.querySelectorAll('.accordion-item').forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (item.dataset.id === id) {
            item.classList.add('open');
            if (header) header.classList.add('active');
        } else {
            item.classList.remove('open');
            if (header) header.classList.remove('active');
        }
    });

    const loc = locations[id];
    if (loc && contactMap) {
        contactMap.setLocation({
            center: loc.coords,
            zoom: loc.zoom || 10,
        });
    }
}

function toggleAccordion(header) {
    const item = header.closest('.accordion-item');
    const id = item.dataset.id;
    if (id && !item.classList.contains('open')) {
        activateItemById(id);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initContactMap();
});