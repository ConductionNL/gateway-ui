import * as React from "react";
import { useAuthentication } from "./hooks/useAuthentication";
import { AuthenticatedLayout } from "./layout/AuthenticatedLayout";
import { UnauthenticatedLayout } from "./layout/UnauthenticatedLayout";

interface ContentProps {
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children }) => {
  const { isLoggedIn } = useAuthentication();

  return isLoggedIn() ? <AuthenticatedLayout {...{ children }} /> : <UnauthenticatedLayout {...{ children }} />;
};
