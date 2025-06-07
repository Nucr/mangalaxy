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
}

interface PageData {
  media: Manga[];
}

export interface AnilistResponse {
  Page: PageData;
}

export async function fetchAnilistData<T = any>(query: string, variables?: object): Promise<T> {
  const ANILIST_API_URL = 'https://graphql.anilist.co'

  try {
    const res = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    })

    if (!res.ok) {
      const errorBody = await res.text()
      throw new Error(`Failed to fetch from AniList: ${res.status} - ${errorBody}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching AniList data:", error)
    throw error
  }
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
  query GetTrendingManga($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: MANGA
        sort: [TRENDING_DESC]
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
        description(asHtml: false)
        averageScore
      }
    }
  }
`