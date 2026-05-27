import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";
import { useLanguage } from "@/shared/contexts/LanguageContext";

type LegalSection = {
  heading?: string;
  paragraphs: readonly string[];
  list?: readonly string[];
  contact?: boolean;
  muted?: boolean;
};

type LegalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  acceptLabel: string;
  sections: readonly LegalSection[];
  phoneLabel: string;
};

const LegalDialog = ({
  open,
  onOpenChange,
  title,
  acceptLabel,
  sections,
  phoneLabel,
}: LegalDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[85vh]">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-foreground">{title}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[55vh] pr-4">
        <div className="space-y-6 text-sm">
          {sections.map((section, sectionIndex) => (
            <section key={`${title}-${sectionIndex}`}>
              {section.heading && <h3 className="text-lg font-semibold mb-2">{section.heading}</h3>}
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={`${title}-${sectionIndex}-${paragraphIndex}`}
                  className={section.muted ? "text-xs text-muted-foreground italic" : "text-muted-foreground mb-2 last:mb-0"}
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.contact && (
                <p className="text-muted-foreground mt-2">
                  Email: <a href="mailto:hello@zerde.ai" className="text-primary hover:underline">hello@zerde.ai</a><br />
                  {phoneLabel}: +7 700 000 00 00<br />
                  Telegram: @alauai
                </p>
              )}
            </section>
          ))}
        </div>
      </ScrollArea>
      <DialogFooter className="mt-4 border-t pt-4">
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-2 flex items-center gap-2"
        >
          <Check className="h-5 w-5" />
          {acceptLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <footer className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/50" style={{
        backgroundColor: 'rgba(247, 247, 247, 1)'
      }}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-sm text-muted-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:underline decoration-primary/50 underline-offset-4"
            >
              {t.footer.privacyLink}
            </button>
            <span className="text-muted-foreground/40 text-lg">•</span>
            <span className="text-sm text-muted-foreground/80 font-medium tracking-wide">
              {t.footer.rights}
            </span>
            <span className="text-muted-foreground/40 text-lg">•</span>
            <button
              onClick={() => setShowTerms(true)}
              className="text-sm text-muted-foreground/80 hover:text-primary transition-all duration-200 font-medium hover:underline decoration-primary/50 underline-offset-4"
            >
              {t.footer.termsLink}
            </button>
          </div>
        </div>
      </footer>

      <LegalDialog
        open={showPrivacy}
        onOpenChange={setShowPrivacy}
        title={t.footer.privacy.title}
        acceptLabel={t.footer.privacy.accept}
        sections={t.footer.privacy.sections}
        phoneLabel={t.footer.phoneLabel}
      />

      <LegalDialog
        open={showTerms}
        onOpenChange={setShowTerms}
        title={t.footer.terms.title}
        acceptLabel={t.footer.terms.accept}
        sections={t.footer.terms.sections}
        phoneLabel={t.footer.phoneLabel}
      />
    </>
  );
};

export default Footer;
