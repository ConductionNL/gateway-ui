import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Attribute {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/attributes");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/attributes/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/attributes/${id}`, undefined, {
      loading: "Removing property...",
      success: "Property successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/attributes/${id}`, payload, {
        loading: "Updating property...",
        success: "Property successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/attributes", payload, {
      loading: "Creating property...",
      success: "Property successfully created.",
    });
    return data;
  };
}
