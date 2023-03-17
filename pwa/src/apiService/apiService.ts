import axios, { AxiosInstance, AxiosResponse } from "axios";
import { handleAutomaticLogout, validateSession } from "../hooks/useAuthentication";
import toast from "react-hot-toast";

// Services
import Login from "./services/login";
import Me from "./services/me";

// Resources
import Action from "./resources/action";
import Source from "./resources/source";
import Cronjob from "./resources/cronjob";
import Endpoint from "./resources/endpoint";
import Object from "./resources/object";
import Schema from "./resources/schema";
import Log from "./resources/log";
import Collection from "./resources/collection";
import DashboardCards from "./resources/dashboardCards";
import Attribute from "./resources/attribute";
import Plugin from "./resources/plugin";
import PluginReadMe from "./resources/pluginReadme";
import Synchroniation from "./resources/synchronization";
import Application from "./resources/application";
import Organization from "./resources/organization";
import User from "./resources/user";
import Authentication from "./resources/authentication";
import SecurityGroup from "./resources/securityGroup";
import Mapping from "./resources/mapping";

interface PromiseMessage {
  loading?: string;
  success?: string;
}

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

  private renewAuthentication(): void {
    this.apiClient.get("/users/reset_token").then((res) => this.setAuthentication(res.data.jwtToken));
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

  public get gitClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_BASE_URL") ?? "",
      headers: {
        Accept: "application/vnd.github.html",
      },
    });
  }

  // Resources
  public get Action(): Action {
    return new Action(this.BaseClient, this.Send);
  }

  public get Plugin(): Plugin {
    return new Plugin(this.BaseClient);
  }

  public get PluginReadMe(): PluginReadMe {
    return new PluginReadMe(this.gitClient);
  }

  public get Sources(): Source {
    return new Source(this.BaseClient);
  }

  public get Cronjob(): Cronjob {
    return new Cronjob(this.BaseClient);
  }

  public get Endpoints(): Endpoint {
    return new Endpoint(this.BaseClient);
  }

  public get Object(): Object {
    return new Object(this.BaseClient);
  }

  public get Schema(): Schema {
    return new Schema(this.BaseClient);
  }

  public get Log(): Log {
    return new Log(this.BaseClient);
  }

  public get Collection(): Collection {
    return new Collection(this.BaseClient);
  }

  public get DashboardCards(): DashboardCards {
    return new DashboardCards(this.BaseClient);
  }

  public get Attribute(): Attribute {
    return new Attribute(this.BaseClient);
  }

  public get Synchroniation(): Synchroniation {
    return new Synchroniation(this.BaseClient);
  }

  public get Application(): Application {
    return new Application(this.BaseClient);
  }

  public get Organization(): Organization {
    return new Organization(this.BaseClient);
  }

  public get User(): User {
    return new User(this.BaseClient);
  }

  public get Authentication(): Authentication {
    return new Authentication(this.BaseClient);
  }

  public get SecurityGroup(): SecurityGroup {
    return new SecurityGroup(this.BaseClient);
  }

  public get Mapping(): Mapping {
    return new Mapping(this.BaseClient);
  }

  // Services
  public get Login(): Login {
    return new Login(this.LoginClient);
  }

  public get Me(): Me {
    return new Me(this.BaseClient);
  }

  // Send method
  public get Send(): any {
    // TODO: add type
    return (
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

      this.renewAuthentication();

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
            success: promiseMessage?.success ?? "Succesfully updated item",
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
  }
}
