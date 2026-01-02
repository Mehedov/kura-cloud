# All Cloud - Экосистема сервисов

Проект облачного хранилища и экосистемы сервисов (редакторы документов, заметки, финансовый трекер и т.д.)

## 🚀 Технологии

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Nest.js (планируется)
- **База данных:** PostgreSQL (планируется)

## 📚 Документация

В проекте есть подробная документация по архитектуре и разработке:

1. **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Общая архитектура системы, структура БД, API endpoints, рекомендации
2. **[BACKEND_SETUP.md](../BACKEND_SETUP.md)** - Пошаговое руководство по настройке Nest.js бэкенда с примерами кода
3. **[INTEGRATION_TIPS.md](../INTEGRATION_TIPS.md)** - Советы по интеграции фронтенда и бэкенда, безопасность, оптимизация
4. **[DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)** - Архитектура деплоя: репозитории, домены, Kubernetes
5. **[KUBERNETES_EXAMPLES.md](../KUBERNETES_EXAMPLES.md)** - Готовые примеры Kubernetes конфигураций
6. **[SERVER_REQUIREMENTS.md](../SERVER_REQUIREMENTS.md)** - Минимальные требования к серверу для pet-проекта

## 🏃 Быстрый старт

### Frontend (текущий проект)

```bash
# Установка зависимостей
bun install

# Запуск dev сервера
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Backend (создать отдельно)

См. инструкции в [BACKEND_SETUP.md](../BACKEND_SETUP.md)

## 📁 Структура проекта

```
all-cloud/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # UI компоненты
│   ├── widgets/         # Бизнес-виджеты
│   ├── features/        # Функциональные модули (планируется)
│   └── shared/          # Общий код (планируется)
├── ARCHITECTURE.md           # Архитектура системы
├── BACKEND_SETUP.md          # Настройка бэкенда
├── INTEGRATION_TIPS.md       # Советы по интеграции
├── DEPLOYMENT_ARCHITECTURE.md # Архитектура деплоя
├── KUBERNETES_EXAMPLES.md    # Примеры Kubernetes
└── SERVER_REQUIREMENTS.md    # Требования к серверу
```

## 🎯 Текущий статус

- ✅ Frontend Next.js настроен
- ⬜ Backend Nest.js (в разработке)
- ⬜ База данных PostgreSQL
- ⬜ Авторизация и аутентификация
- ⬜ Загрузка и управление файлами
- ⬜ Командная работа (группы)

## 📖 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [Nest.js Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
