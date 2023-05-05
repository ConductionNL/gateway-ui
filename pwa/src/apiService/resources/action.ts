import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";

export default class Action {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/actions");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/actions");

    return data?.map((action: any) => ({ label: action.name, value: action.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/actions/${id}`);

    return data;
  };

  public getAllHandlers = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/actionHandlers?limit=1000");

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/actions/${id}`, undefined, {
      loading: "Removing action...",
      success: "Action successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/actions/${id}`, payload, {
        loading: "Updating action...",
        success: "Action successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/actions", payload, {
      loading: "Creating action...",
      success: "Action successfully created.",
    });
    return data;
  };

  public runAction = async (variables: { payload: any; id: string }): Promise<any> => {
    const { id, payload } = variables;

    const { data } = await this._send(this._instance, "POST", `/admin/run_action/${id}`, payload, {
      loading: "Running Action...",
      success: "Action succesfully ran.",
    });

    return data;
  };
}
