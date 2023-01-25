import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class SecurityGroup {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/user_groups");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/user_groups/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/user_groups/${id}`, undefined, {
      loading: "Removing securityGroup...",
      success: "SecurityGroup successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/user_groups/${id}`, payload, {
        loading: "Updating securityGroup...",
        success: "SecurityGroup successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/user_groups", payload, {
      loading: "Creating securityGroup...",
      success: "SecurityGroup successfully created.",
    });
    return data;
  };
}
