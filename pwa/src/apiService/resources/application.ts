import { AxiosInstance } from "axios";
import { DEFAULT_LIMIT, TSendFunction } from "../apiService";

export default class Application {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/applications?limit=${DEFAULT_LIMIT}`);

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/applications?limit=${DEFAULT_LIMIT}`);

    return data?.map((application: any) => ({ label: application.name, value: application.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/applications/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/applications/${id}`, undefined, {
      loading: "Removing application...",
      success: "Application successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/applications/${id}`, payload, {
        loading: "Updating application...",
        success: "Application successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/applications", payload, {
      loading: "Creating application...",
      success: "Application successfully created.",
    });
    return data;
  };
}
