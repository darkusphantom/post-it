import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { getPostBySlug } from "@/lib/wordpress";
import SharePostButton from "@/components/share-post-button";

export default async function PostDetail({ slug }: { slug: string }) {
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Publicación no encontrada</h2>
          <p className="text-muted-foreground mt-2">
            La publicación que estás buscando no existe o ha sido eliminada.
          </p>
        </div>
      );
    }

    return (
      <>
        <article className="max-w-4xl mx-auto bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          {post.featuredImage && (
            <div className="relative h-64 w-full">
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex flex-col items-start mb-4">
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <p className="text-slate-400">{formatDate(post.date)}</p>
            </div>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
        <div className="flex justify-end p-6">
          <SharePostButton post={post} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading post:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">
          Error al cargar la publicación
        </h2>
        <p className="text-muted-foreground mt-2">
          Hubo un problema al cargar la publicación. Por favor, intenta
          nuevamente.
        </p>
      </div>
    );
  }
}
