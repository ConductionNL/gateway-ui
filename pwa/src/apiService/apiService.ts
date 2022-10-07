import axios, { AxiosInstance, AxiosResponse } from "axios";

// Services
import Login from "./services/login";
import Me from "./services/me";

// Resources
// import Example from "./resources/example";

export default class APIService {
  public removeAuthentication(): void {
    window.sessionStorage.removeItem("JWT");
  }

  public setAuthentication(_JWT: string): void {
    window.sessionStorage.setItem("JWT", _JWT);
  }

  public get authenticated(): boolean {
    return window.sessionStorage.getItem("JWT") ? true : false;
  }

  private getJWT(): string | null {
    return window.sessionStorage.getItem("JWT");
  }

  public get apiClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_API_URL") ?? "",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getJWT(),
      },
    });
  }

  public get halApiClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_API_URL") ?? "",
      headers: {
        Accept: "application/json+hal",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getJWT(),
      },
    });
  }

  public get LoginClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_API_URL") ?? "",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  public get BaseClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_BASE_URL") ?? "",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getJWT(),
      },
    });
  }

  // Resources
  // public get Example(): Example {
  //   return new Example(this.halApiClient);
  // }

  // Services
  public get Login(): Login {
    return new Login(this.LoginClient);
  }

  public get Me(): Me {
    return new Me(this.BaseClient);
  }
}

export const Send = (
  instance: AxiosInstance,
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  payload?: JSON,
): Promise<AxiosResponse> => {
  const _payload = JSON.stringify(payload);

  switch (method) {
    case "GET":
      return instance.get(endpoint);
    case "POST":
      return instance.post(endpoint, _payload);
    case "PUT":
      return instance.put(endpoint, _payload);
    case "DELETE":
      return instance.delete(endpoint);
  }
};
