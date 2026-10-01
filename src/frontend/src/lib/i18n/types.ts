export type SupportedLanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "te"
  | "ta"
  | "gu"
  | "ur"
  | "kn"
  | "pa"
  | "ml"
  | "or"
  | "as";

export interface SupportedLanguage {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  script: string;
  regions: string[];
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    script: "Latin",
    regions: ["All India", "Global"],
    isRtl: false,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    regions: ["Delhi", "Uttar Pradesh", "Bihar", "Madhya Pradesh", "Rajasthan", "Haryana"],
    isRtl: false,
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    script: "Kannada",
    regions: ["Karnataka", "Bengaluru"],
    isRtl: false,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    regions: ["West Bengal", "Tripura", "Assam"],
    isRtl: false,
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    script: "Devanagari",
    regions: ["Maharashtra", "Mumbai", "Pune"],
    isRtl: false,
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    script: "Telugu",
    regions: ["Andhra Pradesh", "Telangana", "Hyderabad"],
    isRtl: false,
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    script: "Tamil",
    regions: ["Tamil Nadu", "Chennai", "Puducherry"],
    isRtl: false,
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    script: "Gujarati",
    regions: ["Gujarat", "Ahmedabad", "Surat"],
    isRtl: false,
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    script: "Arabic",
    regions: ["Jammu & Kashmir", "Telangana", "Delhi", "Uttar Pradesh"],
    isRtl: true,
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
    regions: ["Punjab", "Chandigarh", "Delhi"],
    isRtl: false,
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    script: "Malayalam",
    regions: ["Kerala", "Kochi", "Thiruvananthapuram"],
    isRtl: false,
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    script: "Odia",
    regions: ["Odisha", "Bhubaneswar"],
    isRtl: false,
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    script: "Bengali-Assamese",
    regions: ["Assam", "Guwahati"],
    isRtl: false,
  },
];
