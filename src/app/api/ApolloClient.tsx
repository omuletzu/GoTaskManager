import { HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: "http://localhost:8080/graphql"
    }),
    cache: new InMemoryCache()
})

export default apolloClient