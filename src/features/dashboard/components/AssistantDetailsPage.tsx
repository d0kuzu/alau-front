import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import {
  fetchAssistant,
  updateAssistant,
  type Assistant,
} from "@/services/api/api";
import { getAssistantTypeMeta } from "./assistantDisplay";

type AssistantDetailsPageProps = {
  assistantId: string;
};

type AssistantEditorForm = {
  name: string;
  configuration: string;
};

const gradientStyle = {
  background: "linear-gradient(90deg, rgba(113, 181, 234, 1) 0%, rgba(81, 194, 251, 1) 80%)",
};

const getEditorForm = (assistant: Assistant): AssistantEditorForm => ({
  name: assistant.name ?? "",
  configuration: assistant.configuration ?? "",
});

const navigateToAssistantsState = { activeNav: "assistants" };

const AssistantDetailsPage = ({ assistantId }: AssistantDetailsPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [form, setForm] = useState<AssistantEditorForm>({ name: "", configuration: "" });
  const [initialForm, setInitialForm] = useState<AssistantEditorForm>({ name: "", configuration: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadAssistant = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchAssistant(assistantId);
      const nextForm = getEditorForm(data);

      setAssistant(data);
      setForm(nextForm);
      setInitialForm(nextForm);
    } catch (error) {
      setAssistant(null);
      toast({
        title: t.dashboard.assistantList.errors.title,
        description: error instanceof Error ? error.message : t.dashboard.assistantDetails.loadError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [assistantId, toast]);

  useEffect(() => {
    void loadAssistant();
  }, [loadAssistant]);

  const typeMeta = useMemo(() => getAssistantTypeMeta(assistant?.type, t.common.notSpecified), [assistant?.type, t.common.notSpecified]);
  const TypeIcon = typeMeta.icon;
  const isDirty = form.name !== initialForm.name || form.configuration !== initialForm.configuration;
  const hasRequiredFields = form.name.trim().length > 0 && form.configuration.trim().length > 0;
  const isSaveDisabled = !isDirty || !hasRequiredFields || isSaving || isLoading;

  const updateForm = (field: keyof AssistantEditorForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDirty || isSaving) {
      return;
    }

    if (!hasRequiredFields) {
      toast({
        title: t.dashboard.assistantDetails.requiredTitle,
        description: t.dashboard.assistantDetails.requiredDescription,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const updatedAssistant = await updateAssistant(assistantId, {
        name: form.name.trim(),
        configuration: form.configuration,
      });
      const nextForm = {
        name: updatedAssistant.name ?? form.name.trim(),
        configuration: updatedAssistant.configuration ?? form.configuration,
      };

      setAssistant({
        ...updatedAssistant,
        name: nextForm.name,
        configuration: nextForm.configuration,
      });
      setForm(nextForm);
      setInitialForm(nextForm);
      toast({ title: t.dashboard.assistantDetails.saved });
    } catch (error) {
      toast({
        title: t.dashboard.assistantDetails.saveErrorTitle,
        description: error instanceof Error ? error.message : t.dashboard.assistantDetails.saveError,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Button
          type="button"
          variant="ghost"
          className="mb-6 px-0 text-slate-600 hover:bg-transparent hover:text-slate-900"
          onClick={() => navigate("/dashboard", { state: navigateToAssistantsState })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.dashboard.assistantDetails.back}
        </Button>
        <div className="flex h-72 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <Loader2 className="h-7 w-7 animate-spin text-[#51C2FB]" />
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div>
        <Button
          type="button"
          variant="ghost"
          className="mb-6 px-0 text-slate-600 hover:bg-transparent hover:text-slate-900"
          onClick={() => navigate("/dashboard", { state: navigateToAssistantsState })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.dashboard.assistantDetails.back}
        </Button>
        <Card className="border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="mb-2 text-xl font-bold text-slate-900">{t.dashboard.assistantDetails.notFoundTitle}</h1>
          <p className="mb-5 text-sm text-slate-600">{t.dashboard.assistantDetails.notFoundDescription}</p>
          <Button type="button" variant="outline" onClick={() => void loadAssistant()}>
            {t.dashboard.assistantDetails.retry}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="mb-4 px-0 text-slate-600 hover:bg-transparent hover:text-slate-900"
            onClick={() => navigate("/dashboard", { state: navigateToAssistantsState })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.dashboard.assistantDetails.back}
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {assistant.name || t.dashboard.assistantList.unnamed}
          </h1>
          <p className="mt-1 break-all text-sm text-slate-500">ID: {assistant.id}</p>
        </div>
        <Button
          type="submit"
          className="w-full text-white hover:opacity-90 md:w-auto"
          style={!isSaveDisabled ? gradientStyle : undefined}
          disabled={isSaveDisabled}
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {t.dashboard.assistantDetails.save}
        </Button>
      </div>

      <Card className="border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div>
            <Label className="text-sm font-medium text-slate-700">{t.dashboard.assistantDetails.type}</Label>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#51C2FB]/10 text-[#1896d4]">
                <TypeIcon className="h-5 w-5" />
              </span>
              <span className="font-medium text-slate-900">{typeMeta.label}</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="assistant-name">Name</Label>
              <Input
                id="assistant-name"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className="bg-white border-slate-200 focus-visible:ring-[#51C2FB]/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistant-configuration">Configuration</Label>
              <Textarea
                id="assistant-configuration"
                value={form.configuration}
                onChange={(event) => updateForm("configuration", event.target.value)}
                className="min-h-[320px] resize-y bg-white border-slate-200 font-mono text-sm leading-6 focus-visible:ring-[#51C2FB]/30"
                required
              />
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default AssistantDetailsPage;
