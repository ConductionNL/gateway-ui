import * as React from "react";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { isBrowser } from "../services/auth";

export const useDigiD = () => {
  const API: APIService | null = React.useContext(APIContext);

  const authenticate = () => {
    const params = new URLSearchParams(location.search);
    const undecodedToken: string | null = params.get("token");

    if (!undecodedToken) return false;

    const JWT: string = window.atob(undecodedToken);

    API.setAuthentication(JWT);
    return true;
  };

  const getRedirectURL = (): string | undefined => {
    if (!isBrowser()) return;

    // @ts-ignore
    return `${window.sessionStorage.getItem("GATSBY_BASE_URL")}/digid/login?returnUrl=${window.sessionStorage.getItem(
      "GATSBY_FRONTEND_URL",
    )}/callbacks/digid`;
  };

  return { authenticate, getRedirectURL };
};
