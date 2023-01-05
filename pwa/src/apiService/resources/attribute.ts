import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Attribute {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/attributes");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/attributes/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/attributes/${id}`, undefined, {
      loading: "Removing property...",
      success: "Property successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/attributes/${id}`, payload, {
        loading: "Updating property...",
        success: "Property successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/attributes", payload, {
      loading: "Creating property...",
      success: "Property successfully created.",
    });
    return data;
  };
}
