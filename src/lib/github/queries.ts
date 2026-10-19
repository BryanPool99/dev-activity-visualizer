/**
 * One query carries the profile, the owned repositories with their language
 * breakdown, and the full contribution calendar. `rateLimit` comes back in the
 * same envelope, so the quota costs nothing extra to read.
 */
export const USER_REPORT_QUERY = /* GraphQL */ `
  query UserReport($login: String!, $repoCount: Int!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      company
      location
      websiteUrl
      twitterUsername
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: $repoCount
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          updatedAt
          isFork
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
    rateLimit {
      limit
      remaining
      resetAt
      cost
    }
  }
`

export const GRAPHQL_SOURCES = {
  profile: 'GraphQL user(login)',
  repos: 'GraphQL user.repositories',
  calendar: 'GraphQL contributionsCollection.contributionCalendar',
} as const
