'use client'

import { useState, useRef, useEffect } from 'react'
import { FileAudio, AlertCircle, Upload, Loader2, Clipboard, Play, Pause, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transcribeAudio } from './actions'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import WaveSurfer from 'wavesurfer.js'
import { Toaster, toast } from 'sonner'
import { useDropzone } from 'react-dropzone'

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
const MAX_FILE_COUNT = 5;

export default function AudioUploader() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [transcriptions, setTranscriptions] = useState([])
  const router = useRouter()
  
  const waveformRefs = useRef([])
  const wavesurfers = useRef([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'audio/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      if (newFiles.length > MAX_FILE_COUNT) {
        toast.error("File limit exceeded", {
          description: "You can upload a maximum of 5 files.",
        });
      } else {
        setFiles(newFiles);
      }
    }
  })

  useEffect(() => {
    files.forEach((file, index) => {
      if (wavesurfers.current[index]) {
        wavesurfers.current[index].destroy()
      }

      const ws = WaveSurfer.create({
        container: waveformRefs.current[index],
        waveColor: 'violet',
        progressColor: 'purple',
        cursorColor: 'navy',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 100,
        barGap: 3,
      })

      ws.load(URL.createObjectURL(file))
      wavesurfers.current[index] = ws

      ws.on('finish', () => {
        const newTranscriptions = [...transcriptions]
        newTranscriptions[index] = { ...newTranscriptions[index], isPlaying: false }
        setTranscriptions(newTranscriptions)
      })
    })

    return () => {
      wavesurfers.current.forEach(ws => ws && ws.destroy())
    }
  }, [files])

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedTranscriptions = [...transcriptions];
    updatedTranscriptions.splice(index, 1);
    setTranscriptions(updatedTranscriptions);
  }

  const handlePlayPause = (index) => {
    if (wavesurfers.current[index]) {
      wavesurfers.current[index].playPause()
      const newTranscriptions = [...transcriptions]
      newTranscriptions[index] = { ...newTranscriptions[index], isPlaying: !newTranscriptions[index]?.isPlaying }
      setTranscriptions(newTranscriptions)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Text copied", { 
          description: "The transcribed text has been copied to your clipboard.",
        })
      })
      .catch(error => {
        console.error('Error copying text:', error)
        toast.error("Copy failed", {
          description: "Failed to copy the text. Please try again.",
        })
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        toast.error("File too large", {
          description: `${files[i].name} exceeds the maximum file size of 20MB.`,
        })
        setUploading(false)
        return
      }
      formData.append('audio', files[i])
    }

    try {
      const data = await transcribeAudio(formData)
      console.log(data)
      setTranscriptions(data.map(text => ({ text, isPlaying: false })))

      router.refresh()
      toast.success("Transcription complete", {
        description: "Your audio files have been successfully transcribed.",
      })
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error("Transcription failed", {
        description: "There was an error transcribing your audio. Please try again."
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster richColors />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Audio Transcription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="audio-file" className="text-lg font-medium text-gray-700 mb-2 block">
                Upload Audio Files (Max 5 files, 20MB each)
              </Label>
              <div 
                {...getRootProps()} 
                className={`
                  flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg
                  transition-colors duration-300 ease-in-out cursor-pointer
                  ${isDragActive 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                  }
                `}
              >
                <input {...getInputProps()} id="audio-file" />
                <FileAudio className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 text-center">
                  {isDragActive
                    ? "Drop the audio files here"
                    : "Drag 'n' drop audio files here, or click to select files"
                  }
                </p>
              </div>
            </div>

            <Button 
              disabled={files.length === 0 || uploading} 
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Transcribe
                </>
              )}
            </Button>

            {files.length > 0 && (
              <div className="space-y-6">
                {files.map((file, index) => (
                  <Card key={index} className="w-full">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 break-words">{file.name}</h3>
                        <Button onClick={() => handleRemoveFile(index)} variant="ghost" className="text-red-500">
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-md font-medium text-gray-700">Audio Waveform</h4>
                          <Button onClick={() => handlePlayPause(index)} variant="outline">
                            {transcriptions[index]?.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </Button>
                        </div>
                        <div ref={el => waveformRefs.current[index] = el} className="w-full h-24 bg-gray-100 rounded-lg" />
                        
                        {transcriptions[index] ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-md font-medium text-gray-700">Transcription Result</h4>
                              <Button onClick={() => handleCopy(transcriptions[index].text?.transcription)} variant="outline" className="flex items-center space-x-2">
                                <Clipboard className="h-4 w-4" />
                                <span>Copy Text</span>
                              </Button>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="whitespace-pre-wrap">{transcriptions[index].text?.transcription}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No transcription available for this file.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
