import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Template {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/templates");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/templates?limit=200");

    return data?.map((template: any) => ({ label: template.name, value: template.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/templates/${id}`);

    return data;
  };

  public downloadPDF = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/pdf" } };
    });

    const { data } = await this._send(this._instance, "DOWNLOAD", `admin/templates/${id}`, undefined, {
      loading: "Downloading PDF of template...",
      success: "Succesfully downloaded PDF of template.",
    });
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
