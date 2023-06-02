import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Source {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/gateways?order[name]=ASC");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/gateways/${id}`);

    return data;
  };

  public downloadPDF = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/pdf" } };
    });

    const { data } = await this._send(this._instance, "GET", `admin/gateways/${id}`);

    return data;
  };

  public getProxy = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { id, payload } = variables;

    if (payload.endpoint && !(payload.endpoint[0] === "/")) {
      payload.endpoint = `/${payload.endpoint}`;
    }

    this._instance.interceptors.request.use(function (config) {
      return {
        ...config,
        headers: { ...config.headers, "x-method": payload.method.value, "x-endpoint": payload.endpoint },
      };
    });

    const { data } = await this._send(this._instance, "POST", `/admin/sources/${id}/proxy`, payload.body, {
      loading: "Testing connection...",
      success: "Connection successful.",
    });

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/gateways/${id}`, undefined, {
      loading: "Removing source...",
      success: "Source successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/gateways/${id}`, payload, {
        loading: "Updating source...",
        success: "Source successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/gateways", payload, {
      loading: "Creating source...",
      success: "Source successfully created.",
    });
    return data;
  };
}
