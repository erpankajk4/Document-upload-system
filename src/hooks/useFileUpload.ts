import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export const useFileUpload = () => {
  const [uploads, setUploads] = useState<FileUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(async (
    file: File,
    metadata: { title: string; description?: string }
  ) => {
    const fileId = Math.random().toString(36).slice(2, 11);

    // Add to uploads state
    setUploads(prev => [...prev, {
      fileId,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    }]);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', metadata.title);
      if (metadata.description) {
        formData.append('description', metadata.description);
      }

      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );

          setUploads(prev => prev.map(upload =>
            upload.fileId === fileId
              ? { ...upload, progress }
              : upload
          ));
        },
      });

      // Mark as completed
      setUploads(prev => prev.map(upload =>
        upload.fileId === fileId
          ? { ...upload, status: 'completed' as const }
          : upload
      ));

      toast.success('File uploaded successfully!');
      return response.data;
    } catch (error) {
      // Mark as error
      setUploads(prev => prev.map(upload =>
        upload.fileId === fileId
          ? { ...upload, status: 'error' as const }
          : upload
      ));

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || 'Upload failed'
        : 'Upload failed';

      toast.error(errorMessage);
      throw error;
    } finally {
      // Remove from uploads after delay
      setTimeout(() => {
        setUploads(prev => prev.filter(upload => upload.fileId !== fileId));
      }, 3000);

      setIsUploading(false);
    }
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  return {
    uploads,
    isUploading,
    uploadFile,
    clearUploads,
  };
};