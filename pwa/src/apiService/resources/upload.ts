import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Upload {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public upload = async (variables: { payload: FormData }): Promise<any> => {
    const { payload } = variables;

    const { data } = await this._send(this._instance, "POST", "/admin/file-upload", payload, {
      loading: "Uploading...",
      success: "Upload successful.",
    });
    return data;
  };
}
