"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Sparkles, Send } from "lucide-react"
import type { Post } from "@/types/wordpress"
import { generateShareText } from "@/lib/openai"
import { shareToSocialMedia } from "@/lib/social"

export default function SharePostModal({
  post,
  isOpen,
  onClose,
}: {
  post: Post
  isOpen: boolean
  onClose: () => void
}) {
  const [shareText, setShareText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const handleGenerateText = async () => {
    setIsGenerating(true)
    try {
      const generatedText = await generateShareText(post)
      setShareText(generatedText)
    } catch (error) {
      toast({
        title: "Error al generar texto",
        description: "No se pudo generar el texto con IA. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (!shareText.trim()) {
      toast({
        title: "Texto vacío",
        description: "Por favor, escribe o genera un texto para compartir.",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)
    try {
      await shareToSocialMedia(post, shareText)
      toast({
        title: "Publicación compartida",
        description: "Tu publicación ha sido compartida exitosamente.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error al compartir",
        description: "No se pudo compartir la publicación. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir publicación</DialogTitle>
          <DialogDescription>Personaliza el texto para compartir en redes sociales</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Escribe el texto para compartir o genera uno con IA..."
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleGenerateText} disabled={isGenerating} className="w-full sm:w-auto">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar con IA
              </>
            )}
          </Button>
          <Button onClick={handleShare} disabled={isSharing} className="w-full sm:w-auto">
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compartiendo...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Compartir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
