import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Plugin {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAllInstalled = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/plugins/installed");

    return data;
  };

  public getAllAudit = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/plugins/audit");

    return data;
  };

  public getAllAvailable = async (searchQuery: string): Promise<any> => {
    let search = searchQuery ? `?search=${searchQuery}` : "";

    const { data } = await this._send(this._instance, "GET", `/admin/plugins/available${search}`);

    return data;
  };

  public getView = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/plugins/view");

    return data;
  };

  public getOne = async (name: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/plugins/view?plugin=${name}`);

    return data;
  };

  public install = async (variables: { name: string }): Promise<any> => {
    const { name } = variables;

    const { data } = await this._send(this._instance, "POST", `/admin/plugins/install?plugin=${name}`, undefined, {
      loading: "Installing plugin...",
      success: "plugin successfully installed.",
    });
    return data;
  };

  public upgrade = async (variables: { name: string }): Promise<any> => {
    const { name } = variables;

    const { data } = await this._send(this._instance, "POST", `/admin/plugins/upgrade?plugin=${name}`, undefined, {
      loading: "Updating plugin...",
      success: "Plugin successfully updated.",
    });
    return data;
  };

  public delete = async (variables: { name: string }): Promise<any> => {
    const { name } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/plugins/remove?plugin=${name}`, undefined, {
      loading: "Removing plugin...",
      success: "Plugin successfully removed.",
    });
    return data;
  };
}
