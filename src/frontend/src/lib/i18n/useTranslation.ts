import { useCallback, useMemo } from "react";
import { useI18nStore } from "./store";
import { translate } from "./translations";
import { SUPPORTED_LANGUAGES, type SupportedLanguage, type SupportedLanguageCode } from "./types";

export function useTranslation() {
  const currentLanguage = useI18nStore((s) => s.currentLanguage);
  const suggestedLanguage = useI18nStore((s) => s.suggestedLanguage);
  const setLanguage = useI18nStore((s) => s.setLanguage);
  const dismissSuggestion = useI18nStore((s) => s.dismissSuggestion);
  const checkLocationForSuggestion = useI18nStore((s) => s.checkLocationForSuggestion);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return translate(currentLanguage, key, params);
    },
    [currentLanguage],
  );

  const currentLanguageObj: SupportedLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [currentLanguage]);

  const suggestedLanguageObj: SupportedLanguage | null = useMemo(() => {
    if (!suggestedLanguage) return null;
    return SUPPORTED_LANGUAGES.find((l) => l.code === suggestedLanguage) || null;
  }, [suggestedLanguage]);

  const isRTL = Boolean(currentLanguageObj.isRtl);

  return {
    t,
    language: currentLanguage,
    currentLanguage, // alias for convenience
    currentLanguageObj,
    suggestedLanguage,
    suggestedLanguageObj,
    setLanguage,
    dismissSuggestion,
    checkLocationForSuggestion,
    isRTL,
    isRtl: isRTL, // alias for convenience
    languages: SUPPORTED_LANGUAGES,
  };
}
