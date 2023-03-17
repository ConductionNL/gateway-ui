import { AxiosInstance } from "axios";

export default class Collection {
  private _instance: AxiosInstance;
  private _send: any; // TODO: add type

  constructor(instance: AxiosInstance, send: any) {
    // TODO: add type
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/collections");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/collections/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/collections/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/collections/${id}`, payload);
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/collections", payload);
    return data;
  };
}
