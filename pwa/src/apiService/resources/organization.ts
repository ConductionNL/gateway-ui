import { AxiosInstance } from "axios";

export default class Organization {
  private _instance: AxiosInstance;
  private _send: any; // TODO: add type

  constructor(instance: AxiosInstance, send: any) {
    // TODO: add type
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/organisations");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/organisations?limit=200");

    return data?.map((organization: any) => ({ label: organization.name, value: organization.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/organisations/${id}`);

    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/organisations/${id}`, payload, {
        loading: "Updating organization...",
        success: "Organization successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/organisations", payload, {
      loading: "Creating organization...",
      success: "Organization successfully created.",
    });
    return data;
  };
}
