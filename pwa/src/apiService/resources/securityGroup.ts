import { AxiosInstance } from "axios";

export default class SecurityGroup {
  private _instance: AxiosInstance;
  private _send: any; // TODO: add type

  constructor(instance: AxiosInstance, send: any) {
    // TODO: add type
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/user_groups");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/user_groups/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/user_groups/${id}`, undefined, {
      loading: "Removing securityGroup...",
      success: "SecurityGroup successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/user_groups/${id}`, payload, {
        loading: "Updating securityGroup...",
        success: "SecurityGroup successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/user_groups", payload, {
      loading: "Creating securityGroup...",
      success: "SecurityGroup successfully created.",
    });
    return data;
  };
}
