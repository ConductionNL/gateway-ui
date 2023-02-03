import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/monologs?channels[]=object");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/logs/${id}`);

    return data;
  };
}
