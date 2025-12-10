# 🚀 Инструкции по Развертыванию AR Toy Filter

Это руководство описывает процесс развертывания WebAR приложения на различных платформах.

## 📋 Требования для Продакшн

### Обязательные

- ✅ **HTTPS соединение** - Обязательно для доступа к камере
- ✅ **Современный хостинг** - С поддержкой статических сайтов
- ✅ **CORS настройки** - Для загрузки GLTF моделей

### Рекомендуемые

- 📦 **CDN** - Для быстрой доставки ассетов
- 🔒 **CSP headers** - Для безопасности
- 📊 **Analytics** - Для отслеживания использования

---

## 1️⃣ GitHub Pages (Рекомендуется)

GitHub Pages предоставляет бесплатный HTTPS хостинг для статических сайтов.

### Шаг 1: Подготовка Проекта

```bash
# Установить gh-pages пакет
npm install --save-dev gh-pages
```

### Шаг 2: Обновить package.json

Добавьте следующие строки в `package.json`:

```json
{
  "homepage": "https://<username>.github.io/<repo-name>",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Замените `<username>` на ваш GitHub username и `<repo-name>` на название репозитория.

### Шаг 3: Обновить vite.config.js

Создайте/обновите `vite.config.js`:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/<repo-name>/',
})
```

### Шаг 4: Деплой

```bash
# Билд и деплой одной командой
npm run deploy
```

### Шаг 5: Настройка GitHub

1. Перейдите в Settings → Pages вашего репозитория
2. Source: выберите ветку `gh-pages`
3. Сохраните изменения

**Готово!** Ваше приложение будет доступно на `https://<username>.github.io/<repo-name>`

### Custom Domain (Optional)

1. В Settings → Pages → Custom domain введите ваш домен
2. Создайте файл `CNAME` в папке `public` с вашим доменом:
   ```
   ar-toy.example.com
   ```
3. Настройте DNS записи у вашего провайдера:
   - Type: `CNAME`
   - Name: `ar-toy` (или `@` для root)
   - Value: `<username>.github.io`

---

## 2️⃣ Vercel

Vercel предлагает автоматический деплой с каждым git push.

### Метод 1: Через Dashboard

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте GitHub репозиторий
4. Настройки build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Нажмите "Deploy"

### Метод 2: Через CLI

```bash
# Установить Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
vercel

# Продакшн деплой
vercel --prod
```

**Преимущества Vercel:**
- ✅ Автоматический деплой при каждом push
- ✅ Preview deployments для pull requests
- ✅ Автоматический HTTPS с сертификатами
- ✅ Глобальный CDN

---

## 3️⃣ Netlify

Netlify - еще одна отличная платформа для статических сайтов.

### Метод 1: Через Dashboard

1. Зайдите на [netlify.com](https://netlify.com)
2. Нажмите "Add new site" → "Import existing project"
3. Подключите GitHub репозиторий
4. Настройки build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Нажмите "Deploy site"

### Метод 2: Drag & Drop

```bash
# Билд проекта
npm run build

# Зайдите на netlify.com и перетащите папку dist в окно деплоя
```

### Настройка netlify.toml (Optional)

Создайте `netlify.toml` в корне проекта:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

---

## 4️⃣ Cloudflare Pages

Бесплатный хостинг с глобальным CDN от Cloudflare.

1. Зайдите в [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pages → Create a project
3. Подключите GitHub репозиторий
4. Настройки:
   - **Build command**: `npm run build`
   - **Build output**: `dist`
5. Save and Deploy

---

## 5️⃣ Собственный VPS/Сервер

Для полного контроля над хостингом.

### Nginx конфигурация

```nginx
server {
    listen 80;
    server_name ar-toy.example.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ar-toy.example.com;
    
    # SSL сертификаты (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/ar-toy.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ar-toy.example.com/privkey.pem;
    
    root /var/www/ar-toy-filter/dist;
    index index.html;
    
    # GZIP сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # CORS headers для GLTF
    location ~* \.(gltf|glb|bin)$ {
        add_header Access-Control-Allow-Origin *;
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Деплой на сервер

```bash
# На локальной машине
npm run build

# Копирование на сервер
scp -r dist/* user@server:/var/www/ar-toy-filter/dist/

# Или через git на сервере
cd /var/www/ar-toy-filter
git pull
npm install
npm run build
```

### Автоматизация с PM2

```bash
# Установить PM2
npm install -g pm2

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ar-toy-build',
    script: 'npm',
    args: 'run build',
    cwd: '/var/www/ar-toy-filter',
    watch: false
  }]
}

# Запуск
pm2 start ecosystem.config.js
```

---

## 🔒 Безопасность

### Content Security Policy

Добавьте CSP headers для защиты:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://aframe.io https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https:;">
```

### HTTPS

**Важно**: Доступ к камере требует HTTPS на всех платформах кроме localhost.

Получить бесплатный SSL:
- **Let's Encrypt**: Бесплатные автоматические сертификаты
- **Cloudflare**: Бесплатный SSL для сайтов на Cloudflare
- **GitHub Pages/Vercel/Netlify**: Автоматический HTTPS

---

## 📊 Analytics & Monitoring

### Google Analytics

Добавьте в `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible (Privacy-friendly)

```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## ✅ Проверочный Список

Перед продакшн деплоем убедитесь:

- [ ] ✅ HTTPS активен и работает
- [ ] ✅ Camera permissions запрашиваются корректно
- [ ] ✅ 3D модель загружается без ошибок
- [ ] ✅ CORS headers настроены для GLTF
- [ ] ✅ Gzip сжатие включено
- [ ] ✅ Meta tags для SEO заполнены
- [ ] ✅ Favicon добавлен
- [ ] ✅ Analytics подключен
- [ ] ✅ Тестирование на iOS Safari
- [ ] ✅ Тестирование на Android Chrome
- [ ] ✅ QR-код ведет на правильный URL
- [ ] ✅ Performance оптимизирован (Lighthouse score > 80)

---

## 🎯 Оптимизация

### 1. Сжатие GLTF

```bash
# Установить gltf-pipeline
npm install -g gltf-pipeline

# Сжать модель
gltf-pipeline -i rocking_horse.gltf -o rocking_horse_compressed.gltf -d
```

### 2. Image Optimization

```bash
# Оптимизировать PNG/JPG
npm install -g imagemin-cli

imagemin public/assets/*.png --out-dir=public/assets/optimized
```

### 3. Bundle Size

```bash
# Анализ размера бандла
npm install -D rollup-plugin-visualizer

# Добавить в vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [visualizer()]
})
```

---

## 🆘 Troubleshooting

### Ошибка 404 на маршрутах

Убедитесь, что SPA fallback настроен на сервере.

### CORS ошибки

Проверьте headers для GLTF файлов:
```
Access-Control-Allow-Origin: *
```

### Медленная загрузка

- Включите CDN
- Используйте Draco compression для GLTF
- Оптимизируйте изображения

---

**Готово!** 🎉 Ваше AR приложение готово к продакшн использованию.
