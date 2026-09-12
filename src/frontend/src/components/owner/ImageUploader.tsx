import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  currentImage?: string;
  onImageChange?: (url: string) => void;
  label?: string;
  helperText?: string;
  previewHeight?: string;
}

export function ImageUploader({
  value,
  onChange,
  currentImage,
  onImageChange,
  label = "Item Image",
  helperText = "Upload from device (PNG, JPG, WebP) or paste an image URL",
  previewHeight = "h-40",
}: ImageUploaderProps) {
  const actualValue = value !== undefined ? value : currentImage || "";
  const actualOnChange = onChange || onImageChange || (() => {});
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInputMode, setUrlInputMode] = useState(false);
  const [rawUrl, setRawUrl] = useState("");

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      actualOnChange(base64);
      toast.success("Image uploaded successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (!rawUrl.trim()) return;
    actualOnChange(rawUrl.trim());
    setRawUrl("");
    setUrlInputMode(false);
    toast.success("Image URL applied!");
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
      )}

      {actualValue ? (
        <div className="relative rounded-2xl overflow-hidden border border-border group bg-muted/20">
          <img
            src={actualValue}
            alt="Uploaded Preview"
            className={`w-full ${previewHeight} object-cover transition-transform duration-300 group-hover:scale-105`}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x400?text=Invalid+Image+URL";
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => actualOnChange("")}
              className="h-8 px-2.5 text-xs rounded-xl shadow-lg"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-background/50"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-foreground">
            Drag & drop your image here, or{" "}
            <label className="text-primary font-semibold hover:underline cursor-pointer">
              browse file
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
            </label>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">{helperText}</p>

          <div className="mt-3 flex items-center gap-2 w-full max-w-xs">
            {!urlInputMode ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => setUrlInputMode(true)}
              >
                <LinkIcon className="w-3 h-3" /> Paste Image Link / URL
              </Button>
            ) : (
              <div className="flex items-center gap-1 w-full">
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={rawUrl}
                  onChange={(e) => setRawUrl(e.target.value)}
                  className="h-7 text-xs flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={handleUrlSubmit}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-1.5 text-muted-foreground"
                  onClick={() => setUrlInputMode(false)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
