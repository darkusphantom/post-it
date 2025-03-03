export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    _uag_custom_page_level_css: string;
    jetpack_post_was_ever_published: boolean;
    _jetpack_newsletter_access: string;
    _jetpack_dont_email_post_to_subs: boolean;
    _jetpack_newsletter_tier_id: number;
    _jetpack_memberships_contains_paywalled_content: boolean;
    _jetpack_memberships_contains_paid_content: boolean;
    footnotes: string;
    jetpack_publicize_message: string;
    jetpack_publicize_feature_enabled: boolean;
    jetpack_social_post_already_shared: boolean;
    jetpack_social_options: {
      image_generator_settings: {
        template: string;
        enabled: boolean;
      };
      version: number;
    };
  };
  categories: number[];
  tags: number[];
  class_list: string[];
  jetpack_publicize_connections: any[];
  yoast_head: string;
  yoast_head_json: {
    title: string;
    description: string;
    robots: {
      index: string;
      follow: string;
      'max-snippet': string;
      'max-image-preview': string;
      'max-video-preview': string;
    };
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_description: string;
    og_url: string;
    og_site_name: string;
    article_publisher: string;
    article_author: string;
    article_published_time: string;
    article_modified_time: string;
    og_image: {
      width: number;
      height: number;
      url: string;
      type: string;
    }[];
    author: string;
    twitter_card: string;
    twitter_creator: string;
    twitter_site: string;
    twitter_misc: {
      'Escrito por': string;
      'Tiempo de lectura': string;
    };
    schema: {
      '@context': string;
      '@graph': {
        '@type': string;
        '@id': string;
        isPartOf: {
          '@id': string;
        };
        author: {
          name: string;
          '@id': string;
        };
        headline: string;
        datePublished: string;
        dateModified: string;
        mainEntityOfPage: {
          '@id': string;
        };
        wordCount: number;
        commentCount: number;
        publisher: {
          '@id': string;
        };
        image: {
          '@id': string;
        };
        thumbnailUrl: string;
        keywords: string[];
        articleSection: string[];
        inLanguage: string;
        potentialAction: {
          '@type': string;
          name: string;
          target: string[];
        }[];
      }[];
    };
  };
  jetpack_featured_media_url: string;
  uagb_featured_image_src: {
    full: [string, number, number, boolean];
    thumbnail: [string, number, number, boolean];
    medium: [string, number, number, boolean];
    medium_large: [string, number, number, boolean];
    large: [string, number, number, boolean];
    '1536x1536': [string, number, number, boolean];
    '2048x2048': [string, number, number, boolean];
    'creativeily-featured-image': [string, number, number, boolean];
    'creativeily-featured-image-blogfeed': [string, number, number, boolean];
    'creativeily-thumbnail-avatar': [string, number, number, boolean];
  };
  uagb_author_info: {
    display_name: string;
    author_link: string;
  };
  uagb_comment_info: number;
  uagb_excerpt: string;
  jetpack_sharing_enabled: boolean;
  jetpack_likes_enabled: boolean;
  jetpack_related_posts: any[];
  _links: {
    self: {
      href: string;
      targetHints: {
        allow: string[];
      };
    }[];
    collection: {
      href: string;
    }[];
    about: {
      href: string;
    }[];
    author: {
      embeddable: boolean;
      href: string;
    }[];
    replies: {
      embeddable: boolean;
      href: string;
    }[];
    'version-history': {
      count: number;
      href: string;
    }[];
    'predecessor-version': {
      id: number;
      href: string;
    }[];
    'wp:featuredmedia': {
      embeddable: boolean;
      href: string;
    }[];
    'wp:attachment': {
      href: string;
    }[];
    'wp:term': {
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }[];
    curies: {
      name: string;
      href: string;
      templated: boolean;
    }[];
  };
}
