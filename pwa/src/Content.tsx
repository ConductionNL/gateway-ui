import * as React from "react";
import { isLoggedIn } from "./services/auth";
import { AuthenticatedLayout } from "./layout/AuthenticatedLayout";
import { UnauthenticatedLayout } from "./layout/UnauthenticatedLayout";
import Favicon from "react-favicon";
import { designTokenToUrl } from "./services/designTokenToUrl";
import { getTokenValue } from "./services/getTokenValue";

interface ContentProps {
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children }) => {
  return isLoggedIn() ? <AuthenticatedLayout {...{ children }} /> : <UnauthenticatedLayout {...{ children }} />;
};
