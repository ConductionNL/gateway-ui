import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Source {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/gateways?order[name]=ASC");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/gateways/${id}`);

    return data;
  };

  public getProxy = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { id, payload } = variables;

    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      const _config = {
        ...config,
        headers: {
          ...config.headers,
        },
      };
      console.log({ _config, config });
      return _config;
    });

    const { data } = await Send(instance, "POST", `/admin/sources/${id}/proxy`);
    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/gateways/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/gateways/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/gateways", payload);
    return data;
  };
}
