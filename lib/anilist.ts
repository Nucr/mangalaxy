import { GraphQLClient, gql } from 'graphql-request'

const ANILIST_API_URL = 'https://graphql.anilist.co'

const client = new GraphQLClient(ANILIST_API_URL)

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
  try {
    return await client.request<T>(query, variables)
  } catch (error) {
    console.error("Error fetching AniList data:", error)
    throw error
  }
}

export { gql }

export const GET_RECENT_MANGAS = gql`
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

export const GET_TRENDING_MANGAS = gql`
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