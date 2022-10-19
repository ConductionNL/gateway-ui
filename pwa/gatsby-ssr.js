import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  isLoggedIn,
  handleAutomaticLogout,
  validateSession,
} from "./src/services/auth";

export const onRouteUpdate = () => {
  if (!isLoggedIn()) {
    return;
  }

  if (!validateSession) {
    handleAutomaticLogout();
  }
};

export const wrapRootElement = ({ element }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {element}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
