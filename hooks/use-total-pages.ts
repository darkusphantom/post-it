"use client"

import { useState, useEffect } from "react"

// Este hook simula obtener el total de páginas desde el servidor
// En una implementación real, esto podría venir de un estado global o una API
export function useTotalPages(): number {
  const [totalPages, setTotalPages] = useState(5)

  useEffect(() => {
    // Aquí podrías hacer una petición para obtener el total de páginas
    // Por ahora, usamos un valor fijo para demostración
    const metaElement = document.querySelector('meta[name="total-pages"]')
    if (metaElement) {
      const pages = Number.parseInt(metaElement.getAttribute("content") || "5", 10)
      setTotalPages(pages)
    }
  }, [])

  return totalPages
}
