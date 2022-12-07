import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Endpoint {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (page: number): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/endpoints?limit=10&page=${page}`);

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/endpoints/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/endpoints/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/endpoints/${id}`, payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/endpoints", payload);
    return data;
  };
}
