export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  date: string
  slug: string
  featuredImage: string | null
}

export interface PostsResponse {
  posts: Post[]
  totalPages: number
}
