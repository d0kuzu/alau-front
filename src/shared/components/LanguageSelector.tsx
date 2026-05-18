import { Check, Globe2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { type Language } from "@/shared/lib/translations";

const accountBlueButtonStyle = {
  color: "rgba(240, 240, 240, 1)",
  backgroundColor: "rgba(81, 194, 251, 1)",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: "rgba(81, 194, 251, 1)",
};

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "ru", label: "RU" },
  { value: "en", label: "ENG" },
];

type LanguageSelectorProps = {
  className?: string;
  fullWidth?: boolean;
};

const LanguageSelector = ({ className, fullWidth = false }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = useLanguage();
  const currentLanguage = languageOptions.find((option) => option.value === language) ?? languageOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={t.common.languageSelector}
          className={`items-center px-3 font-semibold hover:opacity-90 ${fullWidth ? "flex w-full justify-center" : "hidden md:flex"} ${className ?? ""}`}
          style={accountBlueButtonStyle}
        >
          <span className="inline-flex items-center justify-center gap-2 leading-none">
            <Globe2 className="h-4 w-4 shrink-0" />
            <span className="block leading-none">{currentLanguage.label}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLanguage(option.value)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span>{option.label}</span>
            {language === option.value && <Check className="h-4 w-4 text-[#51C2FB]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
