'use server'

import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

export async function transcribeAudio(formData) {
  const files = formData.getAll('audio'); // Retrieve all audio files

  if (!files.length) {
    console.log('No files uploaded');
    return;
  }

  const transcriptions = []; // Store results for all transcriptions
  const tempDir = os.tmpdir();

  for (const file of files) {
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      console.error(`Invalid file type for ${file.name}`);
      continue;
    }

    const filePath = join(tempDir, `upload_${Date.now()}_${file.name}`);
    
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      if (!genAI) {
        throw new Error('Failed to initialize Gemini API. Check your API key.');
      }
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: file.type,
            data: buffer.toString('base64')
          }
        },
        'Transcribe the audio in this file and return only the transcription text.'
      ]);

      if (!result || !result.response || typeof result.response.text !== 'function') {
        console.error(`Invalid API response for ${file.name}`);
        continue;
      }

      const transcription = result.response.text();
      transcriptions.push({ fileName: file.name, transcription });

      // Save each transcription file if needed
      const transcriptionPath = join(tempDir, `transcription_${Date.now()}_${file.name}.json`);
      await writeFile(transcriptionPath, JSON.stringify({ transcription }));

    } catch (error) {
      console.error(`Transcription error for ${file.name}:`, error);
    } finally {
      // Clean up temporary audio file
      try {
        await unlink(filePath);
      } catch (unlinkError) {
        console.error(`Failed to delete temporary file for ${file.name}:`, unlinkError);
      }
    }
  }

  return transcriptions;
}
