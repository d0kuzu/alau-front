const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    plan?: string;
  };
}

// Сохранение токена в localStorage
export const saveToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Получение токена из localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Удаление токена
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// API функции

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Проверка наличия контента перед парсингом JSON
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  if (!text) {
    throw new Error('Сервер вернул пустой ответ');
  }

  let result: AuthResponse;
  try {
    result = JSON.parse(text);
  } catch (error) {
    throw new Error(`Ошибка парсинга ответа сервера: ${text.substring(0, 100)}`);
  }
  
  if (!response.ok) {
    throw new Error(result.message || 'Ошибка регистрации');
  }

  if (result.success && result.token) {
    saveToken(result.token);
  }

  return result;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Проверка наличия контента перед парсингом JSON
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  if (!text) {
    throw new Error('Сервер вернул пустой ответ. Убедитесь, что сервер запущен и доступен.');
  }

  let result: AuthResponse;
  try {
    result = JSON.parse(text);
  } catch (error) {
    throw new Error(`Ошибка парсинга ответа сервера: ${text.substring(0, 100)}`);
  }
  
  if (!response.ok) {
    throw new Error(result.message || 'Ошибка входа');
  }

  if (result.success && result.token) {
    saveToken(result.token);
  }

  return result;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Токен не найден');
  }

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // Проверка наличия контента перед парсингом JSON
  const contentType = response.headers.get('content-type');
  const text = await response.text();
  
  if (!text) {
    throw new Error('Сервер вернул пустой ответ');
  }

  let result: AuthResponse;
  try {
    result = JSON.parse(text);
  } catch (error) {
    throw new Error(`Ошибка парсинга ответа сервера: ${text.substring(0, 100)}`);
  }
  
  if (!response.ok) {
    removeToken();
    throw new Error(result.message || 'Ошибка получения данных пользователя');
  }

  return result;
};

