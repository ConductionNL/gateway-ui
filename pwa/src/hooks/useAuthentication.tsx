import * as React from "react";
import { navigate } from "gatsby-link";
import APIService from "../apiService/apiService";
import { jwtDecode, JwtPayload } from "jwt-decode";
import toast from "react-hot-toast";
import APIContext from "../apiService/apiContext";

export interface IUnvalidatedUser {
  username: string;
  password: string;
}

const isBrowser = (): boolean => typeof window !== "undefined";

export const useAuthentication = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const API: APIService | null = React.useContext(APIContext);

  // Handle logout
  const handleLogout = async () => {
    if (!isBrowser()) return;

    return await toast.promise(
      API.Login.logout().then(() => {
        API.removeAuthentication();
        navigate("/");
      }),

      {
        loading: "Logging out...",
        success: "Succesfully logged out",
        error: (err) => err.message,
      },
    );
  };

  // Login using gateway users
  const handleInternalLogin = async (data: IUnvalidatedUser) => {
    if (!isBrowser()) return;

    setIsLoading(true);

    return await toast.promise(
      API.Login.login(data)
        .then((res) => {
          API.setAuthentication(res.data.jwtToken);
        })
        .finally(() => setIsLoading(false)),
      {
        loading: "Logging in...",
        success: "Welcome back",
        error: (err) => err.message,
      },
    );
  };

  // e.g. ADFS
  const handleExternalLogin = async () => {
    if (!isBrowser()) return;

    setIsLoading(true);

    return await toast.promise(
      API.Login.getExternalToken()
        .then((res) => {
          API.setAuthentication(res.data.jwtToken);
        })
        .finally(() => {
          setIsLoading(false);
          document.cookie = "redirected_to_adfs=false";
        }),
      {
        loading: "Logging in using external provider...",
        success: "Welcome back",
        error: (err) => err.message,
      },
    );
  };

  const isLoggedIn = (): boolean => {
    if (!isBrowser()) return false;

    return !!window.sessionStorage.getItem("JWT");
  };

  return { handleInternalLogin, handleExternalLogin, isLoggedIn, handleLogout, isLoading };
};

export const handleAutomaticLogout = () => {
  window.sessionStorage.removeItem("JWT");
  navigate("/");
};

export const validateSession = () => {
  const token = sessionStorage.getItem("JWT");

  if (!token) return false;

  const decoded = jwtDecode<JwtPayload>(token);

  const expired = decoded?.exp && Date.now() >= decoded.exp * 1000;

  return !expired;
};

export const shouldRenewToken = (): boolean => {
  const token = sessionStorage.getItem("JWT");

  if (!token) return false;

  const decoded = jwtDecode<JwtPayload>(token);

  if (decoded.exp) {
    const renewTokenTime = decoded.exp * 1000 - 5 * 60 * 1000; // 5 is minutes
    const tokenExpiration = decoded.exp * 1000;
    const currentTime = Date.now();

    if (
      decoded?.exp &&
      currentTime.valueOf() >= renewTokenTime.valueOf() &&
      currentTime.valueOf() <= tokenExpiration.valueOf()
    ) {
      return true;
    }
  }
  return false;
};
