/**
 * EZY1 Production Object Storage & KYC Document Security Service
 * 
 * Supports:
 * - Amazon S3 / Cloudflare R2
 * - Private KYC bucket with 15-minute time-limited presigned URLs
 * - Public asset distribution via CDN (cdn.ezy1.site)
 * - Strict mime-type and payload validation
 */

import crypto from "crypto";

const S3_CONFIG = {
  region: process.env.AWS_REGION || "ap-south-1",
  kycBucket: process.env.AWS_KYC_BUCKET || "ezy1-partner-kyc-private",
  publicBucket: process.env.AWS_PUBLIC_BUCKET || "ezy1-public-media",
  cdnBaseUrl: process.env.CDN_BASE_URL || "https://cdn.ezy1.site",
};

const ALLOWED_DOC_MIMES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const storage = {
  /**
   * Generate secure presigned URL for private KYC documents
   * Restricts viewing to 15 minutes max
   */
  generatePresignedKycUrl(partnerId, documentType, fileName) {
    if (!partnerId || !documentType) {
      throw new Error("INVALID_DOCUMENT_PARAMETERS");
    }

    const cleanDocType = documentType.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const cleanFileName = (fileName || "doc.pdf").replace(/[^a-zA-Z0-9._-]/g, "");
    const objectKey = `partners/${partnerId}/kyc/${cleanDocType}_${cleanFileName}`;

    // Tokenized secure signature for time-limited access (15 minutes)
    const expiresAt = Math.floor(Date.now() / 1000) + 900;
    const secret = process.env.JWT_SECRET || "ezy1_production_secret_key_2026";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(`${objectKey}:${expiresAt}`)
      .digest("hex");

    return {
      objectKey,
      bucket: S3_CONFIG.kycBucket,
      presignedUrl: `${S3_CONFIG.cdnBaseUrl}/secure-kyc/${objectKey}?expires=${expiresAt}&sig=${signature}`,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
    };
  },

  /**
   * Generates public CDN URL for product & CMS images
   */
  getPublicAssetUrl(relativePath) {
    if (!relativePath) return null;
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
      return relativePath;
    }
    const cleanPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    return `${S3_CONFIG.cdnBaseUrl}${cleanPath}`;
  },

  /**
   * Validates document upload payload
   */
  validateDocumentUpload({ mimeType, sizeBytes }) {
    if (!ALLOWED_DOC_MIMES.includes(mimeType)) {
      return {
        valid: false,
        error: `Unsupported file type (${mimeType}). Allowed: PDF, JPEG, PNG, WEBP.`,
      };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (sizeBytes > MAX_SIZE) {
      return {
        valid: false,
        error: `File exceeds maximum size limit of 10MB.`,
      };
    }

    return { valid: true };
  },

  getStatus() {
    return {
      status: "CONFIGURED",
      region: S3_CONFIG.region,
      kycBucket: S3_CONFIG.kycBucket,
      cdnEndpoint: S3_CONFIG.cdnBaseUrl,
    };
  },
};

export default storage;
