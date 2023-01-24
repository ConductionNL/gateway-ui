import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Application {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/applications");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/applications/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/applications/${id}`, undefined, {
      loading: "Removing application...",
      success: "Application successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/applications/${id}`, payload, {
        loading: "Updating application...",
        success: "Application successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/applications", payload, {
      loading: "Creating application...",
      success: "Application successfully created.",
    });
    return data;
  };
}
