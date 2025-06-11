'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { SortableFileItem } from './SortableFileItem';
import { FileData } from '@/hooks/useFiles';

interface SortableFileListProps {
  files: FileData[];
  onReorder: (newOrder: string[]) => void;
  onDelete: (fileId: string) => void;
  loading?: boolean;
}

export const SortableFileList: React.FC<SortableFileListProps> = ({
  files,
  onReorder,
  onDelete,
  loading = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((file) => file.id === active.id);
      const newIndex = files.findIndex((file) => file.id === over?.id);
      
      const newFiles = arrayMove(files, oldIndex, newIndex);
      const newOrder = newFiles.map(file => file.id);
      onReorder(newOrder);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg p-4 h-24"
          />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg font-medium">No files uploaded yet</p>
          <p className="text-sm">Upload your first file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Uploaded Files ({files.length}/5)
        </h3>
        <p className="text-sm text-gray-500">
          Drag to reorder
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={files.map(file => file.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {files.map((file) => (
              <SortableFileItem
                key={file.id}
                file={file}
                onDelete={onDelete}
                isDragging={activeId === file.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};