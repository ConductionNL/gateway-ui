import { AxiosInstance } from "axios";
import { DEFAULT_LIMIT, TSendFunction } from "../apiService";

export default class User {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/users?limit=${DEFAULT_LIMIT}`);

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/users?limit=${DEFAULT_LIMIT}`);

    return data?.map((user: any) => ({ label: user.name, value: user.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/users/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/users/${id}`, undefined, {
      loading: "Removing user...",
      success: "User successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/users/${id}`, payload, {
        loading: "Updating user...",
        success: "User successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/users", payload, {
      loading: "Creating user...",
      success: "User successfully created.",
    });
    return data;
  };
}
