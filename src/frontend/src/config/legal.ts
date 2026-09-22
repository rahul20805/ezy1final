/**
 * Centralized Legal Documents Configuration for EZY1 Platform
 * Compliant with Consumer Protection (E-Commerce) Rules 2020 & DPDP Act 2023.
 */

export interface LegalDoc {
  id: string;
  title: string;
  shortTitle: string;
  url: string | null;
  downloadName?: string;
  description: string;
  available: boolean;
  effectiveDate: string;
  version: string;
}

export const LEGAL_DOCS: Record<"userTerms" | "partnerTerms" | "privacyPolicy" | "refundPolicy" | "grievancePolicy", LegalDoc> = {
  userTerms: {
    id: "user-terms",
    title: "User Terms & Conditions",
    shortTitle: "User Terms",
    url: "/legal/ezy1-user-terms-and-conditions.pdf",
    downloadName: "EZY1_User_Terms_and_Conditions.pdf",
    description: "General Terms of Service, Marketplace Rules & Customer Rights",
    available: true,
    effectiveDate: "21/09/2026",
    version: "1.0",
  },
  partnerTerms: {
    id: "partner-terms",
    title: "Partner Agreement / Partner Terms",
    shortTitle: "Partner Terms",
    url: "/legal/ezy1-master-partner-agreement.pdf",
    downloadName: "EZY1_Master_Partner_Agreement.pdf",
    description: "Master Partner Agreement for Vendors, Fleet, Drivers, Healthcare & Local Merchants",
    available: true,
    effectiveDate: "21/09/2026",
    version: "1.0",
  },
  privacyPolicy: {
    id: "privacy-policy",
    title: "Universal Privacy Policy",
    shortTitle: "Privacy Policy",
    url: "/legal/ezy1-universal-privacy-policy.pdf",
    downloadName: "EZY1_Universal_Privacy_Policy.pdf",
    description: "Privacy, Data Governance & DPDP Protection for the Entire EZY1 Ecosystem",
    available: true,
    effectiveDate: "21/09/2026",
    version: "1.0",
  },
  refundPolicy: {
    id: "refund-policy",
    title: "Refund & Cancellation Policy",
    shortTitle: "Refund Policy",
    url: null, // Standalone PDF not provided/uploaded. Governed under User Terms (§§10-12) & Partner Agreement (Part K).
    description: "Cancellation terms, return windows, and automated refund processing protocols",
    available: false,
    effectiveDate: "21/09/2026",
    version: "1.0",
  },
  grievancePolicy: {
    id: "grievance-policy",
    title: "Grievance / Legal Policy",
    shortTitle: "Grievance Policy",
    url: null, // Standalone PDF not provided/uploaded. Governed under Universal Privacy Policy (§44) & User Terms (§45).
    description: "Statutory Grievance Redressal Officer escalation and dispute handling mechanism",
    available: false,
    effectiveDate: "21/09/2026",
    version: "1.0",
  },
};
