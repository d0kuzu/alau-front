import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Copy, Plus, Search } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useToast } from "@/shared/hooks/use-toast";
import {
  fetchAssistants,
  loadAuthSession,
  registerApiAssistant,
  registerTwilioAssistant,
  type Assistant,
  type AssistantType,
} from "@/services/api/api";
import { assistantTypeOptions, getAssistantTypeMeta } from "./assistantDisplay";

type AssistantForm = {
  name: string;
  botToken: string;
  authToken: string;
  accountSid: string;
  twilioNumber: string;
};

const ASSISTANTS_CACHE_KEY = "diaxel_assistants";

const initialForm: AssistantForm = {
  name: "",
  botToken: "",
  authToken: "",
  accountSid: "",
  twilioNumber: "",
};

const gradientStyle = {
  background: "linear-gradient(90deg, rgba(113, 181, 234, 1) 0%, rgba(81, 194, 251, 1) 80%)",
};

const getAssistantsCacheKey = () => {
  const email = loadAuthSession()?.email;

  return email ? `${ASSISTANTS_CACHE_KEY}:${email}` : ASSISTANTS_CACHE_KEY;
};

const loadCachedAssistants = (): Assistant[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawAssistants = window.localStorage.getItem(getAssistantsCacheKey());

  if (!rawAssistants) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawAssistants);

    return Array.isArray(parsed) ? (parsed as Assistant[]) : [];
  } catch {
    window.localStorage.removeItem(getAssistantsCacheKey());
    return [];
  }
};

const saveCachedAssistants = (assistants: Assistant[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getAssistantsCacheKey(), JSON.stringify(assistants));
};

