const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ?? (import.meta.env.DEV ? "/diaxel" : "https://api.zerde.co/diaxel");
const AUTH_STORAGE_KEY = "diaxel_auth";
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000;
const REFRESH_SKEW_MS = 60 * 1000;

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type AuthSession = AuthTokens & {
  email?: string;
  accessTokenExpiresAt: number;
};

type AuthPayload = {
  email: string;
  password: string;
};

type TwilioRegisterPayload = {
  name: string;
  twilio_number: string;
  account_sid: string;
  auth_token: string;
};

export type AssistantType = "api" | "telegram" | "twilio";

export type Assistant = {
  id: string;
  name: string;
  configuration?: string;
  type?: AssistantType;
  created_at?: string;
  updated_at?: string;
};

export type Chat = {
  id: string;
  assistant_id: string;
  customer_id: string;
  platform: string;
  created_at: string;
  updated_at: string;
  message_count: number;
};

type UpdateAssistantPayload = {
  name: string;
  configuration: string;
};

export type SearchChatsResult = {
  answer: Chat[];
  total_count: number;
};

type ApiRegisterResponse = {
  token: string;
};

type TwilioRegisterResponse = {
  webhook_url: string;
};

type ApiLogMeta = {
  method: string;
  path: string;
  url: string;
  hasRetried?: boolean;
};

class ApiRequestError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}

const getAccessTokenExpiresAt = () => Date.now() + ACCESS_TOKEN_LIFETIME_MS;

const getBalancedJsonEnd = (text: string, start: number) => {
  const openingChar = text[start];
  const stack = [openingChar === "{" ? "}" : "]"];
  let isInsideString = false;
  let isEscaped = false;

  for (let index = start + 1; index < text.length; index += 1) {
    const char = text[index];

    if (isInsideString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === "\"") {
        isInsideString = false;
      }

      continue;
    }

    if (char === "\"") {
      isInsideString = true;
      continue;
    }

    if (char === "{") {
      stack.push("}");
      continue;
    }

    if (char === "[") {
      stack.push("]");
      continue;
    }

    if (char === "}" || char === "]") {
      if (stack[stack.length - 1] !== char) {
        return -1;
      }

      stack.pop();

      if (stack.length === 0) {
        return index + 1;
      }
    }
  }

  return -1;
};

const parseJsonLikeBody = (text: string) => {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return null;
  }

  try {
    return JSON.parse(trimmedText);
  } catch {
    const objectStart = text.indexOf("{");
    const arrayStart = text.indexOf("[");
    const jsonStartCandidates = [objectStart, arrayStart]
      .filter((index) => index >= 0)
      .sort((left, right) => left - right);

    for (const jsonStart of jsonStartCandidates) {
      const balancedEnd = getBalancedJsonEnd(text, jsonStart);
      const candidates = balancedEnd > jsonStart
        ? [text.slice(jsonStart, balancedEnd), text.slice(jsonStart).trim()]
        : [text.slice(jsonStart).trim()];

      for (const candidate of candidates) {
        try {
          return JSON.parse(candidate);
        } catch {
          // Try the next possible JSON fragment before falling back to raw text.
        }
      }
    }

    return trimmedText;
  }
};

const getErrorMessage = (data: unknown, fallback: string) => {
  if (typeof data === "string") {
    return data || fallback;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const message = record.error || record.detail || record.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
};

const isApiDebugLoggingEnabled = () => {
  if (import.meta.env.DEV) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem("alau_debug_api") === "1";
};

const logBackendResponse = (meta: ApiLogMeta, response: Response, rawBody: string, parsedBody: unknown) => {
  if (!isApiDebugLoggingEnabled()) {
    return;
  }

  const logPayload = {
    request: {
      method: meta.method,
      path: meta.path,
      url: meta.url,
      retriedAfterRefresh: Boolean(meta.hasRetried),
    },
    response: {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      rawBody,
      parsedBody,
    },
  };

  const label = `[backend] ${meta.method} ${meta.path} -> ${response.status}`;

  if (response.ok) {
    console.groupCollapsed(label);
  } else {
    console.group(label);
  }

  console.log(logPayload);
  console.groupEnd();
};

const parseResponse = async <TResponse>(response: Response, meta: ApiLogMeta) => {
  const text = await response.text();
  const data = parseJsonLikeBody(text);

  logBackendResponse(meta, response, text, data);

  if (!response.ok) {
    const message = getErrorMessage(data, `HTTP ${response.status}`);
    throw new ApiRequestError(response.status, message, data);
  }

  return data as TResponse;
};

const requestJson = async <TResponse>(path: string, init: RequestInit = {}) => {
  const method = init.method ?? "GET";
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  return parseResponse<TResponse>(response, {
    method,
    path,
    url,
  });
};

const createSession = (tokens: AuthTokens, email?: string): AuthSession => ({
  ...tokens,
  email,
  accessTokenExpiresAt: getAccessTokenExpiresAt(),
});

export const loadAuthSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as AuthSession;

    if (!session.access_token || !session.refresh_token) {
      return null;
    }

    if (typeof session.accessTokenExpiresAt !== "number") {
      return {
        ...session,
        accessTokenExpiresAt: 0,
      };
    }

    return session;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const saveAuthSession = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const login = async ({ email, password }: AuthPayload) => {
  const tokens = await requestJson<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const session = createSession(tokens, email);

  saveAuthSession(session);
  return session;
};

export const register = async ({ email, password }: AuthPayload) => {
  const tokens = await requestJson<AuthTokens>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const session = createSession(tokens, email);

  saveAuthSession(session);
  return session;
};

export const refreshAuthSession = async () => {
  const currentSession = loadAuthSession();

  if (!currentSession?.refresh_token) {
    clearAuthSession();
    throw new Error("Сессия истекла. Войдите в аккаунт заново.");
  }

  let tokens: AuthTokens;

  try {
    tokens = await requestJson<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: currentSession.refresh_token }),
    });
  } catch (error) {
    clearAuthSession();
    throw error;
  }

  const session = createSession(tokens, currentSession.email);

  saveAuthSession(session);
  return session;
};

