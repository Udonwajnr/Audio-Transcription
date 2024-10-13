"use client"
import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AudioWaveform, Mic, FileAudio, Sparkles, Clock, Globe } from 'lucide-react'
import AudioUploader from './components/AudioUploader'
import TranscriptionResult from './components/TranscriptionResult'
import { useRef } from 'react';


export default function Home() {
  // Create a reference for the audio transcription section
  const audioTranscriptionRef = useRef(null);

  // Function to handle scrolling to the audio transcription section
  const scrollToTranscription = () => {
    if (audioTranscriptionRef.current) {
      audioTranscriptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <AudioWaveform className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">AudioScribe AI</span>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Transform Your Audio into Text with AI</h1>
          <p className="text-xl text-gray-600 mb-8">Fast, accurate, and effortless transcription for podcasts, interviews, and more.</p>
          <button 
            onClick={scrollToTranscription}
            className="text-lg px-8 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Try It Free
          </button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Mic className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiple Audio Formats</h3>
            <p className="text-gray-600">Support for MP3, WAV, M4A, and more.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Sparkles className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Accuracy</h3>
            <p className="text-gray-600">State-of-the-art AI models for precise transcription.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get your transcription in minutes, not hours.</p>
          </div>
        </section>

        <section  className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <ol className="space-y-4">
              <li className="flex items-center space-x-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <span>Upload your audio file</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <span>Our AI processes the audio</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <span>Receive accurate transcription</span>
              </li>
            </ol>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-2xl overflow-hidden mb-16" ref={audioTranscriptionRef}>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Experience the Magic</h2>
            <AudioUploader />
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <AudioWaveform className="h-6 w-6" />
              <span className="text-xl font-bold">AudioScribe AI</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.241V9.528h3.413v1.536h.049c.475-.897 1.63-1.845 3.355-1.845 3.587 0 4.243 2.358 4.243 5.406v5.727zm-16.25-11.27c-1.12 0-2.024-.922-2.024-2.056 0-1.136.91-2.057 2.025-2.057 1.114 0 2.024.921 2.024 2.057 0 1.134-.911 2.056-2.024 2.056zm-1.803 11.271h3.605V9.528H2.394v11.924z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
