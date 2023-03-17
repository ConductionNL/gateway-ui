import { AxiosInstance, AxiosResponse } from "axios";

export default class Me {
  private _instance: AxiosInstance;
  private _send: any; // TODO: add type

  constructor(instance: AxiosInstance, send: any) {
    // TODO: add type
    this._instance = instance;
    this._send = send;
  }

  public getMe = async (): Promise<AxiosResponse> => {
    const { data } = await this._send(this._instance, "GET", "/me");
    return data;
  };
}
