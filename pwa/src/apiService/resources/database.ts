import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Database {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/databases");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/databases?limit=200");

    return data?.map((database: any) => ({ label: database.name, value: database.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/databases/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/databases/${id}`, undefined, {
      loading: "Removing database...",
      success: "Database successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/databases/${id}`, payload, {
        loading: "Updating database...",
        success: "Database successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/databases", payload, {
      loading: "Creating database...",
      success: "Database successfully created.",
    });
    return data;
  };
}
