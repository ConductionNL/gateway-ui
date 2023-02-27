import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Action {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/actions");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/actions");

    return data?.map((action: any) => ({ label: action.name, value: action.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/actions/${id}`);

    return data;
  };

  public getAllHandlers = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/actionHandlers?limit=1000");

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/actions/${id}`, undefined, {
      loading: "Removing action...",
      success: "Action successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/actions/${id}`, payload, {
        loading: "Updating action...",
        success: "Action successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/actions", payload, {
      loading: "Creating action...",
      success: "Action successfully created.",
    });
    return data;
  };

  public runAction = async (variables: { payload: any; id: string }): Promise<any> => {
    const { id, payload } = variables;

    const { data } = await Send(this._instance, "POST", `/admin/run_action/${id}`, payload, {
      loading: "Running Action...",
      success: "Action succesfully ran.",
    });

    return data;
  };
}
