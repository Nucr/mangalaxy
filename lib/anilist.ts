interface Title {
  romaji: string;
  english: string;
  native: string;
}

interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
}

interface Manga {
  id: number;
  title: Title;
  coverImage: CoverImage;
  chapters?: number;
  volumes?: number;
  description?: string;
  averageScore?: number;
  genres?: string[];
  status?: string;
  format?: string;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
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
}

interface PageData {
  media: Manga[];
}

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

export const GET_RECENT_MANGAS = `
  query GetRecentManga($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: MANGA
        sort: [UPDATED_AT_DESC]
        isAdult: false
      ) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
        }
        chapters
        volumes
      }
    }
  }
`

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
        staff(type: PRIMARY, sort: [RELEVANCE]) {
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
`

export async function fetchAnilistData<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
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
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    return data.data as T
  } catch (error) {
    console.error('Error fetching data from AniList:', error)
    throw error
  }
}