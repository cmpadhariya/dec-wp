// pages/_app.js

import { ApolloProvider } from "@apollo/client";  
import { initializeApollo } from "../lib/apollo";  


const MyApp = ({ Component, pageProps }) => {
  const apolloClient = initializeApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />  
    </ApolloProvider>
  );
};

export default MyApp;

