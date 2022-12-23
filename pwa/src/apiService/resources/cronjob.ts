import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Cronjob {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/cronjobs");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/cronjobs/${id}`);

    return data;
  };

  public remove = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/cronjobs/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/cronjobs/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/cronjobs", payload);
    return data;
  };
}
