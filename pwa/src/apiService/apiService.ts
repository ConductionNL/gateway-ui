import axios, { AxiosInstance, AxiosResponse } from "axios";
import { handleAutomaticLogout, validateSession } from "../services/auth";
import toast from "react-hot-toast";

// Services
import Login from "./services/login";
import Me from "./services/me";

// Resources
import Action from "./resources/action";
import Schema from "./resources/schema";
import Attribute from "./resources/attribute";
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
  
  public get Schema(): Schema {
    return new Schema(this.BaseClient);
  }
  
  public get Attribute(): Attribute {
    return new Attribute(this.BaseClient);
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

interface PromiseMessage {
  loading?: string;
  success?: string;
}

export const Send = (
  instance: AxiosInstance,
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  payload?: JSON,
  promiseMessage?: PromiseMessage,
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
      const response = instance.get(endpoint);

      response.catch((err) => toast.error(err.message));

      return response;

    case "POST":
      return toast.promise(instance.post(endpoint, _payload), {
        loading: promiseMessage?.loading ?? "Creating item...",
        success: promiseMessage?.success ?? "Succesfully created item",
        error: (err) => err.message,
      });

    case "PUT":
      return toast.promise(instance.put(endpoint, _payload), {
        loading: promiseMessage?.loading ?? "Updating item...",
        success: promiseMessage?.loading ?? "Succesfully updated item",
        error: (err) => err.message,
      });

    case "DELETE":
      return toast.promise(instance.delete(endpoint), {
        loading: promiseMessage?.loading ?? "Deleting item...",
        success: promiseMessage?.success ?? "Succesfully deleted item",
        error: (err) => err.message,
      });
  }
};
