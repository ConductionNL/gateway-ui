import { AxiosInstance, AxiosResponse } from "axios";

export default class RenewToken {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public renewToken = (): Promise<AxiosResponse> => {
    return this._instance.get("/users/reset_token");
  };
}
