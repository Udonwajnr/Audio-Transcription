'use server'

import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import os from 'os';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

export async function transcribeAudio(formData) {
  const file = formData.get('audio');
  if (!file) {
    console.log('No file uploaded');
    return;
  }

  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an audio file.');
  }

  // Use the system's temporary directory
  const tempDir = os.tmpdir();
  const filePath = join(tempDir, `upload_${Date.now()}_${file.name}`);
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    if (!genAI) {
      throw new Error('Failed to initialize Gemini API. Check your API key.');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Transcribe audio
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
      throw new Error('Invalid API response format');
    }

    const transcription = result.response.text();

    // Save the transcription in the temporary directory
    const transcriptionPath = join(tempDir, `transcription_${Date.now()}.json`);
    await writeFile(transcriptionPath, JSON.stringify({ transcription }));

    return transcription;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error}`);
  } finally {
    // Clean up the temporary file
    try {
      await unlink(filePath);
    } catch (unlinkError) {
      console.error('Failed to delete temporary file:', unlinkError);
    }
  }
}
