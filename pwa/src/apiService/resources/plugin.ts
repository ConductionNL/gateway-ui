import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Endpoint {
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
    let search;
    searchQuery && search == `?search=${searchQuery}`;

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

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/plugins/remove/${id}`);
    return data;
  };
}
