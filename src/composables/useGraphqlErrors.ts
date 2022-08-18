import { ErrorResponse } from '@apollo/client/link/error'
import { GraphQLError } from 'graphql/error'

const useGraphqlErrors = (_errorResponse: ErrorResponse) => {
  const checkForUnauthorized = () => {
    const gqlErrors = _errorResponse.graphQLErrors
    let authErrors: Array<Boolean | undefined> = []
    if (gqlErrors) {
      authErrors = gqlErrors.map((error) => {
        if (error.extensions) {
          if (invalidToken(error)) return true
          if (storyboxForbidden(error)) return true
          if (error.extensions?.statusCode === 401) return true
          if (error.extensions?.response && error.extensions?.response.status && error.extensions?.response.status === 401) return true
        }
      })
    }
    return authErrors.some((errors) => errors)
  }

  const storyboxForbidden = (error: GraphQLError) => {
    const checks: Array<boolean> = []
    checks.push(error.extensions?.response && error.extensions?.response.status && error.extensions?.response.status === 400)
    checks.push(error.extensions?.response && error.extensions?.response.body.message && error.extensions?.response.body.message === 'You must be logged in to access this feature')
    return checks.some((check) => check === true)
  }

  const invalidToken = (error: GraphQLError) => {
    const checks: Array<boolean> = []
    checks.push(error.extensions?.response && error.extensions?.response.status && error.extensions?.response.status === 401)
    checks.push(error.extensions?.response && error.extensions?.response.statusText && error.extensions?.response.statusText === 'Unauthorized')
    checks.push(
      error.extensions?.response &&
        error.extensions?.response.body.message &&
        error.extensions?.response.body.message === 'invalid_token: The access token provided is expired, revoked, malformed, or invalid for other reasons.'
    )
    return checks.some((check) => check === true)
  }

  const logFormattedErrors = () => {
    const gqlErrors = _errorResponse.graphQLErrors
    if (gqlErrors) {
      for (const error of gqlErrors) {
        if (error.extensions) {
          console.log(`Graphql error:`)
          console.log(`Status:`, error.extensions?.statusCode ? error.extensions?.statusCode : undefined)
          console.log(`Code:`, error.extensions?.code ? error.extensions?.code : undefined)
          console.log(`Message:`, error.message)
          console.log(`---`)
        }
      }
    }
  }

  return {
    checkForUnauthorized,
    logFormattedErrors,
  }
}

export default useGraphqlErrors
