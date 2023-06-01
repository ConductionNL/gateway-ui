import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Cronjob {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/cronjobs");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/cronjobs?limit=200");

    return data?.map((cronjob: any) => ({ label: cronjob.name, value: cronjob.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/cronjobs/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/cronjobs/${id}`, undefined, {
      loading: "Removing cronjob...",
      success: "Cronjob successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/cronjobs/${id}`, payload, {
        loading: "Updating cronjob...",
        success: "Cronjob successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/cronjobs", payload, {
      loading: "Creating cronjob...",
      success: "Cronjob successfully created.",
    });
    return data;
  };
}
