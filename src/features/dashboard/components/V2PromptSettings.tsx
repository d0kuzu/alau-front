import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";
import {
  fetchAssistant,
  updateAssistant,
  type Assistant,
} from "@/services/api/api";
import { V2_ASSISTANT_ID } from "../constants/v2";

type PromptForm = {
  name: string;
  configuration: string;
};

const getPromptForm = (assistant: Assistant): PromptForm => ({
  name: assistant.name ?? "",
  configuration: assistant.configuration ?? "",
});

const V2PromptSettings = () => {
  const { toast } = useToast();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [form, setForm] = useState<PromptForm>({ name: "", configuration: "" });
  const [initialForm, setInitialForm] = useState<PromptForm>({ name: "", configuration: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadAssistant = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchAssistant(V2_ASSISTANT_ID);
      const nextForm = getPromptForm(data);

      setAssistant(data);
      setForm(nextForm);
      setInitialForm(nextForm);
    } catch (error) {
      setAssistant(null);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadAssistant();
  }, [loadAssistant]);

  const isDirty = form.configuration !== initialForm.configuration;
  const hasRequiredFields = form.name.trim().length > 0 && form.configuration.trim().length > 0;
  const isSaveDisabled = !isDirty || !hasRequiredFields || isSaving || isLoading;

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDirty || isSaving) {
      return;
    }

    if (!hasRequiredFields) {
      toast({
        title: "Fill in the fields",
        description: "The assistant prompt is required before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const updatedAssistant = await updateAssistant(V2_ASSISTANT_ID, {
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
      toast({ title: "Assistant saved" });
    } catch (error) {
      toast({
        title: "Save error",
        description: error instanceof Error ? error.message : "Failed to save assistant",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[2.25rem] font-bold leading-tight text-[#071225]">AI Prompt Settings</h1>
          <p className="mt-3 text-[1.45rem] font-medium text-[#68788f]">
            Manage the AI assistant's system prompt
          </p>
        </div>

        {isDirty && (
          <Button
            type="submit"
            disabled={isSaveDisabled}
            className="h-[50px] rounded-[8px] bg-[#ff8f6a] px-6 text-lg font-semibold text-white shadow-none hover:bg-[#ff7d53]"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        )}
      </div>

      <section className="rounded-[8px] border border-[#dfe6ef] bg-white px-8 py-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="mb-8">
          <h2 className="text-[1.9rem] font-bold leading-tight text-[#071225]">System Prompt</h2>
          <p className="mt-2 text-lg font-medium text-[#68788f]">
            Edit the prompt that defines how the AI assistant behaves and responds to customers
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-[560px] items-center justify-center rounded-[6px] border border-[#dfe6ef]">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff8f6a]" />
          </div>
        ) : !assistant ? (
          <div className="flex h-[560px] flex-col items-center justify-center rounded-[6px] border border-[#dfe6ef] text-center">
            <p className="mb-4 text-lg font-medium text-[#68788f]">Assistant could not be loaded.</p>
            <Button type="button" variant="outline" onClick={() => void loadAssistant()}>
              Retry
            </Button>
          </div>
        ) : (
          <Textarea
            value={form.configuration}
            onChange={(event) => setForm((current) => ({ ...current, configuration: event.target.value }))}
            className="min-h-[630px] resize-y rounded-[6px] border-[#dfe6ef] bg-white px-4 py-4 font-mono text-base leading-7 text-[#010817] focus-visible:ring-[#ff8f6a]/30"
            required
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            }}
          />
        )}
      </section>
    </form>
  );
};

export default V2PromptSettings;
