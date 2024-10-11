import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const transcriptionDir = join(process.cwd(), 'transcriptions');
  
  try {
    // Read all files in the transcriptions directory
    const files = await readdir(transcriptionDir);
    
    // Filter to only include JSON files
    const transcriptionFiles = files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: join(transcriptionDir, file),
      }))
      .sort((a, b) => {
        return (
          parseInt(b.name.split('_')[1]) - parseInt(a.name.split('_')[1])
        ); // Sort by the timestamp in the filename (upload_<timestamp>_<name>)
      });

    // Read all transcription files and parse their contents
    const transcriptions = await Promise.all(transcriptionFiles.map(async (file) => {
      const data = await readFile(file.path, 'utf8');
      return { name: file.name, content: JSON.parse(data) }; // Return filename and its content
    }));
    
    return NextResponse.json(transcriptions); // Return all transcriptions
    
  } catch (error) {
    console.error('Error reading transcription file:', error);
    return NextResponse.json({ transcriptions: null });
  }
}
