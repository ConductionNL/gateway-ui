import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Schema {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/entities?limit=200");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/entities?limit=200");

    return data?.map((schema: any) => ({ label: schema.name, value: schema.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/entities/${id}`);

    return data;
  };

  public downloadPDF = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/pdf" } };
    });

    const { data } = await this._send(this._instance, "DOWNLOAD", `admin/entities/${id}`, undefined, {
      loading: "Downloading PDF of schema...",
      success: "Succesfully downloaded PDF of schema.",
    });

    return data;
  };

  public getSchema = async (id: string): Promise<any> => {
    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/json+schema" } };
    });

    const { data } = await this._send(this._instance, "GET", `admin/entities/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/entities/${id}`, undefined, {
      loading: "Removing schema...",
      success: "Schema successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/entities/${id}`, payload, {
        loading: "Updating schema...",
        success: "Schema successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/entities", payload, {
      loading: "Creating schema...",
      success: "Schema successfully created.",
    });
    return data;
  };
}
