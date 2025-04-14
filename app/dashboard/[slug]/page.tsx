import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Header from "@/components/header"
import PostDetail from "@/components/post-detail"
import { Skeleton } from "@/components/ui/skeleton"

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("auth-token")

  if (!authToken) {
    redirect("/")
  }

  const resolvedParams = await params

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
