"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share } from "lucide-react"
import SharePostModal from "@/components/share-post-modal"
import type { Post } from "@/types/wordpress"

export default function SharePostButton({ post }: { post: Post }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
        <Share className="h-4 w-4" />
        Compartir
      </Button>

      <SharePostModal post={post} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
