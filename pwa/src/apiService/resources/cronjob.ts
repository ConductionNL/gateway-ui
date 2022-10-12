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
}