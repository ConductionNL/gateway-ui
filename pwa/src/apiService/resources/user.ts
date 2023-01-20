import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class User {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/users");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/users/${id}`);

    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/users/${id}`, payload, {
        loading: "Updating organization...",
        success: "Organization successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/users", payload, {
      loading: "Creating organization...",
      success: "Organization successfully created.",
    });
    return data;
  };
}
