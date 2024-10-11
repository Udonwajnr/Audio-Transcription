'use client'

import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transcribeAudio } from './actions'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

export default function AudioUploader() {
    const { toast } = useToast()  
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [transcribed,setTranscribed] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('audio', file)

    try {
      await transcribeAudio(formData)
      .then((data)=>setTranscribed(data))

      router.refresh()
      toast({
        title: "Transcription complete",
        description: "Your audio has been successfully transcribed.",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  console.log(transcribed)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="audio-file" className="text-sm font-medium text-gray-700">
          Upload Audio File
        </Label>
        <div className="mt-1 flex items-center space-x-4">
          <Input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1"
          />
          <Button type="submit" disabled={!file || uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Transcribe
              </>
            )}
          </Button>
        </div>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Transcription Result</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{transcribed}</p>
            </CardContent>
        </Card>
      </div>
    </form>
  )
}