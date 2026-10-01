import type { SupportedLanguageCode } from "../types";
import { as } from "./as";
import { bn } from "./bn";
import { en, type TranslationDictionary } from "./en";
import { gu } from "./gu";
import { hi } from "./hi";
import { kn } from "./kn";
import { ml } from "./ml";
import { mr } from "./mr";
import { or } from "./or";
import { pa } from "./pa";
import { ta } from "./ta";
import { te } from "./te";
import { ur } from "./ur";

export const DICTIONARIES: Record<SupportedLanguageCode, TranslationDictionary> = {
  en,
  hi,
  kn,
  bn,
  mr,
  te,
  ta,
  gu,
  ur,
  pa,
  ml,
  or,
  as,
};

/**
 * Safely traverses an object with dot notation e.g. "nav.allServices"
 */
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Resolves a translation key with fallback to English, and performs variable substitution
 */
export function translate(
  lang: SupportedLanguageCode,
  key: string,
  params?: Record<string, string | number>,
): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES.en;
  let text = getNestedValue(dict, key);

  // Fallback to English if key is missing in target language
  if (!text && lang !== "en") {
    text = getNestedValue(DICTIONARIES.en, key);
  }

  // If still missing, return the last token of the key or the key itself
  if (!text) {
    const parts = key.split(".");
    return parts[parts.length - 1] || key;
  }

  // Variable interpolation: replace {param} with params[param]
  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text!.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
    });
  }

  return text;
}
