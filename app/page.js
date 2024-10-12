import { Suspense } from 'react'
import AudioUploader from './components/AudioUploader'
import TranscriptionResult from './components/TranscriptionResult'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Audio Transcription App</h1>
          <AudioUploader />
        </div>
      </div>
    </div>
  )
}