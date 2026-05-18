import { type ComponentType } from "react";
import { Bot, Code2, Phone } from "lucide-react";

import { type AssistantType } from "@/services/api/api";

export type AssistantTypeOption = {
  id: AssistantType;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const assistantTypeOptions: AssistantTypeOption[] = [
  {
    id: "api",
    label: "API",
    icon: Code2,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: TelegramIcon,
  },
  {
    id: "twilio",
    label: "Twilio",
    icon: Phone,
  },
];

export const assistantTypeLabels: Record<AssistantType, string> = {
  api: "API",
  telegram: "Telegram",
  twilio: "Twilio",
};

const assistantTypeMeta = assistantTypeOptions.reduce(
  (accumulator, option) => ({
    ...accumulator,
    [option.id]: option,
  }),
  {} as Record<AssistantType, AssistantTypeOption>,
);

export const getAssistantTypeMeta = (type?: AssistantType, fallbackLabel = "Не указан"): AssistantTypeOption => {
  if (type && assistantTypeMeta[type]) {
    return assistantTypeMeta[type];
  }

  return {
    id: "api",
    label: fallbackLabel,
    icon: Bot,
  };
};
