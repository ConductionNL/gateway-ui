import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Schema {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/entities?limit=1000");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/entities/${id}`);

    return data;
  };

  public getSchema = async (id: string): Promise<any> => {
    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/json+schema" } };
    });

    const { data } = await Send(this._instance, "GET", `admin/entities/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/entities/${id}`, undefined, {
      loading: "Removing schema...",
      success: "Schema successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/entities/${id}`, payload, {
        loading: "Updating schema...",
        success: "Schema successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/entities", payload, {
      loading: "Creating schema...",
      success: "Schema successfully created.",
    });
    return data;
  };
}
