# Backend Server

Express сервер для аутентификации пользователей.

## Установка

```bash
npm install
```

## Запуск

### Режим разработки (с автоперезагрузкой)
```bash
npm run dev
```

### Продакшн режим
```bash
npm start
```

## API Endpoints

### POST /api/register
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "name": "Имя пользователя",
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Регистрация успешна",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Имя пользователя",
    "email": "user@example.com"
  }
}
```

### POST /api/login
Вход пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Вход выполнен успешно",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Имя пользователя",
    "email": "user@example.com"
  }
}
```

### GET /api/me
Получение информации о текущем пользователе (требует токен в заголовке Authorization)

**Заголовки:**
```
Authorization: Bearer jwt_token_here
```

## Хранилище

Пользователи сохраняются в файле `users.json` в папке server. Пароли хешируются с помощью bcrypt.

## Безопасность

⚠️ **Важно:** В продакшн окружении обязательно измените `JWT_SECRET` в `server/index.js` на безопасный случайный ключ!

