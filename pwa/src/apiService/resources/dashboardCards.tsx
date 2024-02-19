import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export type TEntity =
  | "Action"
  | "Gateway"
  | "Cronjob"
  | "Endpoint"
  | "ObjectEntity"
  | "Entity"
  | "CollectionEntity"
  | "Organization"
  | "User"
  | "Authentication"
  | "Mapping"
  | "Template";

export default class DashboardCards {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/dashboardCards", undefined, {
      error: "Could not fetch Dashboardcards.",
    });

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/dashboardCards${id}`);

    return data;
  };

  public createOrDelete = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "DELETE", `/admin/dashboardCards/${id}`, undefined, {
        loading: "Removing from dashboard...",
        success: "Succesfully removed from dashboard.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/dashboardCards", payload, {
      loading: "Adding to dashboard...",
      success: "Succesfully added to dashboard.",
    });
    return data;
  };
}
