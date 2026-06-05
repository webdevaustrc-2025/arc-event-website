"use client";
import React, { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Loader2,
} from "lucide-react";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dxyhzgrul/image/upload/v1780398181/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215_bdeofc.jpg";

interface AvatarUploadModalProps {
  isOpen: boolean;
  currentAvatar: string;
  isDark: boolean;
  onClose: () => void;
  onAvatarChange: (url: string) => void;
}

export default function AvatarUploadModal({
  isOpen,
  currentAvatar,
  isDark,
  onClose,
  onAvatarChange,
}: AvatarUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setError(null);
    setSuccess(false);

    if (rejected.length > 0) {
      const err = rejected[0].errors[0];
      if (err.code === "file-too-large") {
        setError("File is too large. Maximum size is 5MB.");
      } else if (err.code === "file-invalid-type") {
        setError("Invalid file type. Please use JPEG, PNG, WebP, or GIF.");
      } else {
        setError(err.message);
      }
      return;
    }

    if (accepted.length > 0) {
      const chosen = accepted[0];
      setFile(chosen);
      const objectUrl = URL.createObjectURL(chosen);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Upload failed.");
      } else {
        setSuccess(true);
        onAvatarChange(data.avatarUrl);
        setTimeout(() => {
          handleClose();
        }, 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/upload/avatar", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to reset avatar.");
      } else {
        setSuccess(true);
        onAvatarChange(data.avatarUrl);
        setTimeout(() => {
          handleClose();
        }, 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setFile(null);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const isDefault = currentAvatar === DEFAULT_AVATAR || !currentAvatar;

  const card = {
    background: isDark
      ? "linear-gradient(135deg, rgba(26,28,20,0.98) 0%, rgba(34,37,28,0.98) 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,247,240,0.98) 100%)",
    border: isDark ? "1px solid rgba(163,177,138,0.15)" : "1px solid rgba(58,90,64,0.18)",
  };

  const dropzoneBg = isDark
    ? isDragActive
      ? "rgba(88,129,87,0.2)"
      : "rgba(255,255,255,0.04)"
    : isDragActive
    ? "rgba(88,129,87,0.1)"
    : "rgba(0,0,0,0.03)";

  const dropzoneBorder = isDragActive
    ? "#588157"
    : isDark
    ? "rgba(163,177,138,0.2)"
    : "rgba(58,90,64,0.2)";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={card}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: isDark ? "rgba(163,177,138,0.12)" : "rgba(58,90,64,0.12)" }}
            >
              <h2
                className="text-xl font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: isDark ? "#ffffff" : "#1a1a14",
                }}
              >
                Update Profile Picture
              </h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  color: isDark ? "#9A9A8E" : "#8a8a7a",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5">
              {/* Current avatar preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={preview || currentAvatar || DEFAULT_AVATAR}
                    alt="Avatar preview"
                    className="w-28 h-28 rounded-full object-cover"
                    style={{
                      border: `3px solid ${isDark ? "rgba(88,129,87,0.4)" : "rgba(88,129,87,0.35)"}`,
                    }}
                  />
                  {preview && (
                    <span
                      className="absolute -bottom-1 -right-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #3a5a40 0%, #588157 100%)",
                        color: "#fff",
                      }}
                    >
                      Preview
                    </span>
                  )}
                </div>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className="relative rounded-xl p-6 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: dropzoneBg,
                  border: `2px dashed ${dropzoneBorder}`,
                }}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full"
                    style={{
                      background: isDark ? "rgba(88,129,87,0.15)" : "rgba(88,129,87,0.1)",
                    }}
                  >
                    {isDragActive ? (
                      <Upload className="w-6 h-6" style={{ color: "#588157" }} />
                    ) : (
                      <ImageIcon className="w-6 h-6" style={{ color: "#588157" }} />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: isDark ? "#c8d5c0" : "#3a5a40" }}
                    >
                      {isDragActive ? "Drop your image here" : "Drag & drop or click to browse"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: isDark ? "#5A5A52" : "#9a9a8a" }}>
                      JPEG, PNG, WebP, GIF • Max 5MB
                    </p>
                  </div>
                  {file && (
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: isDark ? "rgba(88,129,87,0.2)" : "rgba(88,129,87,0.12)",
                        color: "#588157",
                        border: "1px solid rgba(88,129,87,0.3)",
                      }}
                    >
                      {file.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(220,38,38,0.1)",
                      border: "1px solid rgba(220,38,38,0.25)",
                    }}
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(88,129,87,0.15)",
                      border: "1px solid rgba(88,129,87,0.3)",
                    }}
                  >
                    <CheckCircle className="w-4 h-4 text-[#588157] shrink-0" />
                    <p className="text-sm text-[#588157]">Done! Avatar updated successfully.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading || success}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #3a5a40 0%, #588157 100%)",
                    color: "#ffffff",
                  }}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </>
                  )}
                </button>

                {/* Delete / reset button – only show when user has a custom avatar */}
                {!isDefault && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting || success}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                    style={{
                      background: isDark ? "rgba(220,38,38,0.1)" : "rgba(220,38,38,0.08)",
                      border: "1px solid rgba(220,38,38,0.25)",
                      color: "#f87171",
                    }}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Remove Photo
                      </>
                    )}
                  </button>
                )}

                {/* Cancel */}
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    color: isDark ? "#9A9A8E" : "#8a8a7a",
                    border: `1px solid ${isDark ? "rgba(163,177,138,0.12)" : "rgba(58,90,64,0.12)"}`,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
