// src/app/api/files/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { del } from '@vercel/blob';
import { z } from 'zod';

// Validation schema
const deleteFileSchema = z.object({
  id: z.string().cuid(),
});

// DELETE handler for Next.js 15
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise in Next.js 15
    const params = await context.params;

    // Validate the ID parameter
    const { id } = deleteFileSchema.parse(params);

    // Find the file in database
    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete file from Vercel Blob storage
    await del(file.fileUrl);

    // Delete file record from database
    await prisma.file.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete file error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid file ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}