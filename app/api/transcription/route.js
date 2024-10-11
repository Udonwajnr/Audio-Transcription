import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { NextResponse } from 'next/server';

export async function GET() {
  const transcriptionDir = os.tmpdir();

  try {
    const files = await readdir(transcriptionDir);

    // Filter to only include JSON transcription files with the correct naming format
    const transcriptionFiles = files
      .filter(file => file.startsWith('transcription_') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: join(transcriptionDir, file),
      }))
      .sort((a, b) => parseInt(b.name.split('_')[1]) - parseInt(a.name.split('_')[1])); // Sort by timestamp

    // Read and parse the content of each transcription file
    const transcriptions = await Promise.all(
      transcriptionFiles.map(async (file) => {
        const data = await readFile(file.path, 'utf8');
        return { name: file.name, content: JSON.parse(data) };
      })
    );

    return NextResponse.json(transcriptions); // Return all parsed transcriptions
  } catch (error) {
    console.error('Error reading transcription files:', error);
    return NextResponse.json({ transcriptions: null });
  }
}
