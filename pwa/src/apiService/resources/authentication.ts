import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Authentication {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/authentications");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/authentications/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/authentications/${id}`, undefined, {
      loading: "Removing authentication...",
      success: "Authentication successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/authentications/${id}`, payload, {
        loading: "Updating authentication...",
        success: "Authentication successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/authentications", payload, {
      loading: "Creating authentication...",
      success: "Authentication successfully created.",
    });
    return data;
  };
}
