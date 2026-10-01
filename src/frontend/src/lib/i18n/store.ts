import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SUPPORTED_LANGUAGES, type SupportedLanguage, type SupportedLanguageCode } from "./types";

interface I18nState {
  currentLanguage: SupportedLanguageCode;
  suggestedLanguage: SupportedLanguageCode | null;
  hasDismissedSuggestion: boolean;
  setLanguage: (lang: SupportedLanguageCode) => void;
  checkLocationForSuggestion: (state?: string, city?: string) => void;
  dismissSuggestion: () => void;
}

/**
 * Maps Indian State and prominent cities to regional language
 */
export function mapLocationToLanguage(state = "", city = ""): SupportedLanguageCode | null {
  const normState = state.toLowerCase().trim();
  const normCity = city.toLowerCase().trim();

  // Karnataka -> Kannada
  if (normState.includes("karnataka") || normCity.includes("bengaluru") || normCity.includes("bangalore") || normCity.includes("mysuru") || normCity.includes("mangalore")) {
    return "kn";
  }

  // Maharashtra -> Marathi
  if (normState.includes("maharashtra") || normCity.includes("mumbai") || normCity.includes("pune") || normCity.includes("nagpur") || normCity.includes("nashik")) {
    return "mr";
  }

  // West Bengal, Tripura -> Bengali
  if (normState.includes("bengal") || normState.includes("tripura") || normCity.includes("kolkata") || normCity.includes("howrah") || normCity.includes("siliguri")) {
    return "bn";
  }

  // Telangana, Andhra Pradesh -> Telugu
  if (normState.includes("telangana") || normState.includes("andhra") || normCity.includes("hyderabad") || normCity.includes("visakhapatnam") || normCity.includes("vijayawada")) {
    return "te";
  }

  // Tamil Nadu, Puducherry -> Tamil
  if (normState.includes("tamil") || normState.includes("puducherry") || normCity.includes("chennai") || normCity.includes("coimbatore") || normCity.includes("madurai")) {
    return "ta";
  }

  // Gujarat -> Gujarati
  if (normState.includes("gujarat") || normCity.includes("ahmedabad") || normCity.includes("surat") || normCity.includes("vadodara") || normCity.includes("rajkot")) {
    return "gu";
  }

  // Punjab, Chandigarh -> Punjabi
  if (normState.includes("punjab") || normCity.includes("amritsar") || normCity.includes("ludhiana") || normCity.includes("jalandhar")) {
    return "pa";
  }

  // Kerala -> Malayalam
  if (normState.includes("kerala") || normCity.includes("kochi") || normCity.includes("thiruvananthapuram") || normCity.includes("kozhikode")) {
    return "ml";
  }

  // Odisha -> Odia
  if (normState.includes("odisha") || normState.includes("orissa") || normCity.includes("bhubaneswar") || normCity.includes("cuttack")) {
    return "or";
  }

  // Assam -> Assamese
  if (normState.includes("assam") || normCity.includes("guwahati")) {
    return "as";
  }

  // Jammu & Kashmir -> Urdu
  if (normState.includes("kashmir") || normCity.includes("srinagar") || normCity.includes("jammu")) {
    return "ur";
  }

  // Hindi Belt (Delhi, UP, MP, Bihar, Rajasthan, Haryana, etc.)
  if (
    normState.includes("delhi") ||
    normState.includes("uttar pradesh") ||
    normState.includes("bihar") ||
    normState.includes("rajasthan") ||
    normState.includes("madhya pradesh") ||
    normState.includes("haryana") ||
    normState.includes("chhattisgarh") ||
    normState.includes("jharkhand") ||
    normState.includes("uttarakhand") ||
    normState.includes("himachal")
  ) {
    return "hi";
  }

  return null;
}

/**
 * Updates DOM documentElement attributes for language and text direction
 */
function applyDomAttributes(langCode: SupportedLanguageCode) {
  if (typeof document === "undefined") return;
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  const isRtl = Boolean(langObj?.isRtl);

  document.documentElement.lang = langCode;
  document.documentElement.dir = isRtl ? "rtl" : "ltr";

  if (isRtl) {
    document.documentElement.classList.add("rtl");
    document.body.classList.add("rtl");
  } else {
    document.documentElement.classList.remove("rtl");
    document.body.classList.remove("rtl");
  }
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      currentLanguage: "en", // English remains the default
      suggestedLanguage: null,
      hasDismissedSuggestion: false,

      setLanguage: (lang: SupportedLanguageCode) => {
        applyDomAttributes(lang);
        set({
          currentLanguage: lang,
          // When user explicitly selects a language, dismiss the suggestion
          suggestedLanguage: null,
          hasDismissedSuggestion: true,
        });

        // Persist to user account if available in store
        try {
          const rawCustomer = localStorage.getItem("ezy1_auth_user");
          if (rawCustomer) {
            const parsed = JSON.parse(rawCustomer);
            parsed.preferredLanguage = lang;
            localStorage.setItem("ezy1_auth_user", JSON.stringify(parsed));
          }
        } catch {
          // Non-blocking
        }
      },

      checkLocationForSuggestion: (state?: string, city?: string) => {
        if (get().hasDismissedSuggestion) return;
        const suggested = mapLocationToLanguage(state, city);
        // Only suggest if different from current language and not English
        if (suggested && suggested !== get().currentLanguage && suggested !== "en") {
          set({ suggestedLanguage: suggested });
        }
      },

      dismissSuggestion: () => {
        set({ suggestedLanguage: null, hasDismissedSuggestion: true });
      },
    }),
    {
      name: "ezy1_language_preference",
      onRehydrateStorage: () => (state) => {
        if (state?.currentLanguage) {
          applyDomAttributes(state.currentLanguage);
        }
      },
    },
  ),
);
