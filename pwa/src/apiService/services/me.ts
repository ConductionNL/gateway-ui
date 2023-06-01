import { AxiosInstance, AxiosResponse } from "axios";
import { TSendFunction } from "../apiService";

export default class Me {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getMe = async (): Promise<AxiosResponse> => {
    const { data } = await this._send(this._instance, "GET", "/me");
    return data;
  };
}
