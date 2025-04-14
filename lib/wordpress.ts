"use server"

import type { Post, PostsResponse } from "@/types/wordpress"
import { getAuthToken } from "@/lib/auth"

const POSTS_PER_PAGE = 10

export async function getPosts(page = 1): Promise<PostsResponse> {
  const authToken = await getAuthToken()
  if (!authToken) {
    throw new Error("No autenticado")
  }

  try {
    const apiUrl = process.env.WORDPRESS_API_URL
    if (!apiUrl) {
      throw new Error("URL de la API de WordPress no configurada")
    }

    const response = await fetch(`${apiUrl}/wp/v2/posts?page=${page}&per_page=${POSTS_PER_PAGE}&_embed`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Revalidar cada minuto
    })

    if (!response.ok) {
      throw new Error(`Error al obtener posts: ${response.statusText}`)
    }

    const totalPages = Number(response.headers.get("X-WP-TotalPages") || "1")
    const data = await response.json()
    const defaultImage = "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg";

    const posts: Post[] = data.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      date: post.date,
      slug: post.slug,
      featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || defaultImage || null,
    }))

    return {
      posts,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return {
      posts: [],
      totalPages: 0,
    }
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const authToken = await getAuthToken()
  if (!authToken) {
    return null
  }

  try {
    const apiUrl = process.env.WORDPRESS_API_URL
    if (!apiUrl) {
      throw new Error("URL de la API de WordPress no configurada")
    }

    const response = await fetch(`${apiUrl}/wp/v2/posts?slug=${slug}&_embed`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Revalidar cada minuto
    })

    if (!response.ok) {
      throw new Error(`Error al obtener post: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.length) {
      return null
    }

    const post = data[0]
    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      date: post.date,
      slug: post.slug,
      featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}
