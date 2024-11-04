import { AxiosInstance } from "axios";
import { DEFAULT_LIMIT, TSendFunction } from "../apiService";

export default class Template {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/templates?limit=${DEFAULT_LIMIT}`);

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/templates?limit=${DEFAULT_LIMIT}`);

    return data?.map((template: any) => ({ label: template.name, value: template.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/templates/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/templates/${id}`, undefined, {
      loading: "Removing template...",
      success: "Template successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/templates/${id}`, payload, {
        loading: "Updating template...",
        success: "Template successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/templates", payload, {
      loading: "Creating template...",
      success: "Template successfully created.",
    });
    return data;
  };
}
