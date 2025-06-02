import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

if (!process.env.NEXT_PUBLIC_RESUME_PARSER_API) {
  throw new Error('RESUME_PARSER_API_KEY is not defined in environment variables');
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    // Parse resume
    const response = await fetch('https://resumeparser.app/resume/parse', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESUME_PARSER_API}`
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error(`Resume parser API error: ${response.status}`);
    }

    const parsedData = await response.json();

    // Store in Firebase
    const resumeRef = await db.collection('resumes').add({
      ...parsedData,
      fileName: file.name,
      uploadedAt: Timestamp.now(),
    });

    return NextResponse.json({
      ...parsedData,
      id: resumeRef.id,
      message: 'Resume parsed and stored successfully'
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
} 