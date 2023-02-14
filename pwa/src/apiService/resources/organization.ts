import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Organization {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/organisations");

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/organisations?limit=200");

    return data?.map((organization: any) => ({ label: organization.name, value: organization.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/organisations/${id}`);

    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await Send(this._instance, "PUT", `/admin/organisations/${id}`, payload, {
        loading: "Updating organization...",
        success: "Organization successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/organisations", payload, {
      loading: "Creating organization...",
      success: "Organization successfully created.",
    });
    return data;
  };
}