const formatDate = (date?: string) => {
  if (!date) {
    return "-";
  }

  try {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
};

const AssistantsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [assistants, setAssistants] = useState<Assistant[]>(loadCachedAssistants);
  const hadCachedAssistantsRef = useRef(assistants.length > 0);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [assistantType, setAssistantType] = useState<AssistantType>("api");
  const [form, setForm] = useState<AssistantForm>(initialForm);
  const [isLoadingAssistants, setIsLoadingAssistants] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const [apiToken, setApiToken] = useState<string | null>(null);

  const selectedTypeIndex = assistantTypeOptions.findIndex((type) => type.id === assistantType);
  const selectedType = assistantTypeOptions[selectedTypeIndex] ?? assistantTypeOptions[0];
  const SelectedTypeIcon = selectedType.icon;

  const loadAssistants = useCallback(
    async ({ showErrorToast = true }: { showErrorToast?: boolean } = {}) => {
      setIsLoadingAssistants(true);

      try {
        const data = await fetchAssistants();

        setAssistants(data);
        saveCachedAssistants(data);
      } catch (error) {
        if (showErrorToast) {
          toast({
            title: "Ошибка",
            description: error instanceof Error ? error.message : "Не удалось загрузить ассистентов",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoadingAssistants(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    void loadAssistants({ showErrorToast: !hadCachedAssistantsRef.current });
  }, [loadAssistants]);

  const updateForm = (field: keyof AssistantForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetCreateDialog = () => {
    setAssistantType("api");
    setForm(initialForm);
  };

  const handleCreateOpenChange = (open: boolean) => {
    setIsCreateOpen(open);

    if (!open) {
      resetCreateDialog();
    }
  };

  const handleCreateAssistant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (assistantType === "api") {
      setIsCreating(true);

      try {
        const response = await registerApiAssistant(form.name.trim());

        setApiToken(response.token);
        handleCreateOpenChange(false);
        void loadAssistants();
      } catch (error) {
        toast({
          title: "Ошибка создания",
          description: error instanceof Error ? error.message : "Не удалось создать ассистента",
          variant: "destructive",
        });
      } finally {
        setIsCreating(false);
      }

      return;
    }

    if (assistantType === "twilio") {
      setIsCreating(true);

      try {
        const response = await registerTwilioAssistant({
          name: form.name.trim(),
          twilio_number: form.twilioNumber.trim(),
          account_sid: form.accountSid.trim(),
          auth_token: form.authToken.trim(),
        });

        setWebhookUrl(response.webhook_url);
        handleCreateOpenChange(false);
        void loadAssistants();
      } catch (error) {
        toast({
          title: "Ошибка создания Twilio",
          description: error instanceof Error ? error.message : "Не удалось создать Twilio ассистента",
          variant: "destructive",
        });
      } finally {
        setIsCreating(false);
      }

      return;
    }

    toast({
      title: "Форма готова",
      description: `Эндпоинт для ${selectedType.label} подключим следующим шагом.`,
    });
  };

  const renderAssistantFields = () => {
    if (assistantType === "telegram") {
      return (
        <>
          <FormField
            id="telegram-assistant-name"
            label="Имя ассистента"
            placeholder="Мой ассистент"
            value={form.name}
            onChange={(value) => updateForm("name", value)}
            required
          />
          <FormField
            id="telegram-bot-token"
            label="Токен бота"
            placeholder="1234567890:AA..."
            value={form.botToken}
            onChange={(value) => updateForm("botToken", value)}
            type="password"
            required
          />
        </>
      );
    }

    if (assistantType === "twilio") {
      return (
        <>
          <FormField
            id="twilio-assistant-name"
            label="Имя"
            placeholder="Мой ассистент"
            value={form.name}
            onChange={(value) => updateForm("name", value)}
            required
          />
          <FormField
            id="twilio-auth-token"
            label="AuthToken"
            placeholder="Введите AuthToken"
            value={form.authToken}
            onChange={(value) => updateForm("authToken", value)}
            type="password"
            required
          />
          <FormField
            id="twilio-account-sid"
            label="AccountSID"
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={form.accountSid}
            onChange={(value) => updateForm("accountSid", value)}
            required
          />
          <FormField
            id="twilio-number"
            label="TwilioNumber"
            placeholder="+15551234567"
            value={form.twilioNumber}
            onChange={(value) => updateForm("twilioNumber", value)}
            type="tel"
            required
          />
        </>
      );
    }

    return (
      <FormField
        id="api-assistant-name"
        label="Имя ассистента"
        placeholder="Мой ассистент"
        value={form.name}
        onChange={(value) => updateForm("name", value)}
        required
      />
    );
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Ассистенты</h1>
        <p className="text-slate-600 text-sm md:text-base">Управление AI-ассистентами</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск ассистентов..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9 bg-white border-slate-200"
            disabled
          />
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="whitespace-nowrap text-white hover:opacity-90"
          style={gradientStyle}
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый ассистент
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Имя</TableHead>
              <TableHead className="font-semibold text-slate-700">Тип</TableHead>
              <TableHead className="font-semibold text-slate-700">Создан</TableHead>
              <TableHead className="font-semibold text-slate-700">Обновлён</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingAssistants && assistants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#51C2FB]" />
                  </div>
                </TableCell>
              </TableRow>
            ) : assistants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Ассистенты не найдены. Создайте нового ассистента.
                </TableCell>
              </TableRow>
            ) : (
              assistants.map((assistant) => {
                const typeMeta = getAssistantTypeMeta(assistant.type);
                const TypeIcon = typeMeta.icon;

                return (
                  <TableRow
                    key={assistant.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/dashboard/assistants/${encodeURIComponent(assistant.id)}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/dashboard/assistants/${encodeURIComponent(assistant.id)}`);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                  >
                    <TableCell className="font-medium text-slate-900">
                      {assistant.name || "Без имени"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#51C2FB]/10 text-[#1896d4]">
                          <TypeIcon className="h-4 w-4" />
                        </span>
                        {typeMeta.label}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{formatDate(assistant.created_at)}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(assistant.updated_at)}</TableCell>
                    <TableCell className="text-right text-slate-400">
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={handleCreateAssistant}>
            <DialogHeader>
              <DialogTitle>Новый ассистент</DialogTitle>
              <DialogDescription>Выберите тип ассистента и заполните поля подключения.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="relative grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-100 p-1">
                <div
                  className="absolute bottom-1 left-1 top-1 rounded-lg border border-[#51C2FB]/20 bg-white shadow-sm transition-transform duration-300 ease-out"
                  style={{
                    width: "calc((100% - 0.5rem) / 3)",
                    transform: `translateX(${selectedTypeIndex * 100}%)`,
                  }}
                />
                {assistantTypeOptions.map((type) => {
                  const Icon = type.icon;
                  const isActive = assistantType === type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setAssistantType(type.id)}
                      className={`relative z-10 flex h-11 items-center justify-center gap-2 rounded-lg px-2 text-xs font-semibold transition-colors sm:text-sm ${
                        isActive ? "text-[#1896d4]" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{type.label}</span>
                      {isActive && <Check className="hidden h-3.5 w-3.5 shrink-0 sm:block" />}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">{renderAssistantFields()}</div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleCreateOpenChange(false)} disabled={isCreating}>
                Отмена
              </Button>
              <Button type="submit" className="text-white hover:opacity-90" style={gradientStyle} disabled={isCreating}>
                <SelectedTypeIcon className="w-4 h-4 mr-2" />
                {isCreating ? "Создание..." : `Создать ${selectedType.label}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!apiToken} onOpenChange={(open) => !open && setApiToken(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ассистент создан</DialogTitle>
            <DialogDescription>Сохраните токен - он показывается только один раз.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 py-2">
            <code className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-mono break-all select-all">
              {apiToken}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={async () => {
                if (!apiToken) {
                  return;
                }

                await navigator.clipboard.writeText(apiToken);
                toast({ title: "Токен скопирован" });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setApiToken(null)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!webhookUrl} onOpenChange={(open) => !open && setWebhookUrl(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Twilio ассистент создан</DialogTitle>
            <DialogDescription>
              Привяжите webhook Twilio Messages к этому эндпоинту, чтобы входящие сообщения попадали в ассистента.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 py-2">
            <code className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-mono break-all select-all">
              {webhookUrl}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={async () => {
                if (!webhookUrl) {
                  return;
                }

                await navigator.clipboard.writeText(webhookUrl);
                toast({ title: "Webhook URL скопирован" });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setWebhookUrl(null)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

const FormField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="bg-white border-slate-200 focus-visible:ring-[#51C2FB]/30"
      required={required}
    />
  </div>
);

export default AssistantsPage;
