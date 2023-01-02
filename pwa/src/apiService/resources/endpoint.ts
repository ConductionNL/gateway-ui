import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Endpoint {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/endpoints");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/endpoints/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/endpoints/${id}`, undefined, {
      loading: "Removing endpoint...",
      success: "Endpoint successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/endpoints/${id}`, payload, {
        loading: "Updating endpoint...",
        success: "Endpoint successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/endpoints", payload, {
      loading: "Creating endpoint...",
      success: "Endpoint successfully created.",
    });
    return data;
  };
}
