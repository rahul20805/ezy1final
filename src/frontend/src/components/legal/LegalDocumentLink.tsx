import React from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { LegalDoc, LEGAL_DOCS } from "../../config/legal";

interface LegalDocumentLinkProps {
  docKey: keyof typeof LEGAL_DOCS;
  showIcon?: boolean;
  showDownload?: boolean;
  shortLabel?: boolean;
  className?: string;
  linkClassName?: string;
}

export const LegalDocumentLink: React.FC<LegalDocumentLinkProps> = ({
  docKey,
  showIcon = false,
  showDownload = false,
  shortLabel = false,
  className = "",
  linkClassName = "",
}) => {
  const doc = LEGAL_DOCS[docKey];
  if (!doc) return null;

  const label = shortLabel ? doc.shortTitle : doc.title;

  if (!doc.available || !doc.url) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs text-muted-foreground/80 cursor-help ${className}`}
        title={`${doc.title} (Governed under User Terms and Universal Privacy Policy)`}
      >
        <span>{label}</span>
        <span className="text-[10px] px-1 py-0.2 bg-muted text-muted-foreground rounded font-mono">
          Integrated
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group ${linkClassName}`}
        title={`View ${doc.title} (PDF - Opens in new tab)`}
      >
        {showIcon && <FileText className="w-3.5 h-3.5 text-primary/80 shrink-0" />}
        <span className="group-hover:underline">{label}</span>
        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
      </a>

      {showDownload && (
        <a
          href={doc.url}
          download={doc.downloadName || `${doc.id}.pdf`}
          title={`Download ${doc.title} PDF`}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors inline-flex items-center justify-center shrink-0"
          aria-label={`Download ${doc.title} PDF`}
        >
          <Download className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
        </a>
      )}
    </span>
  );
};
