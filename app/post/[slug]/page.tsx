import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Header from "@/components/header"
import PostDetail from "@/components/post-detail"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")
    const resolvedParams = await params

    // Si no hay token, mostrar mensaje de acceso denegado en lugar de redireccionar
    if (!authToken) {
      return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12 max-w-md mx-auto bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold">Acceso denegado</h2>
              <p className="text-muted-foreground mt-2 mb-4">
                Debes iniciar sesión para ver esta publicación.
              </p>
              <Link 
                href="/" 
                className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded"
              >
                Ir a inicio
              </Link>
            </div>
          </div>
        </main>
      )
    }

    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<PostDetailSkeleton />}>
            <PostDetail slug={resolvedParams.slug} />
          </Suspense>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error in post page:", error)
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Publicación no disponible</h2>
            <p className="text-muted-foreground mt-2">
              La publicación que estás buscando no está disponible o ha sido eliminada.
            </p>
          </div>
        </div>
      </main>
    )
  }
}

function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  )
} 