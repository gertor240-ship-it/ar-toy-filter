// ===== UI Controls Module =====
// Дополнительные функции управления интерфейсом

import { AppState, elements } from './main.js';

// Инициализация UI контролов
export function initUIControls() {
    console.log('🎨 Инициализация UI контролов...');

    // Дополнительные обработчики
    setupKeyboardControls();
    setupOrientationWarning();
    setupPerformanceMonitor();
}

// ===== Клавиатурные команды для отладки =====
function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        if (!AppState.isARActive) return;

        switch (event.key) {
            case 'r':
            case 'R':
                // Сброс модели
                console.log('⌨️ Сброс модели (клавиша R)');
                if (elements.resetBtn) {
                    elements.resetBtn.click();
                }
                break;

            case 'Escape':
                // Выход из AR
                console.log('⌨️ Выход из AR (Escape)');
                if (elements.closeBtn) {
                    elements.closeBtn.click();
                }
                break;
        }
    });
}

// ===== Предупреждение об ориентации =====
function setupOrientationWarning() {
    // Проверка ориентации для оптимального опыта
    function checkOrientation() {
        if (window.innerWidth > window.innerHeight && AppState.isARActive) {
            // Ландшафтная ориентация
            console.log('📱 Рекомендуется портретная ориентация');
            showOrientationHint();
        }
    }

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

function showOrientationHint() {
    // Создаем временное уведомление
    const hint = document.createElement('div');
    hint.className = 'orientation-hint';
    hint.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px 30px;
      border-radius: 16px;
      z-index: 1000;
      text-align: center;
      font-size: 16px;
    ">
      📱 Для лучшего опыта поверните устройство вертикально
    </div>
  `;

    document.body.appendChild(hint);

    setTimeout(() => {
        hint.remove();
    }, 3000);
}

// ===== Мониторинг производительности =====
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function setupPerformanceMonitor() {
    // Счетчик FPS для отладки
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;

            // Предупреждение о низкой производительности
            if (fps < 20 && AppState.isARActive) {
                console.warn('⚠️ Низкий FPS:', fps);
            }
        }

        if (AppState.isARActive) {
            requestAnimationFrame(measureFPS);
        }
    }

    // Запуск при активации AR
    document.addEventListener('ar-started', () => {
        requestAnimationFrame(measureFPS);
    });
}

// ===== Показ FPS (для отладки) =====
export function showFPSCounter() {
    const fpsCounter = document.createElement('div');
    fpsCounter.id = 'fps-counter';
    fpsCounter.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: #00ff00;
    padding: 8px 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 14px;
    z-index: 1001;
  `;

    document.body.appendChild(fpsCounter);

    function updateFPS() {
        fpsCounter.textContent = `FPS: ${fps}`;
        if (AppState.isARActive) {
            requestAnimationFrame(updateFPS);
        }
    }

    updateFPS();
}

// ===== Утилиты для проверки устройства =====
export function getDeviceInfo() {
    const info = {
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
        isAndroid: /Android/i.test(navigator.userAgent),
        browser: getBrowserName(),
        screenSize: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };

    console.log('📱 Информация об устройстве:', info);
    return info;
}

function getBrowserName() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';

    return 'Unknown';
}

// ===== Проверка совместимости =====
export function checkCompatibility() {
    const issues = [];

    // Проверка HTTPS (требуется для camera access)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        issues.push('HTTPS требуется для доступа к камере');
    }

    // Проверка WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        issues.push('WebGL не поддерживается');
    }

    // Проверка getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        issues.push('Camera API не доступен');
    }

    if (issues.length > 0) {
        console.error('❌ Проблемы совместимости:', issues);
        return { compatible: false, issues };
    }

    console.log('✅ Устройство совместимо с AR');
    return { compatible: true, issues: [] };
}

// ===== Автоматическая инициализация =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initUIControls();
        getDeviceInfo();
        checkCompatibility();
    });
} else {
    initUIControls();
    getDeviceInfo();
    checkCompatibility();
}

console.log('✅ UI Controls модуль загружен');
