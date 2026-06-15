import React, { useRef, useState, useEffect } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  className = "",
  disabled = false,
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) return;

    const img = new Image();
    img.src = value;
    img.onerror = () => {
      toast.error("Invalid image URL");
      onChange("");
    };
  }, [value, onChange]);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.imageUrl || "");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`text-sm font-medium ${disabled ? "text-gray-500" : ""}`}>
        {label}
      </label>

      <div
        className={`relative border-2 rounded-lg cursor-pointer transition-colors ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : isDragging
            ? "border-[#588157] bg-[#588157]/5"
            : value
            ? "border-[#588157]"
            : "border-dashed border-gray-300 hover:border-[#588157]"
        }`}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
        onClick={disabled ? undefined : handleClick}
      >
        {uploading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-[#588157] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          </div>
        ) : value ? (
          <div className="relative">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg"
            />
            {!disabled && (
              <button
                type="button"
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mb-2" />
            <p className="text-sm mb-2">Drag & drop an image here</p>
            <p className="text-xs mb-4">or click to browse</p>
            <button
              type="button"
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-[#3a5a40] text-white hover:bg-[#344e41] transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