export const logout = async () => {
  const currentSession = loadAuthSession();

  try {
    if (currentSession?.refresh_token) {
      await requestJson<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: currentSession.refresh_token }),
      });
    }
  } finally {
    clearAuthSession();
  }
};

export const getValidAccessToken = async () => {
  const session = loadAuthSession();

  if (!session?.access_token) {
    throw new Error("Не найден токен авторизации. Войдите в аккаунт заново.");
  }

  if (Date.now() >= session.accessTokenExpiresAt - REFRESH_SKEW_MS) {
    const refreshedSession = await refreshAuthSession();
    return refreshedSession.access_token;
  }

  return session.access_token;
};

const backendRequest = async <TResponse>(path: string, init: RequestInit = {}, hasRetried = false): Promise<TResponse> => {
  const accessToken = await getValidAccessToken();
  const method = init.method ?? "GET";
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init.headers,
    },
  });

  if (response.status === 401 && !hasRetried) {
    await refreshAuthSession();
    return backendRequest<TResponse>(path, init, true);
  }

  return parseResponse<TResponse>(response, {
    method,
    path,
    url,
    hasRetried,
  });
};

const getFirstString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
};

const getStringValue = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return undefined;
    }
  }

  return undefined;
};

const getFirstOptionalString = (...values: unknown[]) => {
  for (const value of values) {
    const stringValue = getStringValue(value);

    if (stringValue !== undefined) {
      return stringValue;
    }
  }

  return undefined;
};

const getNumberValue = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const buildQueryParams = (params: Record<string, string | number | undefined>) => {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)] as [string, string]);

  return entries.length ? `?${new URLSearchParams(entries).toString()}` : "";
};

const normalizeAssistantType = (value: unknown): AssistantType | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.toLowerCase();

  if (normalized === "api" || normalized === "telegram" || normalized === "twilio") {
    return normalized;
  }

  return undefined;
};

const normalizeAssistant = (item: unknown, fallbackId?: string): Assistant | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id = getFirstString(record.assistant_id, record.id, record.uuid, record.token, fallbackId);
  const name = getFirstOptionalString(record.name, record.assistant_name, record.title) ?? "";

  if (!id) {
    return null;
  }

  return {
    id,
    name,
    configuration: getFirstOptionalString(record.configuration, record.prompt, record.system_prompt, record.instructions),
    type: normalizeAssistantType(record.type || record.channel || record.provider),
    created_at: getFirstString(record.created_at, record.createdAt),
    updated_at: getFirstString(record.updated_at, record.updatedAt),
  };
};

const getAssistantsArray = (response: unknown): unknown[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const record = response as Record<string, unknown>;
  const candidates = [record.answer, record.assistants, record.items, record.data, record.results];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      const nestedCandidates = [nested.assistants, nested.items, nested.data, nested.results];
      const nestedArray = nestedCandidates.find(Array.isArray);

      if (Array.isArray(nestedArray)) {
        return nestedArray;
      }
    }
  }

  return [];
};

const normalizeAssistantsListResponse = (response: unknown): Assistant[] =>
  getAssistantsArray(response)
    .map((item) => normalizeAssistant(item))
    .filter((assistant): assistant is Assistant => Boolean(assistant));

export const fetchAssistants = async () => {
  const response = await backendRequest<unknown>("/ai/assistants/list");

  return normalizeAssistantsListResponse(response);
};

const getAnswerPayload = (response: unknown, fallbackError: string) => {
  if (!response || typeof response !== "object") {
    return response;
  }

  const record = response as Record<string, unknown>;

  if (record.error) {
    throw new Error(getErrorMessage(response, fallbackError));
  }

  if ("answer" in record) {
    return record.answer;
  }

  return response;
};

const normalizeAssistantResponse = (response: unknown, fallbackError: string, fallbackId: string) => {
  const payload = getAnswerPayload(response, fallbackError);
  const assistant = normalizeAssistant(payload, fallbackId);

  if (!assistant) {
    throw new Error("Backend не вернул данные ассистента.");
  }

  return assistant;
};

