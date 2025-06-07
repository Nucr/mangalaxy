import { GraphQLClient, gql } from 'graphql-request'

const ANILIST_API_URL = 'https://graphql.anilist.co'

const client = new GraphQLClient(ANILIST_API_URL)

export async function fetchAnilistData(query: string, variables?: object) {
  try {
    return await client.request(query, variables)
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