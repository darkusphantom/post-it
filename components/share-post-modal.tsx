"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Send } from "lucide-react";
import type { Post } from "@/types/wordpress";
import { generateShareText } from "@/lib/openai";
import { shareToSocialMedia } from "@/lib/social";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SharePostModal({
  post,
  isOpen,
  onClose,
}: {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [shareText, setShareText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("👨‍💻 Programación");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["Linkedin", "Facebook"]);
  const [publishDate, setPublishDate] = useState("");
  const { toast } = useToast();

  const handleGenerateText = async () => {
    setIsGenerating(true);
    try {
      const generatedText = await generateShareText(post);
      setShareText(generatedText);
    } catch (error: unknown | any) {
      toast({
        title: "Error al generar texto",
        description:
          error?.message || "No se pudo generar el texto. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!shareText.trim()) {
      toast({
        title: "Texto vacío",
        description: "Por favor, escribe o genera un texto para compartir.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      await shareToSocialMedia(post, shareText, selectedTopic, selectedNetworks, publishDate);
      toast({
        title: "¡Publicación guardada!",
        description: "Tu publicación ha sido guardada en Notion exitosamente.",
      });
      onClose();
    } catch (error: any) {
      console.error("Error al compartir:", error);
      toast({
        title: "Error al compartir",
        description: error?.message || "No se pudo compartir la publicación. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const toggleNetwork = (network: string) => {
    setSelectedNetworks(prev => 
      prev.includes(network) 
        ? prev.filter(item => item !== network)
        : [...prev, network]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir publicación</DialogTitle>
          <DialogDescription>
            Personaliza el texto para compartir en redes sociales
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Tema</Label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="🌱 Personal growth">🌱 Personal growth</SelectItem>
                <SelectItem value="👨‍💻 Programación">👨‍💻 Programación</SelectItem>
                <SelectItem value="🇺🇸 Ingles">🇺🇸 Ingles</SelectItem>
                <SelectItem value="⏱️ Productivity">⏱️ Productivity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Redes Sociales</Label>
            <div className="flex flex-wrap gap-2">
              {["Facebook", "Linkedin", "Twitter", "Instagram", "Threads", "Whatsapp", "Ko-Fi"].map(network => (
                <div key={network} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`network-${network}`} 
                    checked={selectedNetworks.includes(network)}
                    onCheckedChange={() => toggleNetwork(network)}
                  />
                  <Label htmlFor={`network-${network}`}>{network}</Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* <div className="space-y-2">
            <Label htmlFor="publishDate">Fecha de publicación</Label>
            <Input 
              id="publishDate" 
              type="datetime-local" 
              value={publishDate} 
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </div> */}
          
          <Textarea
            placeholder="Escribe el texto para compartir o genera uno con IA..."
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateText}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
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
          <Button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full sm:w-auto"
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando en Notion...
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
  );
}
