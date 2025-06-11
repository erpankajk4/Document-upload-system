import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface FileData {
  id: string;
  fileUrl: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export const useFiles = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/files');
      setFiles(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Failed to fetch files'
        : 'Failed to fetch files';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await axios.delete(`/api/files/${fileId}`);
      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success('File deleted successfully');
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Failed to delete file'
        : 'Failed to delete file';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const reorderFiles = useCallback(async (newOrder: string[]) => {
    try {
      // Optimistic update
      const reorderedFiles = newOrder.map((id, index) => {
        const file = files.find(f => f.id === id);
        return file ? { ...file, order: index + 1 } : null;
      }).filter(Boolean) as FileData[];

      setFiles(reorderedFiles);
      toast.success('File reordered successfully');
      // Update on server
      await axios.put('/api/files/reorder', { fileIds: newOrder });
    } catch (err) {
      // Revert on error
      await fetchFiles();
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Failed to reorder files'
        : 'Failed to reorder files';
      toast.error(errorMessage);
      throw err;
    }
  }, [files, fetchFiles]);

  const addFile = useCallback((newFile: FileData) => {
    setFiles(prev => [...prev, newFile].sort((a, b) => a.order - b.order));
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    loading,
    error,
    fetchFiles,
    deleteFile,
    reorderFiles,
    addFile,
  };
};