export const fetchAssistant = async (id: string) => {
  const response = await backendRequest<unknown>(`/ai/assistants/${encodeURIComponent(id)}`);

  return normalizeAssistantResponse(response, "Не удалось загрузить ассистента", id);
};

export const updateAssistant = async (id: string, payload: UpdateAssistantPayload) => {
  const response = await backendRequest<unknown>(`/ai/assistants/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return normalizeAssistantResponse(response, "Не удалось сохранить ассистента", id);
};

const normalizeChat = (item: unknown): Chat | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id = getFirstString(record.id, record.chat_id, record.uuid);

  if (!id) {
    return null;
  }

  return {
    id,
    assistant_id: getFirstString(record.assistant_id, record.assistantId) ?? "",
    customer_id: getFirstString(record.customer_id, record.customerId, record.client_id, record.clientId) ?? "",
    platform: getFirstString(record.platform, record.channel, record.provider) ?? "-",
    created_at: getFirstString(record.created_at, record.createdAt) ?? "",
    updated_at: getFirstString(record.updated_at, record.updatedAt) ?? "",
    message_count: getNumberValue(record.message_count ?? record.messageCount ?? record.messages_count) ?? 0,
  };
};

const getChatsArray = (response: unknown): unknown[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const record = response as Record<string, unknown>;
  const answer = getAnswerPayload(response, "Не удалось загрузить разговоры");

  if (Array.isArray(answer)) {
    return answer;
  }

  const candidates = [record.chats, record.items, record.data, record.results];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

const normalizeChatsListResponse = (response: unknown): Chat[] =>
  getChatsArray(response)
    .map((item) => normalizeChat(item))
    .filter((chat): chat is Chat => Boolean(chat));

export const fetchChats = async (page: number, assistantIds: string) => {
  const query = buildQueryParams({
    page,
    assistant_ids: assistantIds,
  });
  const response = await backendRequest<unknown>(`/ai/chats/get_all${query}`);

  return normalizeChatsListResponse(response);
};

export const fetchChatsPagination = async (assistantIds: string) => {
  const query = buildQueryParams({ assistant_ids: assistantIds });
  const response = await backendRequest<unknown>(`/ai/chats/get_pagination${query}`);
  const payload = getAnswerPayload(response, "Не удалось загрузить пагинацию разговоров");

  return getNumberValue(payload) ?? 1;
};

export const searchChats = async (queryText: string, assistantIds: string, page = 1): Promise<SearchChatsResult> => {
  const query = buildQueryParams({
    chat: queryText,
    assistant_ids: assistantIds,
    page,
  });
  const response = await backendRequest<unknown>(`/ai/search_chat${query}`);

  if (!response || typeof response !== "object") {
    return { answer: [], total_count: 0 };
  }

  const record = response as Record<string, unknown>;

  if (record.error) {
    throw new Error(getErrorMessage(response, "Не удалось выполнить поиск"));
  }

  return {
    answer: normalizeChatsListResponse(response),
    total_count: getNumberValue(record.total_count ?? record.totalCount) ?? 0,
  };
};

const normalizeTwilioRegisterResponse = (response: unknown): TwilioRegisterResponse => {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;
    const answer = record.answer;
    const directWebhookUrl = record.webhook_url;

    if (typeof directWebhookUrl === "string") {
      return { webhook_url: directWebhookUrl };
    }

    if (answer && typeof answer === "object") {
      const answerRecord = answer as Record<string, unknown>;
      const answerWebhookUrl = answerRecord.webhook_url;

      if (typeof answerWebhookUrl === "string") {
        return { webhook_url: answerWebhookUrl };
      }
    }

    if (typeof answer === "string") {
      return { webhook_url: answer };
    }
  }

  throw new Error("Backend не вернул webhook_url для Twilio.");
};

export const registerTwilioAssistant = async (payload: TwilioRegisterPayload) => {
  const response = await backendRequest<unknown>("/ai/webhooks/twilio/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeTwilioRegisterResponse(response);
};

const normalizeApiRegisterResponse = (response: unknown): ApiRegisterResponse => {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;
    const answer = record.answer;
    const directToken = record.token || record.api_token || record.access_token;

    if (typeof directToken === "string") {
      return { token: directToken };
    }

    if (answer && typeof answer === "object") {
      const answerRecord = answer as Record<string, unknown>;
      const answerToken = answerRecord.token || answerRecord.api_token || answerRecord.access_token;

      if (typeof answerToken === "string") {
        return { token: answerToken };
      }
    }

    if (typeof answer === "string") {
      return { token: answer };
    }
  }

  throw new Error("Backend не вернул токен ассистента.");
};

export const registerApiAssistant = async (name: string) => {
  try {
    const response = await backendRequest<unknown>("/ai/webhooks/api/register", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    return normalizeApiRegisterResponse(response);
  } catch (error) {
    if (!(error instanceof ApiRequestError) || error.status !== 404) {
      throw error;
    }

    const fallbackResponse = await backendRequest<unknown>("/ai/assistants/register", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    return normalizeApiRegisterResponse(fallbackResponse);
  }
};
