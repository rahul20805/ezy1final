import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileSpreadsheet,
  FileCheck,
  File,
  X,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DocumentInfo {
  title: string;
  url: string;
  fileType?: "pdf" | "image" | "spreadsheet" | "doc" | "text" | "other";
  fileSize?: string;
  uploadedAt?: string;
}

interface DocumentViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentInfo | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!document) return null;

  const getExtension = (url: string) => {
    try {
      const pathname = new URL(url, "http://localhost").pathname;
      return pathname.split(".").pop()?.toLowerCase() || "";
    } catch {
      return "";
    }
  };

  const ext = getExtension(document.url);
  const inferredType =
    document.fileType ||
    (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)
      ? "image"
      : ext === "pdf"
        ? "pdf"
        : ["xls", "xlsx", "csv"].includes(ext)
          ? "spreadsheet"
          : ["doc", "docx"].includes(ext)
            ? "doc"
            : "other");

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[88vh] flex flex-col p-0 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 px-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
              {inferredType === "image" ? (
                <ImageIcon className="h-5 w-5" />
              ) : inferredType === "spreadsheet" ? (
                <FileSpreadsheet className="h-5 w-5" />
              ) : inferredType === "pdf" ? (
                <FileText className="h-5 w-5" />
              ) : (
                <FileCheck className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-stone-900 dark:text-white truncate">
                {document.title || "Document Viewer"}
              </DialogTitle>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                {document.fileSize ? `${document.fileSize} • ` : ""}
                {document.uploadedAt ? `Uploaded ${document.uploadedAt} • ` : ""}
                <span className="uppercase font-mono font-semibold">{ext || inferredType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {inferredType === "image" && (
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-7 w-7 p-0"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[11px] font-mono w-10 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-7 w-7 p-0"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="h-7 w-7 p-0 ml-1"
                  title="Rotate 90deg"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            <a
              href={document.url}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <a
              href={document.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </DialogHeader>

        {/* Content Viewer */}
        <div className="flex-1 bg-stone-100 dark:bg-stone-900/90 overflow-auto flex items-center justify-center p-4">
          {inferredType === "image" ? (
            <div className="max-w-full max-h-full flex items-center justify-center transition-transform duration-200">
              <img
                src={document.url}
                alt={document.title}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="max-h-[65vh] max-w-full rounded-xl shadow-lg object-contain"
              />
            </div>
          ) : inferredType === "pdf" ? (
            <iframe
              src={`${document.url}#toolbar=1`}
              title={document.title}
              className="w-full h-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-stone-950 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md max-w-md">
              <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
                <File className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white mb-1">
                {document.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 max-w-xs">
                This document ({ext.toUpperCase() || "File"}) can be previewed or edited in its native application.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={document.url}
                  download
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Download className="h-4 w-4" /> Download File
                </a>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium"
                >
                  Open External
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
