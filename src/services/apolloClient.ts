import { ApolloClient, from, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { appSettings } from "@/constants/app";
import { useDeviceStore } from "@/stores";

const API_HTTP_ENDPOINT = "https://api-yotuna.mobulum.com/graphql";
const API_WS_ENDPOINT = "wss://api-yotuna.mobulum.com/graphql";

// Error handling link
const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    console.error("[Apollo] Network error:", networkError);
  }
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[Apollo] GraphQL error: ${message}`, { locations, path });
    });
  }
});

// HTTP link
const httpLink = new HttpLink({
  uri: API_HTTP_ENDPOINT,
  headers: {
    "x-app-version": appSettings.appVersion,
  },
});

// Auth link to add deviceId to headers
const authLink = setContext((_, { headers }) => {
  const deviceId = useDeviceStore.getState().generateDeviceId();
  return {
    headers: {
      ...headers,
      "x-device-id": deviceId,
      "x-app-version": appSettings.appVersion,
    },
  };
});

// WebSocket link for GraphQL subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: API_WS_ENDPOINT,
    lazy: true,
    retryAttempts: Infinity,
    shouldRetry: () => true,
    connectionParams: () => ({
      "x-device-id": useDeviceStore.getState().generateDeviceId(),
      "x-app-version": appSettings.appVersion,
    }),
  }),
);

// Route subscriptions over WebSocket, queries/mutations over HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink),
);

// Apollo cache with pagination merge policies
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getStations: {
          keyArgs: ["query", "genres"],
          merge(existing = { stations: [], total: 0 }, incoming, { args }) {
            return {
              stations: args?.offset ? [...existing.stations, ...incoming.stations] : incoming.stations,
              total: incoming.total,
            };
          },
        },
        getStationPlaylist: {
          keyArgs: ["stationId", "from", "to"],
        },
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
