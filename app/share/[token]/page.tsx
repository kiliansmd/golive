import { notFound } from 'next/navigation';

export default async function ShareProfilePage({ params }: { params: { token: string } }) {
  const { token } = params;
  let kandidat = null;
  let error = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/share/${token}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      error = data.error || 'Unbekannter Fehler';
    } else {
      kandidat = data.kandidat;
    }
  } catch (e) {
    error = 'Fehler beim Laden des Profils';
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Profil nicht verfügbar</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!kandidat) {
    return notFound();
  }

  // Zeige anonymisiertes Profil (z.B. nur Name, Position, Skills, Highlights, keine Kontaktdaten)
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">{kandidat.parsed?.name || 'Kandidat'}</h1>
        <h2 className="text-xl text-blue-600 mb-4">{kandidat.parsed?.title}</h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Kurzprofil</h3>
          <p className="text-gray-700">{kandidat.parsed?.brief}</p>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Fähigkeiten</h3>
          <ul className="flex flex-wrap gap-2">
            {kandidat.parsed?.skills?.map((skill: string, idx: number) => (
              <li key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Berufserfahrung</h3>
          <ul className="space-y-2">
            {kandidat.parsed?.employment_history?.map((job: any, idx: number) => (
              <li key={idx} className="border-b pb-2">
                <span className="font-medium">{job.position}</span> bei <span>{job.company}</span> ({job.startDate} - {job.endDate})
              </li>
            ))}
          </ul>
        </div>
        <div className="text-gray-500 text-sm mt-8">Dieser Link ist anonym und läuft automatisch ab.</div>
      </div>
    </main>
  );
} 