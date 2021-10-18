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
    search_api: string;
    collection_api: string;
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
    collection_api: process.env.COLLECTION_API_URL || "http://localhost:8000",
    search_api: process.env.SEARCH_API_URL || "http://localhost:8002",
    graphQl: process.env.GRAPHQL || "http://localhost:8070/api/graphql",
    lazyLoad: process.env.LAZYLOAD || "http://localhost:8070/lazy-loading.svg",
    userEditUrl: process.env.USER_EDIT_URL || "http://localhost:8080/auth/admin/master/console/#/realms/dams/users/"
};
  