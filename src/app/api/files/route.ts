import { NextResponse } from 'next/server';
import  db  from '@/lib/prisma';

export async function GET() {
  try {
    const files = await db.file.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Fetch files error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error },
      { status: 500 }
    );
  }
}