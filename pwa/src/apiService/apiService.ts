import axios, { AxiosInstance, AxiosResponse } from "axios";
import { handleAutomaticLogout, validateSession } from "../services/auth";

// Services
import Login from "./services/login";
import Me from "./services/me";

// Resources
import Action from "./resources/action";
import Sources from "./resources/sources";
import Cronjob from "./resources/cronjob";
import Endpoints from "./resources/endpoints"
import Object from "./resources/object";

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
  public get Action(): Action {
    return new Action(this.BaseClient);
  }

  public get Sources(): Sources {
    return new Sources(this.BaseClient);
  }
  
  public get Cronjob(): Cronjob {
    return new Cronjob(this.BaseClient);
  }
  
  public get Endpoints(): Endpoints {
    return new Endpoints(this.BaseClient);
  }

  public get Object(): Object {
    return new Object(this.BaseClient);
  }

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

  if (!validateSession()) {
    handleAutomaticLogout();

    return Promise.resolve({
      // return fake AxiosInstance for calls to not break
      data: [],
      status: -1,
      statusText: "Session invalid",
      config: {},
      headers: {},
    });
  }

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
