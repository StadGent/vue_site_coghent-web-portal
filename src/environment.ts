const defaultPort = 4002;

type domain = {
    hostname: string;
    port: string;
    prefix?: string;
  };
  
  interface Environment {
    apollo: {
      introspection: boolean;
      playground: boolean;
    };
    port: number | string;
    sessionSecret: string;
    clientSecret: string;
    oauthBaseUrl: string;
    api: {
      collectionAPIUrl: string;
      searchAPIUrl: string;
    };
  
    graphQl: string;
    lazyLoad: string;
    userEditUrl: string;
  }
  
  export const environment: Environment = {
    apollo: {
      introspection: process.env.APOLLO_INTROSPECTION === "true",
      playground: process.env.APOLLO_PLAYGROUND === "true",
    },
    port: process.env.PORT || defaultPort,
    sessionSecret: process.env.APOLLO_SESSION_SECRET || "heelgeheim",
    clientSecret:
      process.env.APOLLO_CLIENT_SECRET || "445cac0c-101f-4916-8cb2-dade093d38a7",
    oauthBaseUrl:
      process.env.OAUTH_BASE_URL || "http://localhost:8080/auth/realms/dams/",
      api: {
        collectionAPIUrl: process.env.COLLECTION_API_URL || 'http://collection-api:8000',
        searchAPIUrl: process.env.SEARCH_API_URL || 'http://search-api:8002',
      },
    graphQl: process.env.GRAPHQL || "http://localhost:8070/api/graphql",
    lazyLoad: process.env.LAZYLOAD || "http://localhost:8070/lazy-loading.svg",
    userEditUrl: process.env.USER_EDIT_URL || "http://localhost:8080/auth/admin/master/console/#/realms/dams/users/"
};
  