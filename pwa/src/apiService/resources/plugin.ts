import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Plugin {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAllInstalled = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/plugins/installed");

    return data;
  };

  public getAllAudit = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/plugins/audit");

    return data;
  };

  public getAllAvailable = async (searchQuery: string): Promise<any> => {
    let search = searchQuery ? `?search=${searchQuery}` : "";

    const { data } = await Send(this._instance, "GET", `/admin/plugins/available${search}`);

    return data;
  };

  public getView = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/plugins/view");

    return data;
  };

  public getOne = async (name: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/plugins/view?plugin=${name}`);

    return data;
  };

  public install = async (variables: { name: string }): Promise<any> => {
    const { name } = variables;

    const { data } = await Send(this._instance, "POST", `/admin/plugins/install?plugin=${name}`, undefined, {
      loading: "Installing package...",
      success: "Package successfully installed.",
    });
    return data;
  };

  public upgrade = async (variables: { name: string }): Promise<any> => {
    const { name } = variables;

    const { data } = await Send(this._instance, "POST", `/admin/plugins/upgrade?plugin=${name}`, undefined, {
      loading: "Updating package...",
      success: "Package successfully updated.",
    });
    return data;
  };

  public delete = async (variables: { name: string }): Promise<any> => {
    const { name } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/plugins/remove?plugin=${name}`, undefined, {
      loading: "Removing package...",
      success: "Package successfully removed.",
    });
    return data;
  };
}
