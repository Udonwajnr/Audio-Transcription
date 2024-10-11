'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, FileAudio, AlertCircle } from 'lucide-react'

export default function TranscriptionResult() {
  const [transcriptions, setTranscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTranscriptions() {
      try {
        const res = await fetch('/api/transcription')
        if (!res.ok) {
          throw new Error('Failed to fetch transcriptions')
        }
        const data = await res.json()
        setTranscriptions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTranscriptions()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Transcriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto border-red-500">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500 flex items-center">
              <AlertCircle className="mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (transcriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="text-center py-8">
            <FileAudio className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">No transcriptions available</p>
            <p className="mt-1 text-sm text-gray-500">Upload an audio file to get started</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transcriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {transcriptions.map((transcription, index) => (
                <Card key={transcription.name} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="text-lg font-semibold truncate">{transcription.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-100 rounded-md p-4 overflow-x-auto">
                      {JSON.stringify(transcription.content.transcription, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}