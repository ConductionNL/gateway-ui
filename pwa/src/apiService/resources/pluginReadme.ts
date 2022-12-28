import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class PluginReadMe {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getReadMe = async (url: string): Promise<any> => {
    this._instance.interceptors.request.use(function (config) {
      return {
        ...config,
        headers: { ...config.headers, Accept: "application/vnd.github.html" },
      };
    });

    const repo = url.replace("https://github.com/", "");

    const { data } = await Send(this._instance, "GET", `https://api.github.com/repos/${repo}/readme`);

    return data;
  };
}
