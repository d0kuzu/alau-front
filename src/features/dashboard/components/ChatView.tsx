import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { getValidAccessToken, type Chat } from "@/services/api/api";

type ChatMessage = {
  author: "client" | "bot";
  body: string;
};

type ChatViewProps = {
  chat: Chat;
  onBack: () => void;
};

const formatDate = (iso: string, locale: string) => {
  if (!iso) {
    return "-";
  }

  try {
    return new Date(iso).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const normalizeAuthor = (value: unknown): ChatMessage["author"] => {
  if (typeof value !== "string") {
    return "bot";
  }

  const normalized = value.toLowerCase();

  return normalized === "client" || normalized === "customer" || normalized === "user" ? "client" : "bot";
};

const normalizeBody = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined || value === null) {
    return "";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const ChatView = ({ chat, onBack }: ChatViewProps) => {
  const { toast } = useToast();
  const { t, dateLocale } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const receivedAnyRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;
    let socket: WebSocket | null = null;

    const connect = async () => {
      setMessages([]);
      setIsConnecting(true);
      receivedAnyRef.current = false;

      try {
        const accessToken = await getValidAccessToken();

        if (cancelled) {
          return;
        }

        const wsUrl = `wss://api.zerde.co/diaxel/ai/websocket/get_conversation?token=${encodeURIComponent(accessToken)}&chat=${encodeURIComponent(chat.id)}`;
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (!cancelled) {
            setIsConnecting(false);
          }
        };

        socket.onmessage = (event) => {
          if (cancelled) {
            return;
          }

          receivedAnyRef.current = true;
          setIsConnecting(false);

          try {
            const raw = JSON.parse(event.data) as Record<string, unknown>;
            const body = normalizeBody(raw.Body ?? raw.body ?? raw.message ?? raw.content ?? raw.text);

            if (!body) {
              return;
            }

            setMessages((currentMessages) => [
              ...currentMessages,
              {
                author: normalizeAuthor(raw.Author ?? raw.author ?? raw.role ?? raw.sender),
                body,
              },
            ]);
          } catch {
            // Some gateways occasionally send ping-like non-JSON frames.
          }
        };

        socket.onerror = () => {
          if (cancelled || receivedAnyRef.current) {
            return;
          }

          toast({
            title: t.dashboard.chat.connectionErrorTitle,
            description: t.dashboard.chat.connectionError,
            variant: "destructive",
          });
        };

        socket.onclose = (event) => {
          if (cancelled || receivedAnyRef.current || event.code === 1000) {
            return;
          }

          toast({
            title: t.dashboard.chat.closedTitle,
            description: t.dashboard.chat.closedDescription,
            variant: "destructive",
          });
        };
      } catch (error) {
        if (cancelled) {
          return;
        }

        setIsConnecting(false);
        toast({
          title: t.dashboard.assistantList.errors.title,
          description: error instanceof Error ? error.message : t.dashboard.chat.openError,
          variant: "destructive",
        });
      }
    };

    void connect();

    return () => {
      cancelled = true;
      socket?.close(1000);
      wsRef.current = null;
    };
  }, [chat.id, toast]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-4rem)]">
      <div className="mb-4 flex shrink-0 items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 md:text-xl">{t.dashboard.chat.title}</h1>
          <p className="max-w-[320px] truncate font-mono text-xs text-slate-500">{chat.id}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {isConnecting ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#51C2FB]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                {t.dashboard.chat.empty}
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={`${message.author}-${index}`}
                    className={`flex ${message.author === "client" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        message.author === "client"
                          ? "rounded-bl-md bg-slate-100 text-slate-900"
                          : "rounded-br-md bg-[#51C2FB] text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.body}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <div className="hidden w-72 shrink-0 flex-col overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 lg:flex">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t.dashboard.chat.info}
          </h2>
          <div className="space-y-4">
            <InfoItem label="Assistant ID" value={chat.assistant_id} mono />
            <InfoItem label="Customer ID" value={chat.customer_id} />
            <InfoItem label={t.common.platform} value={chat.platform} />
            <InfoItem label={t.common.created} value={formatDate(chat.created_at, dateLocale)} />
            <InfoItem label={t.common.updated} value={formatDate(chat.updated_at, dateLocale)} />
          </div>
        </div>
      </div>
    </div>
  );
};

type InfoItemProps = {
  label: string;
  value: string;
  mono?: boolean;
};

const InfoItem = ({ label, value, mono }: InfoItemProps) => (
  <div>
    <p className="mb-1 text-xs text-slate-400">{label}</p>
    <p className={`break-all text-sm text-slate-900 ${mono ? "font-mono text-xs" : ""}`}>{value || "-"}</p>
  </div>
);

export default ChatView;
