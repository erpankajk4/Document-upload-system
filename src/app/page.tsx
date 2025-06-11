"use client";

import { FileUpload } from "@/components/FileUpload";
import { SortableFileList } from "@/components/SortableFileList";
import { useFiles } from "@/hooks/useFiles";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function HomePage() {
  const { files, loading, deleteFile, reorderFiles, addFile } = useFiles();

  const canUploadMore = files.length < 5;

  return (
    <div className="min-h-screen">
      
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Document Upload System
            </h1>
            <p className="mt-2 text-gray-600">
              Upload, organize, and manage your Documents with drag-and-drop
              functionality
            </p>
          </div>

          {/* Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Storage Summary
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {files.length}
                </div>
                <div className="text-sm text-gray-500">Total Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(
                    (files.reduce((acc, file) => acc + file.fileSize, 0) /
                      1024 /
                      1024) *
                      100,
                  ) / 100}{" "}
                  MB
                </div>
                <div className="text-sm text-gray-500">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {5 - files.length}
                </div>
                <div className="text-sm text-gray-500">Slots Remaining</div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Upload New File
            </h2>

            {canUploadMore ? (
              <FileUpload onUploadComplete={addFile} disabled={loading} />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center">
                <div className="h-12 w-12 text-gray-500">
                  <IoCloudUploadOutline className="h-12 w-12 text-gray-500" />
                  <p className="text-lg font-medium">Upload limit reached</p>
                  <p className="text-sm">
                    You have reached the maximum limit of 5 files. Delete some
                    files to upload new ones.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Files List Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <SortableFileList
              files={files}
              onReorder={reorderFiles}
              onDelete={deleteFile}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


