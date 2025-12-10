// ===== Основной модуль приложения =====

// Импорт стилей
import './style.css';

// Состояние приложения
const AppState = {
  isARActive: false,
  modelLoaded: false,
  markerDetected: false,
  useMarkerless: false
};

// DOM элементы
const elements = {
  instructions: null,
  loading: null,
  arInstructions: null,
  controls: null,
  startBtn: null,
  resetBtn: null,
  closeBtn: null,
  scene: null,
  marker: null,
  horseEntity: null,
  fallbackBox: null
};

// ===== Инициализация =====
function init() {
  console.log('🎄 Инициализация AR Toy Filter...');

  // Получение DOM элементов
  elements.instructions = document.getElementById('instructions');
  elements.loading = document.getElementById('loading');
  elements.arInstructions = document.getElementById('ar-instructions');
  elements.controls = document.getElementById('controls');
  elements.startBtn = document.getElementById('start-ar-btn');
  elements.resetBtn = document.getElementById('reset-btn');
  elements.closeBtn = document.getElementById('close-ar-btn');
  elements.scene = document.querySelector('a-scene');
  elements.marker = document.getElementById('main-marker');
  elements.horseEntity = document.getElementById('horse-entity');
  elements.fallbackBox = document.getElementById('fallback-box');

  // Проверка WebXR поддержки
  checkARSupport();

  // Слушатели событий
  setupEventListeners();

  // A-Frame события
  setupAFrameListeners();
}

// ===== Проверка поддержки AR =====
function checkARSupport() {
  // Проверка доступа к камере
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError('Ваше устройство не поддерживает доступ к камере');
    return;
  }

  // Проверка WebXR
  if ('xr' in navigator) {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      if (supported) {
        console.log('✅ WebXR AR поддерживается');
        AppState.useMarkerless = true;
      } else {
        console.log('ℹ️ WebXR AR не поддерживается, используем marker-based');
      }
    });
  }

  console.log('✅ Базовая поддержка AR доступна');
}

// ===== Настройка слушателей событий =====
function setupEventListeners() {
  // Кнопка запуска AR
  elements.startBtn?.addEventListener('click', startAR);

  // Кнопка сброса
  elements.resetBtn?.addEventListener('click', resetModel);

  // Кнопка закрытия AR
  elements.closeBtn?.addEventListener('click', stopAR);

  // Обработка ошибок загрузки модели
  window.addEventListener('error', handleError);
}

// ===== A-Frame события =====
function setupAFrameListeners() {
  // Ожидание загрузки сцены
  elements.scene?.addEventListener('loaded', () => {
    console.log('✅ A-Frame сцена загружена');
  });

  // Обнаружение маркера
  elements.marker?.addEventListener('markerFound', () => {
    console.log('🎯 Маркер обнаружен');
    AppState.markerDetected = true;
    showARInstructions();
  });

  elements.marker?.addEventListener('markerLost', () => {
    console.log('❌ Маркер потерян');
    AppState.markerDetected = false;
  });

  // Загрузка модели
  elements.horseEntity?.addEventListener('model-loaded', () => {
    console.log('✅ 3D модель загружена');
    AppState.modelLoaded = true;
    hideLoading();
  });

  elements.horseEntity?.addEventListener('model-error', (event) => {
    console.error('❌ Ошибка загрузки модели:', event.detail);
    showFallback();
  });
}

// ===== Запуск AR =====
async function startAR() {
  console.log('🚀 Запуск AR...');

  try {
    // Запрос разрешения на камеру
    showLoading('Запрос доступа к камере...');

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment' // Просто просим заднюю камеру без сложных настроек
      }
    });

    console.log('✅ Доступ к камере получен');

    // Останавливаем временный stream (AR.js создаст свой)
    stream.getTracks().forEach(track => track.stop());

    // Скрыть инструкции, показать загрузку
    hideInstructions();
    showLoading('Загрузка 3D модели...');

    // Активация AR сцены
    AppState.isARActive = true;

    // Показать AR инструкции и контролы
    setTimeout(() => {
      if (AppState.modelLoaded) {
        hideLoading();
      }
      showARInstructions();
      showControls();
    }, 1000);

  } catch (error) {
    console.error('❌ Ошибка доступа к камере:', error);
    hideLoading();

    if (error.name === 'NotAllowedError') {
      showError('Доступ к камере запрещён. Пожалуйста, разрешите доступ в настройках браузера.');
    } else if (error.name === 'NotFoundError') {
      showError('Камера не найдена на устройстве');
    } else {
      showError('Не удалось запустить AR: ' + error.message);
    }
  }
}

// ===== Остановка AR =====
function stopAR() {
  console.log('⏹️ Остановка AR...');

  AppState.isARActive = false;

  hideARInstructions();
  hideControls();
  showInstructions();

  // Перезагрузка страницы для сброса AR.js
  location.reload();
}

// ===== Сброс модели =====
function resetModel() {
  console.log('🔄 Сброс модели...');

  if (elements.horseEntity) {
    elements.horseEntity.setAttribute('position', '0 0.5 0');
    elements.horseEntity.setAttribute('rotation', '0 0 0');
    elements.horseEntity.setAttribute('scale', '1 1 1');
  }
}

// ===== Показ fallback модели =====
function showFallback() {
  console.log('⚠️ Использование fallback модели');
  hideLoading();

  if (elements.fallbackBox) {
    elements.fallbackBox.setAttribute('visible', true);
  }

  AppState.modelLoaded = true;
}

// ===== UI функции =====
function showInstructions() {
  elements.instructions?.classList.remove('hidden');
}

function hideInstructions() {
  elements.instructions?.classList.add('hidden');
}

function showLoading(message = 'Загрузка...') {
  if (elements.loading) {
    const loadingText = elements.loading.querySelector('p');
    if (loadingText) loadingText.textContent = message;
    elements.loading.classList.remove('hidden');
  }
}

function hideLoading() {
  elements.loading?.classList.add('hidden');
}

function showARInstructions() {
  elements.arInstructions?.classList.remove('hidden');

  // Автоматически скрыть через 8 секунд
  setTimeout(() => {
    elements.arInstructions?.classList.add('hidden');
  }, 8000);
}

function hideARInstructions() {
  elements.arInstructions?.classList.add('hidden');
}

function showControls() {
  elements.controls?.classList.remove('hidden');
}

function hideControls() {
  elements.controls?.classList.add('hidden');
}

function showError(message) {
  alert('❌ ' + message);
  showInstructions();
}

function handleError(event) {
  console.error('Глобальная ошибка:', event.error);
}

// ===== Performance monitoring =====
if (window.performance) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`📊 Время загрузки страницы: ${pageLoadTime}ms`);
    }, 0);
  });
}

// ===== Запуск приложения =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Экспорт для использования в других модулях
export { AppState, elements };
