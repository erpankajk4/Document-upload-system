"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FileData } from "@/hooks/useFiles";
import { Input, TextareaAutoGrowing } from "./ui/input";

const uploadFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

interface FileUploadProps {
  onUploadComplete: (file: FileData) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  disabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploads, isUploading, uploadFile } = useFileUpload();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: disabled || isUploading,
  });

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) return;

    try {
      const uploadedFile = await uploadFile(selectedFile, data);
      onUploadComplete(uploadedFile);
      setSelectedFile(null);
      reset();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div key={upload.fileId} className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {upload.fileName}
                </span>
                <span className="text-sm text-gray-500">
                  {upload.progress}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={clsx(
                    "h-2 rounded-full transition-all duration-300",
                    upload.status === "error" ? "bg-red-500" : "bg-blue-500",
                  )}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
              {upload.status === "error" && (
                <p className="mt-1 text-sm text-red-600">Upload failed</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={clsx(
          "cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          (disabled || isUploading) && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-gray-600">
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <p>Drag & drop a file here, or click to select</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Supports: Images, PDF, Word documents, Text files (max 10MB)
          </p>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-medium text-gray-900">Selected File</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Name:</strong> {selectedFile.name}
            </p>
            <p>
              <strong>Size:</strong> {formatFileSize(selectedFile.size)}
            </p>
            <p>
              <strong>Type:</strong> {selectedFile.type}
            </p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      {selectedFile && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="text"
              id="title"
              label="Title"
              {...register("title")}
              placeholder=" "
              isRequired={true}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <TextareaAutoGrowing
              id="description"
              {...register("description")}
              rows={3}
              placeholder=" "
              label="Description"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isUploading}
              className={clsx(
                "flex-1 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm",
                isUploading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
              )}
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                reset();
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
