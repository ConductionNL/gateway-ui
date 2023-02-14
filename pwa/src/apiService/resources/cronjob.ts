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

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/cronjobs?limit=200");

    return data?.map((cronjob: any) => ({ label: cronjob.name, value: cronjob.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/cronjobs/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/cronjobs/${id}`, undefined, {
      loading: "Removing cronjob...",
      success: "Cronjob successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/cronjobs/${id}`, payload, {
        loading: "Updating cronjob...",
        success: "Cronjob successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/cronjobs", payload, {
      loading: "Creating cronjob...",
      success: "Cronjob successfully created.",
    });
    return data;
  };
}
