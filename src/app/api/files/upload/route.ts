import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import  db  from '@/lib/prisma';
import { z } from 'zod';
import { MAX_FILE_SIZE, MAX_FILES } from '@/lib/constants';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
;

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      );
    }

    // Check file limit
    const existingFilesCount = await db.file.count();
    if (existingFilesCount >= MAX_FILES) {
      return NextResponse.json(
        { error: 'Maximum file limit reached (5 files)' },
        { status: 400 }
      );
    }

    // Validate metadata
    const validatedData = uploadSchema.parse({ title, description });

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existingFile = await db.file.findUnique({
      where: { slug },
    });

    if (existingFile) {
      return NextResponse.json(
        { error: 'A file with this title already exists' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Get next order
    const lastFile = await db.file.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastFile ? lastFile.order + 1 : 1;

    // Save to database
    const savedFile = await db.file.create({
      data: {
        fileUrl: blob.url,
        title: validatedData.title,
        slug,
        description: validatedData.description || '',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        order: nextOrder,
      },
    });

    return NextResponse.json(savedFile, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}