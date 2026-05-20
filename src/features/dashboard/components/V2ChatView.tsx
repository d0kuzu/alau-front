import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { getValidAccessToken, type Chat } from "@/services/api/api";

type ChatMessage = {
  author: "client" | "bot";
  body: string;
};

type V2ChatViewProps = {
  agentName: string;
  chat: Chat;
  onBack: () => void;
};

const formatDateTime = (iso: string) => {
  if (!iso) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(iso));
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

const V2ChatView = ({ agentName, chat, onBack }: V2ChatViewProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [manualMessage, setManualMessage] = useState("");
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
            title: "Connection error",
            description: "Failed to open the conversation stream.",
            variant: "destructive",
          });
        };

        socket.onclose = (event) => {
          if (cancelled || receivedAnyRef.current || event.code === 1000) {
            return;
          }

          toast({
            title: "Connection closed",
            description: "The conversation stream was closed unexpectedly.",
            variant: "destructive",
          });
        };
      } catch (error) {
        if (cancelled) {
          return;
        }

        setIsConnecting(false);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to open the conversation.",
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
    <div className="min-h-[calc(100vh-6rem)]">
      <header className="-mx-10 mb-8 border-b border-[#e6ebf2] px-10 pb-5">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mt-1 h-9 w-9 rounded-full text-[#465468] hover:bg-[#f4f5f7]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-[1.65rem] font-bold leading-tight text-[#071225]">
                Conversation with {chat.customer_id || "-"}
              </h1>
              <p className="mt-2 truncate text-base font-medium text-[#536177]">ID: {chat.id}</p>
            </div>
          </div>

          <span className="mt-1 rounded-full border border-[#b8f0c9] bg-[#d9fbe4] px-4 py-1.5 text-base font-semibold text-[#15803d]">
            Active
          </span>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_535px]">
        <section className="flex min-h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-[8px] border border-[#dfe6ef] bg-white">
          <div className="border-b border-[#e6ebf2] px-5 py-8 md:px-6">
            <h2 className="text-[2.2rem] font-bold leading-tight text-[#071225]">Message History</h2>
            <p className="mt-2 text-lg font-medium text-[#465468]">
              {chat.message_count || messages.length} messages exchanged
            </p>
          </div>

          <div className="min-h-[28rem] flex-1 space-y-7 overflow-y-auto px-7 py-8">
            {isConnecting ? (
              <div className="flex h-full min-h-[18rem] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#ff8f6a]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full min-h-[18rem] items-center justify-center text-base text-[#66748a]">
                No messages yet
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={`${message.author}-${index}`}
                    className={`flex ${message.author === "client" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-[24px] px-5 py-4 text-lg font-medium leading-relaxed shadow-sm ${
                        message.author === "client"
                          ? "border border-[#e6ebf2] bg-white text-[#071225]"
                          : "bg-[#ff8f6a] text-white"
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

          <div className="border-t border-[#e6ebf2] px-5 py-5">
            <div className="flex gap-4">
              <Input
                value={manualMessage}
                onChange={(event) => setManualMessage(event.target.value)}
                placeholder="Type a manual message to send..."
                className="h-[52px] rounded-[6px] border-[#dfe6ef] px-4 text-lg text-[#071225] placeholder:text-[#718199] focus-visible:ring-[#ff8f6a]/30"
              />
              <Button
                type="button"
                disabled
                className="h-[52px] rounded-[8px] bg-[#ffb39d] px-6 text-lg font-semibold text-white opacity-100 shadow-none hover:bg-[#ffb39d]"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-[8px] border border-[#dfe6ef] bg-white px-6 py-7">
          <h2 className="mb-6 text-[2rem] font-bold leading-tight text-[#071225]">Conversation Details</h2>
          <div className="space-y-5 text-lg">
            <DetailItem icon={User} label="Agent" value={agentName || "AVA"} />
            <DetailItem icon={Phone} label="Customer Number" value={chat.customer_id || "-"} />
            <DetailItem icon={CalendarDays} label="Created" value={formatDateTime(chat.created_at)} />
            <DetailItem icon={Clock} label="Last Activity" value={formatDateTime(chat.updated_at)} />
            <DetailItem icon={MessageSquare} label="Message Count" value={String(chat.message_count || messages.length)} />
          </div>
        </aside>
      </div>
    </div>
  );
};

type DetailItemProps = {
  icon: typeof User;
  label: string;
  value: string;
};

const DetailItem = ({ icon: Icon, label, value }: DetailItemProps) => (
  <div>
    <p className="mb-1 text-lg font-medium text-[#68788f]">{label}</p>
    <div className="flex items-center gap-3 text-lg font-medium text-[#1f2937]">
      <Icon className="h-5 w-5 shrink-0 text-[#465468]" strokeWidth={1.8} />
      <span className="break-all">{value}</span>
    </div>
  </div>
);

export default V2ChatView;
