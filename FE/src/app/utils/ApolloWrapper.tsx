"use client";

import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "../api/ApolloClient";
import { ReactNode } from "react";

interface ApolloWrapperProps {
  children: ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
