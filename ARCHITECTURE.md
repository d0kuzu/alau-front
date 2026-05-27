# Архитектура проекта Zerde.ai

## 📁 Структура проекта

Проект организован по принципу **Feature-Based Architecture** с чётким разделением ответственности.

```
src/
├── app/                      # Конфигурация приложения
│   ├── App.tsx              # Главный компонент приложения
│   ├── App.css              # Глобальные стили приложения
│   ├── main.tsx             # Точка входа
│   └── NotFound.tsx         # Страница 404
│
├── features/                 # Бизнес-функции (фичи)
│   ├── landing/             # Landing page
│   │   ├── pages/           # Страницы
│   │   │   └── Index.tsx
│   │   ├── sections/        # Секции лендинга
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Channels.tsx
│   │   │   ├── ForWho.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── Contact.tsx
│   │   ├── components/      # Компоненты лендинга
│   │   │   ├── AnimatedCard.tsx
│   │   │   └── AnimatedSection.tsx
│   │   └── index.ts         # Barrel export
│   │
│   ├── auth/                # Авторизация
│   │   ├── pages/
│   │   │   └── Auth.tsx
│   │   ├── components/      # Компоненты авторизации (будущие)
│   │   └── index.ts
│   │
│   └── dashboard/           # Дашборд
│       ├── pages/
│       │   └── Dashboard.tsx
│       ├── components/      # Компоненты дашборда (будущие)
│       └── index.ts
│
├── shared/                   # Общие ресурсы
│   ├── components/          # Общие компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NavLink.tsx
│   │   └── index.ts
│   │
│   ├── ui/                  # UI библиотека (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (все UI компоненты)
│   │
│   ├── hooks/               # Кастомные хуки
│   │   ├── use-toast.ts
│   │   ├── use-mobile.tsx
│   │   ├── useScrollAnimation.tsx
│   │   └── index.ts
│   │
│   ├── contexts/            # React контексты
│   │   ├── AuthContext.tsx
│   │   └── index.ts
│   │
│   ├── lib/                 # Утилиты
│   │   ├── utils.ts
│   │   └── index.ts
│   │
│   └── types/               # TypeScript типы (будущие)
│
├── services/                 # Внешние сервисы и API
│   └── api/                 # API слой
│       └── api.ts
│
└── assets/                   # Статические ресурсы
    ├── logo.png
    └── mountains-bg.png
```

## 🎯 Принципы организации

### 1. **Feature-Based Architecture**
Каждая фича (landing, auth, dashboard) - это независимый модуль со своими:
- Страницами (pages)
- Компонентами (components)
- Хуками (hooks - если нужны)
- Стилями (если специфичны для фичи)

### 2. **Shared модуль**
Всё, что используется в нескольких фичах:
- UI компоненты (shadcn/ui)
- Общие компоненты (Header, Footer)
- Хуки
- Контексты
- Утилиты

### 3. **Services модуль**
Работа с внешними API и сервисами:
- Авторизация через Diaxel API
- HTTP клиенты
- WebSocket соединения

### 4. **App модуль**
Конфигурация и точка входа приложения

## 📦 Импорты

### Алиасы путей
Используется alias `@/` для абсолютных импортов:

```typescript
// ✅ Правильно
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Auth } from '@/features/auth';

// ❌ Неправильно
import { Button } from '../../../shared/ui/button';
```

### Barrel Exports
Каждый модуль имеет `index.ts` для удобного импорта:

```typescript
// Вместо
import Hero from '@/features/landing/sections/Hero';
import Features from '@/features/landing/sections/Features';

// Можно использовать
import { Hero, Features } from '@/features/landing/sections';
```

## 🚀 Масштабирование

### Добавление новой фичи

1. Создать директорию в `features/`:
```bash
src/features/new-feature/
├── pages/
├── components/
├── hooks/ (опционально)
└── index.ts
```

2. Добавить экспорты в `index.ts`
3. Импортировать в `App.tsx`

### Добавление нового общего компонента

1. Создать в `shared/components/`
2. Экспортировать в `shared/components/index.ts`
3. Использовать через `@/shared/components`

## 🔧 Преимущества структуры

✅ **Масштабируемость** - легко добавлять новые фичи
✅ **Читаемость** - понятная организация кода
✅ **Переиспользование** - shared компоненты доступны везде
✅ **Изоляция** - фичи независимы друг от друга
✅ **Тестируемость** - легко тестировать отдельные модули
✅ **Team-friendly** - команда может работать параллельно над разными фичами

## 📝 Соглашения по коду

1. **Именование файлов**: PascalCase для компонентов (`Button.tsx`), camelCase для утилит (`utils.ts`)
2. **Barrel exports**: Всегда создавать `index.ts` для экспорта модулей
3. **Абсолютные импорты**: Всегда использовать `@/` alias
4. **Компоненты**: Один компонент = один файл
5. **Типы**: Определять в том же файле или в `shared/types/`

## 🔄 Миграция старой структуры

Старая плоская структура:
```
src/
├── components/  (все компоненты вместе)
├── pages/       (все страницы вместе)
└── ...
```

Была реорганизована в feature-based структуру для лучшей масштабируемости и поддержки.
