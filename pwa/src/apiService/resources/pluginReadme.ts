import { AxiosInstance } from "axios";

export default class PluginReadMe {
  private _instance: AxiosInstance;
  private _send: any; // TODO: add type

  constructor(instance: AxiosInstance, send: any) {
    // TODO: add type
    this._instance = instance;
    this._send = send;
  }

  public getReadMe = async (url: string): Promise<any> => {
    this._instance.interceptors.request.use(function (config) {
      return {
        ...config,
        headers: { ...config.headers, Accept: "application/vnd.github.html" },
      };
    });

    const repo = url.replace("https://github.com/", "");

    const { data } = await this._send(this._instance, "GET", `https://api.github.com/repos/${repo}/readme`);

    return data;
  };
}
