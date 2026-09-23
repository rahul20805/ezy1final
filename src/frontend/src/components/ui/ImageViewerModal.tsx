import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[] | string;
  initialIndex?: number;
  title?: string;
  subtitle?: string;
}

export function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title = "Image Preview",
  subtitle,
}: ImageViewerModalProps) {
  const imageList: string[] = Array.isArray(images)
    ? images.filter(Boolean)
    : [images].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const initialTouchScaleRef = useRef<number>(1);

  // Reset view when opening or switching images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(initialIndex, Math.max(0, imageList.length - 1)));
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setImgLoaded(false);
      setImgError(false);
    }
  }, [isOpen, initialIndex, images]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setImgLoaded(false);
    setImgError(false);
  }, [currentIndex]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "+" || e.key === "=") {
        zoomIn();
      } else if (e.key === "-") {
        zoomOut();
      } else if (e.key === "0") {
        resetZoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, imageList.length]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.35, 4));
  const zoomOut = () =>
    setScale((s) => {
      const next = Math.max(s - 0.35, 0.75);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextImage = () => {
    if (imageList.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }
  };

  const prevImage = () => {
    if (imageList.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Dragging / Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Mobile Touch Gestures (Pinch to zoom + Pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      initialTouchScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDistRef.current;
      const nextScale = Math.min(Math.max(initialTouchScaleRef.current * ratio, 0.75), 4);
      setScale(nextScale);
      if (nextScale <= 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = null;
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const currentImg = imageList[currentIndex] || "";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white backdrop-blur-md select-none transition-all duration-300 animate-in fade-in"
      onWheel={handleWheel}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-black/40 z-30">
        <div className="min-w-0 pr-4">
          <h4 className="text-sm sm:text-base font-bold text-white truncate">{title}</h4>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-white/60 truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <button
            type="button"
            onClick={zoomOut}
            title="Zoom out (-)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] sm:text-xs font-mono font-bold px-1.5 min-w-[42px] text-center text-white/80">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            title="Zoom in (+)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            title="Reset Zoom (0)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white hidden sm:flex"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="w-[1px] h-5 bg-white/20 mx-1" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            title="Close (Esc)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600/80 hover:bg-rose-600 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className={`flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4 touch-none ${
          scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Spinner */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-xs text-white/60">Loading high-resolution image...</span>
          </div>
        )}

        {/* Error Fallback */}
        {imgError && (
          <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 max-w-sm">
            <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-white mb-1">Image Preview Unavailable</p>
            <p className="text-xs text-white/60">The requested image could not be loaded.</p>
          </div>
        )}

        {/* Active Zoomable Image */}
        {currentImg && !imgError && (
          <img
            src={currentImg}
            alt={title}
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgLoaded(true);
              setImgError(true);
            }}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.15s ease-out",
              maxHeight: "85vh",
              maxWidth: "92vw",
            }}
            className="object-contain select-none shadow-2xl rounded-lg"
          />
        )}

        {/* Previous Image Button */}
        {imageList.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Image Button */}
        {imageList.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Navigation Helper */}
      <div className="py-2.5 px-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-white/70 z-30">
        <div className="flex items-center gap-2">
          {imageList.length > 1 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md scrollbar-none py-1">
              {imageList.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    currentIndex === idx
                      ? "border-primary scale-105 shadow-md shadow-primary/20"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-white/50">
              Pinch or scroll to zoom • Drag to pan
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {imageList.length > 1 && (
            <span className="font-semibold text-white/80 text-[11px] sm:text-xs">
              {currentIndex + 1} of {imageList.length}
            </span>
          )}
          <button
            type="button"
            onClick={resetZoom}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            100% Reset
          </button>
        </div>
      </div>
    </div>
  );
}
