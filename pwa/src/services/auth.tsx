import { navigate } from "gatsby-link";
import APIService from "../apiService/apiService";
import jwtDecode, { JwtPayload } from "jwt-decode";

export interface IUnvalidatedUser {
  username: string;
  password: string;
}

export const isBrowser = (): boolean => typeof window !== "undefined";

export const handleLogin = async (data: IUnvalidatedUser, API: APIService) => {
  if (!isBrowser()) return;

  return await API.Login.login(data).then((res) => {
    API.setAuthentication(res.data.jwtToken);
    navigate("/");
  });
};

export const isLoggedIn = (): boolean => {
  if (!isBrowser()) return false;

  return !!window.sessionStorage.getItem("JWT");
};

export const handleLogout = (API: APIService): void => {
  if (!isBrowser()) return;

  API.removeAuthentication();
  navigate("/");
};

export const handleAutomaticLogout = () => {
  window.sessionStorage.removeItem("JWT");
  navigate("/");
};

export const validateSession = () => {
  const token = sessionStorage.getItem("JWT");

  if (!token) return false;

  const decoded = token && jwtDecode<JwtPayload>(token);
  // @ts-ignore
  const expired = Date.now() >= decoded.exp * 1000;

  return !expired;
};
