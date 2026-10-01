import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { SUPPORTED_LANGUAGES, type SupportedLanguageCode } from "@/lib/i18n/types";
import { Check, Globe, MapPin, Search, Sparkles, X } from "lucide-react";
import React, { useState, useMemo } from "react";

interface LanguageSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    currentLanguage,
    setLanguage,
    suggestedLanguage,
    dismissSuggestion,
    t,
    isRtl,
  } = useTranslation();

  const [searchFilter, setSearchFilter] = useState("");

  const suggestedLangMeta = useMemo(() => {
    if (!suggestedLanguage) return null;
    return SUPPORTED_LANGUAGES.find((l) => l.code === suggestedLanguage) || null;
  }, [suggestedLanguage]);

  const filteredLanguages = useMemo(() => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.regions.some((r) => r.toLowerCase().includes(q))
    );
  }, [searchFilter]);

  const handleSelectLanguage = (code: SupportedLanguageCode) => {
    setLanguage(code);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/20">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold font-display text-foreground">
                  {t("common.chooseLanguage")}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Select your preferred language. You can change this anytime.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Location-based smart suggestion banner (non-intrusive) */}
          {suggestedLangMeta && suggestedLanguage !== currentLanguage && (
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>{t("common.suggestedForYou")}:</span>
                    <span className="text-primary font-bold">
                      {suggestedLangMeta.nativeName} ({suggestedLangMeta.name})
                    </span>
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Based on your active location ({suggestedLangMeta.regions.slice(0, 2).join(", ")})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => suggestedLanguage && handleSelectLanguage(suggestedLanguage)}
                  className="h-7 px-3 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Switch
                </Button>
                <button
                  type="button"
                  onClick={dismissSuggestion}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Quick search input */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by language, script, or state (e.g. Hindi, ಕನ್ನಡ, Bengal)..."
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-background border border-border text-xs outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              const isSuggested = suggestedLanguage === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                      : "border-border/70 hover:border-primary/40 hover:bg-muted/40 bg-card"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-foreground">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        • {lang.name}
                      </span>
                      {isSuggested && !isSelected && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 bg-primary/15 text-primary border-primary/20 font-bold"
                        >
                          Suggested
                        </Badge>
                      )}
                      {lang.isRtl && (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 text-muted-foreground"
                        >
                          RTL
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {lang.regions.slice(0, 3).join(", ")}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-border/80 flex items-center justify-center text-transparent hover:border-primary/50">
                        <Check className="w-3 h-3 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-xs">
              No languages matched &quot;{searchFilter}&quot;.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between text-[11px] text-muted-foreground px-5">
          <span>Supported: 13 Official & Regional Languages across India</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-7 text-xs"
          >
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
