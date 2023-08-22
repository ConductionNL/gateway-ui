import axios, { AxiosInstance, AxiosResponse } from "axios";
import { shouldRenewToken, handleAutomaticLogout, validateSession } from "../hooks/useAuthentication";
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
import Template from "./resources/template";
import Upload from "./resources/upload";

interface PromiseMessage {
  loading?: string;
  success?: string;
}

export type TSendFunction = (
  instance: AxiosInstance,
  action: "GET" | "POST" | "PUT" | "DELETE" | "DOWNLOAD",
  endpoint: string,
  payload?: JSON | FormData,
  promiseMessage?: PromiseMessage,
) => Promise<AxiosResponse>;

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
    this.apiClient
      .get("/users/reset_token", { withCredentials: true })
      .then((res) => this.setAuthentication(res.data.jwtToken));
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
    let headers: any = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (this.getJWT()) {
      headers.Authorization = `Bearer ${this.getJWT()}`;
    }

    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_API_URL") ?? "",
      headers,
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

  public get GitClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_BASE_URL") ?? "",
      headers: {
        Accept: "application/vnd.github.html",
      },
    });
  }

  public get MultipartFormClient(): AxiosInstance {
    return axios.create({
      baseURL: window.sessionStorage.getItem("GATSBY_BASE_URL") ?? "",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + this.getJWT(),
      },
    });
  }

  // Resources
  public get Action(): Action {
    return new Action(this.BaseClient, this.Send);
  }

  public get Plugin(): Plugin {
    return new Plugin(this.BaseClient, this.Send);
  }

  public get PluginReadMe(): PluginReadMe {
    return new PluginReadMe(this.GitClient, this.Send);
  }

  public get Sources(): Source {
    return new Source(this.BaseClient, this.Send);
  }

  public get Cronjob(): Cronjob {
    return new Cronjob(this.BaseClient, this.Send);
  }

  public get Endpoints(): Endpoint {
    return new Endpoint(this.BaseClient, this.Send);
  }

  public get Object(): Object {
    return new Object(this.BaseClient, this.Send);
  }

  public get Schema(): Schema {
    return new Schema(this.BaseClient, this.Send);
  }

  public get Log(): Log {
    return new Log(this.BaseClient, this.Send);
  }

  public get Collection(): Collection {
    return new Collection(this.BaseClient, this.Send);
  }

  public get DashboardCards(): DashboardCards {
    return new DashboardCards(this.BaseClient, this.Send);
  }

  public get Attribute(): Attribute {
    return new Attribute(this.BaseClient, this.Send);
  }

  public get Synchroniation(): Synchroniation {
    return new Synchroniation(this.BaseClient, this.Send);
  }

  public get Application(): Application {
    return new Application(this.BaseClient, this.Send);
  }

  public get Organization(): Organization {
    return new Organization(this.BaseClient, this.Send);
  }

  public get User(): User {
    return new User(this.BaseClient, this.Send);
  }

  public get Authentication(): Authentication {
    return new Authentication(this.BaseClient, this.Send);
  }

  public get SecurityGroup(): SecurityGroup {
    return new SecurityGroup(this.BaseClient, this.Send);
  }

  public get Mapping(): Mapping {
    return new Mapping(this.BaseClient, this.Send);
  }

  public get Template(): Template {
    return new Template(this.BaseClient, this.Send);
  }

  public get Upload(): Upload {
    return new Upload(this.MultipartFormClient, this.Send);
  }

  // Services
  public get Login(): Login {
    return new Login(this.LoginClient);
  }

  public get Me(): Me {
    return new Me(this.BaseClient, this.Send);
  }

  // Send method
  public Send: TSendFunction = (instance, action, endpoint, payload, promiseMessage) => {
    let _payload: any = payload;

    if (typeof _payload === "object" && !(_payload instanceof FormData)) {
      _payload = JSON.stringify(_payload);
    }

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

    if (shouldRenewToken()) {
      this.renewAuthentication();
    }

    switch (action) {
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

      case "DOWNLOAD":
        return toast.promise(instance.get(endpoint), {
          loading: promiseMessage?.loading ?? "Downloading item...",
          success: promiseMessage?.success ?? "Succesfully downloaded item",
          error: (err) => err.message,
        });
    }
  };
}
