import { useState, useRef } from "react";
import { Card } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Save } from "lucide-react";

const INITIAL_PROMPT = `#Agent Role:
You are a Training Advisor from Cinta Aveda Institute. Your goal is to welcome new leads and answer every customer question about our program and our institute by following the script. If a customer goes outside the script, always answer their questions and go back to the script. Then your goal is to propose booking a Campus Tour Scheduling (you are not booking sessions date but a visit to our school) by using the related functions. The function will return you the relevant URL, never provide other URLs. Be sure to understand the difference between a discovery appointment that you are booking now and the sessions date that are the school sessions. You don't talk the precise next available sessions date. All that information will be discussed with a training representative during the appointment. You need to understand every customer message, if the message is unclear or seems to be incomplete don't hesitate to clarify with the customer.

#Agent Specifics:
Language & scope`;

const PromptSettings = () => {
  const [prompt, setPrompt] = useState(INITIAL_PROMPT);
  const originalPromptRef = useRef(INITIAL_PROMPT);

  const hasChanges = prompt !== originalPromptRef.current;

  const handleSave = () => {
    // Здесь будет логика сохранения промпта
    console.log("Saving prompt:", prompt);
    // После успешного сохранения обновляем исходное значение
    originalPromptRef.current = prompt;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Настройки промпта AI
        </h1>
        <p className="text-slate-600 text-base">
          Управляйте системным промптом AI-ассистента
        </p>
      </div>

      {/* Карточка с промптом */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Системный промпт
          </h2>
          <p className="text-sm text-slate-600">
            Редактируйте промпт, который определяет, как AI-ассистент ведет себя и отвечает клиентам
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex min-h-[500px] font-mono text-sm leading-relaxed border-slate-200 focus:border-[#51C2FB] focus:ring-2 focus:ring-[#51C2FB]/20 resize-y"
            placeholder="Введите системный промпт..."
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}
          />

          {hasChanges && (
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                className="text-white font-medium shadow-md hover:opacity-90 transition-opacity"
                style={{
                  background: "linear-gradient(90deg, rgba(113, 181, 234, 1) 0%, rgba(81, 194, 251, 1) 80%)"
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить изменения
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PromptSettings;

