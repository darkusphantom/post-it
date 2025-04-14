import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { getPosts } from "@/lib/wordpress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function PostGrid({ page = 1 }: { page?: number }) {
  const { posts, totalPages } = await getPosts(page);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">
          No hay publicaciones disponibles
        </h2>
        <p className="text-muted-foreground mt-2">
          No se encontraron publicaciones en tu sitio de WordPress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="h-full overflow-hidden bg-slate-800 border-slate-700 hover:border-slate-600 transition-transform hover:scale-[1.02]">
          <CardHeader className="p-0">
            <div className="text-sm text-slate-400 p-4">
              {formatDate(post.date)}
            </div>
            {post.featuredImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2 line-clamp-2">
              {post.title}
            </h2>
            <div
              className="text-slate-400 line-clamp-3 text-sm"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </CardContent>
          <CardFooter className="p-4 pt-0">
              <Link href={`/dashboard/${post.slug}`}>
            <Button variant="default" size="sm" className="mt-2">
                Leer más <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
              </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
