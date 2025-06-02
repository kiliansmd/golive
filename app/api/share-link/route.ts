import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { kandidatId } = await req.json();
    if (!kandidatId) {
      return NextResponse.json({ error: 'kandidatId ist erforderlich' }, { status: 400 });
    }

    // Token generieren
    const token = uuidv4();
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Tage

    // In Firestore speichern
    await db.collection('shareLinks').doc(token).set({
      kandidatId,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    // Link zurückgeben
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const url = `${baseUrl}/share/${token}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Erstellen des Share-Links' }, { status: 500 });
  }
} 