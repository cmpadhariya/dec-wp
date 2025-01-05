// lib/apollo-client.js

// Import necessary modules from the "@apollo/client" library
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { uri } from "./../setup";

// Function to initialize and configure the Apollo Client for GraphQL operations
export function initializeApollo() {
  // Create an HTTP link to connect to the GraphQL server with the specified URI
  const httpLink = createHttpLink({
    uri: uri ,
  });

  // Create a new instance of ApolloClient, passing the HTTP link and an in-memory cache
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  // Return the configured Apollo Client instance
  return client;
}
