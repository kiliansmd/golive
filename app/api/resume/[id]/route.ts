import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }  // ← Promise hinzufügen
) {
  // params ist ein Promise und muss awaited werden
  const { id } = await context.params;  // ← await hinzufügen

  if (!id) {
    return NextResponse.json(
      { error: 'Resume ID is required' },
      { status: 400 }
    );
  }

  try {
    const docRef = db.collection('resumes').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const data = doc.data();

    return NextResponse.json({
      id: doc.id,
      ...data,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}