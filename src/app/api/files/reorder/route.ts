import { NextRequest, NextResponse } from 'next/server';
import  db  from '@/lib/prisma';
import { z } from 'zod';

const reorderSchema = z.object({
  fileIds: z.array(z.string()),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileIds } = reorderSchema.parse(body);

    // Update orders in a transaction
    await db.$transaction(
      fileIds.map((fileId, index) =>
        db.file.update({
          where: { id: fileId },
          data: { order: index + 1 },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json(
      { error: 'Failed to reorder files' },
      { status: 500 }
    );
  }
}