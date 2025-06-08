export interface AnilistResponse {
  Page: {
    media: Array<{
      id: number
      title: {
        romaji: string
        english: string
        native: string
      }
      description: string
      coverImage: {
        extraLarge: string
        large: string
        medium: string
      }
      averageScore: number
      genres: string[]
      status: string
      chapters: number
      volumes: number
      format: string
      startDate: {
        year: number
        month: number
        day: number
      }
      endDate: {
        year: number
        month: number
        day: number
      }
      staff?: {
        edges: Array<{
          role: string;
          node: {
            name: {
              full: string;
            };
          };
        }>;
      };
    }>
  }
}

export interface FeaturedManga {
  id: string
  title: string
  description: string
  image: string
  rating: string
}

export interface Manga {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    extraLarge: string;
  };
  description: string;
  genres: string[];
  status: string;
  format: string;
  chapters: number;
  volumes: number;
  averageScore: number;
  staff: {
    edges: Array<{
      role: string;
      node: {
        name: {
          full: string;
        };
      };
    }>;
  };
}

// Statik manga verileri
export const STATIC_MANGAS: Manga[] = [
  {
    id: "1",
    title: {
      romaji: "One Piece",
      english: "One Piece",
      native: "ワンピース"
    },
    coverImage: {
      extraLarge: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg"
    },
    description: "Gol D. Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.",
    genres: ["Action", "Adventure", "Fantasy", "Comedy"],
    status: "RELEASING",
    format: "MANGA",
    chapters: 1100,
    volumes: 100,
    averageScore: 89,
    staff: {
      edges: [
        {
          role: "Story & Art",
          node: {
            name: {
              full: "Eiichiro Oda"
            }
          }
        }
      ]
    }
  },
  {
    id: "2",
    title: {
      romaji: "Naruto",
      english: "Naruto",
      native: "ナルト"
    },
    coverImage: {
      extraLarge: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg"
    },
    description: "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi's rampage, the leader of the village, the Fourth Hokage, sacrificed his life and sealed the monstrous beast inside the newborn Naruto.",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "FINISHED",
    format: "MANGA",
    chapters: 700,
    volumes: 72,
    averageScore: 85,
    staff: {
      edges: [
        {
          role: "Story & Art",
          node: {
            name: {
              full: "Masashi Kishimoto"
            }
          }
        }
      ]
    }
  },
  {
    id: "3",
    title: {
      romaji: "Bleach",
      english: "Bleach",
      native: "ブリーチ"
    },
    coverImage: {
      extraLarge: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg"
    },
    description: "Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo's family from the assailant. To save his family, Ichigo accepts Rukia's offer of taking her powers and becomes a Soul Reaper himself.",
    genres: ["Action", "Adventure", "Supernatural"],
    status: "FINISHED",
    format: "MANGA",
    chapters: 686,
    volumes: 74,
    averageScore: 83,
    staff: {
      edges: [
        {
          role: "Story & Art",
          node: {
            name: {
              full: "Tite Kubo"
            }
          }
        }
      ]
    }
  }
];

export const GET_RECENT_MANGAS = `
  query GetRecentMangas($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
        }
        description
        genres
        status
        format
        chapters
        volumes
        averageScore
        staff {
          edges {
            role
            node {
              name {
                full
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TRENDING_MANGAS = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, sort: TRENDING_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          extraLarge
          large
          medium
        }
        averageScore
        genres
        status
        chapters
        volumes
        format
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }
`

export const GET_MANGA_DETAILS_BY_TITLE = `
  query GetMangaDetailsByTitle($title: String) {
    Page(page: 1, perPage: 1) {
      media(type: MANGA, search: $title) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
        }
        description
        genres
        status
        format
        chapters
        volumes
        averageScore
        staff {
          edges {
            role
            node {
              name {
                full
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchAnilistData<T>(query: string, variables: any): Promise<T> {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data as T;
  } catch (error) {
    console.error('Error fetching data from AniList:', error);
    throw error;
  }
} 