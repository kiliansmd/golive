import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  if (!token) {
    return NextResponse.json({ error: 'Token ist erforderlich' }, { status: 400 });
  }

  try {
    // ShareLink auslesen
    const docRef = db.collection('shareLinks').doc(token);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Link nicht gefunden' }, { status: 404 });
    }
    const data = doc.data();
    if (!data) {
      return NextResponse.json({ error: 'Linkdaten fehlen' }, { status: 404 });
    }
    const now = new Date();
    if (!data.expiresAt || new Date(data.expiresAt) < now) {
      return NextResponse.json({ error: 'Link ist abgelaufen' }, { status: 410 });
    }
    // Kandidatendaten holen
    const kandidatRef = db.collection('resumes').doc(data.kandidatId);
    const kandidatDoc = await kandidatRef.get();
    if (!kandidatDoc.exists) {
      return NextResponse.json({ error: 'Kandidat nicht gefunden' }, { status: 404 });
    }
    // Anonymisierte Daten zurückgeben (z.B. ohne Kontaktinfos)
    const kandidat = kandidatDoc.data();
    if (kandidat && kandidat.parsed && kandidat.parsed.contact) {
      kandidat.parsed.contact.email = undefined;
      kandidat.parsed.contact.phone = undefined;
      kandidat.parsed.contact.linkedin = undefined;
      kandidat.parsed.contact.github = undefined;
      kandidat.parsed.contact.twitter = undefined;
      kandidat.parsed.contact.website = undefined;
    }
    return NextResponse.json({ kandidat });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden des Profils' }, { status: 500 });
  }
} 