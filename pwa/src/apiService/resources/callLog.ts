import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class CallLog {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/logs/calllogs");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/logs/calllogs/${id}`);

    return data;
  };

  public getSourceLog = async (sourceId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/logs/calllogs?source.id=${sourceId}`);

    return data;
  };
}
