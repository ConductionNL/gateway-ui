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
      loading: "Removing authentication provider...",
      success: "Authentication Provider successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/authentications/${id}`, payload, {
        loading: "Updating authentication provider...",
        success: "Authentication Provider successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/authentications", payload, {
      loading: "Creating authentication provider...",
      success: "Authentication Provider successfully created.",
    });
    return data;
  };
}
