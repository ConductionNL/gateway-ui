import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export type TEntity = "Action" | "Gateway" | "Cronjob" | "Endpoint" | "ObjectEntity" | "Entity" | "CollectionEntity";

export default class DashboardCards {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/dashboardCards");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/dashboardCards${id}`);

    return data;
  };

  public createOrDelete = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "DELETE", `/admin/dashboardCards/${id}`);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/dashboardCards", payload);
    return data;
  };
}
