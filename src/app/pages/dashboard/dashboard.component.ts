import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/interfaces/post.interface';
import { WordPressService } from 'src/app/services/word-press.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  posts: any[] = [];
  loading = true;
  currentPage = 1;
  postsPerPage = 10;
  totalPages = 1;

  selectedPost: any | null = null;

  constructor(
    private wordpress: WordPressService
  ) { }


  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.wordpress.getPosts(this.currentPage, this.postsPerPage)
      .pipe(
        map((posts) => (posts.map((post: any) => this.parsePost(post))))
      )
      .subscribe({
        next: (response) => {
          this.posts = response;
          this.totalPages = Math.ceil(response.total / this.postsPerPage);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading posts:', error);
          this.loading = false;
        }
      });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPosts();
      window.scrollTo(0, 0);
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  private parsePost(post: Post) {
    const shortExcerpt = post.excerpt.rendered.slice(0, 100);
    return {
      id: post.id,
      date: post.date,
      date_gmt: post.date_gmt,
      guid: post.guid.rendered,
      modified: post.modified,
      modified_gmt: post.modified_gmt,
      slug: post.slug,
      status: post.status,
      type: post.type,
      link: post.link,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered.length > 100 ? shortExcerpt + '...' : shortExcerpt,
      imageUrl: post.uagb_featured_image_src.full || ''
    }
  }
}
