import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Mapping {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/mappings");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/mappings/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/mappings/${id}`, undefined, {
      loading: "Removing mapping...",
      success: "Mapping successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/mappings/${id}`, payload, {
        loading: "Updating mapping...",
        success: "Mapping successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/mappings", payload, {
      loading: "Creating mapping...",
      success: "Mapping successfully created.",
    });
    return data;
  };

  public testMapping = async (variables: { payload: any; id: string }): Promise<any> => {
    const { id, payload } = variables;

    const { data } = await Send(this._instance, "POST", `/admin/mappings/${id}/test`, payload, {
      loading: "Testing mapping...",
      success: "Mapping succesfully tested.",
    });

    return data;
  };
}
