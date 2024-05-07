import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Organization {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/organizations");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/organizations?limit=200");

    return data?.map((organization: any) => ({ label: organization.name, value: organization.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/organizations/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/organizations/${id}`, undefined, {
      loading: "Removing organization...",
      success: "Organization successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/organizations/${id}`, payload, {
        loading: "Updating organization...",
        success: "Organization successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/organizations", payload, {
      loading: "Creating organization...",
      success: "Organization successfully created.",
    });
    return data;
  };
}
