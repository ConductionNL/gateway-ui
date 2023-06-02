import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Mapping {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/mappings");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/mappings/${id}`);

    return data;
  };

  public downloadPDF = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/pdf" } };
    });

    const { data } = await this._send(this._instance, "GET", `admin/mappings/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/mappings/${id}`, undefined, {
      loading: "Removing mapping...",
      success: "Mapping successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/mappings/${id}`, payload, {
        loading: "Updating mapping...",
        success: "Mapping successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/mappings", payload, {
      loading: "Creating mapping...",
      success: "Mapping successfully created.",
    });
    return data;
  };

  public testMapping = async (variables: { payload: any; id: string }): Promise<any> => {
    const { id, payload } = variables;

    const { data } = await this._send(this._instance, "POST", `/admin/mappings/${id}/test`, payload, {
      loading: "Testing mapping...",
      success: "Mapping succesfully tested.",
    });

    return data;
  };
}
