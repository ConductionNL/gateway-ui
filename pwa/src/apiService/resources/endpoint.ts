import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Endpoint {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/endpoints");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/endpoints");

    return data?.map((endpoint: any) => ({ label: endpoint.name, value: endpoint.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/endpoints/${id}`);

    return data;
  };

  public downloadPDF = async (id: string): Promise<any> => {
    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/pdf" } };
    });

    const { data } = await this._send(this._instance, "GET", `admin/endpoints/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/endpoints/${id}`, undefined, {
      loading: "Removing endpoint...",
      success: "Endpoint successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/endpoints/${id}`, payload, {
        loading: "Updating endpoint...",
        success: "Endpoint successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/endpoints", payload, {
      loading: "Creating endpoint...",
      success: "Endpoint successfully created.",
    });
    return data;
  };
}
