import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { IPaginationFilters } from "../../context/filters";

export default class Sources {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (pagination?: IPaginationFilters, limit?: number): Promise<any> => {
    const { data } = await Send(
      this._instance,
      "GET",
      `/admin/objects?extend[]=all${pagination?.objectCurrentPage ? `&page=${pagination.objectCurrentPage}` : ""}${
        limit ? `&limit=${limit}` : ""
      }`,
    );

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/objects/${id}`);

    return data;
  };

  public getAllFromEntity = async (entityId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/objects?_self.schema.id=${entityId}`);

    return data.results;
  };

  public getAllFromList = async (list: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", list);

    return data.results;
  };

  public getSchema = async (id: string): Promise<any> => {
    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/json+schema" } };
    });

    const { data } = await Send(this._instance, "GET", `admin/objects/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/objects/${id}`, undefined, {
      loading: "Removing object...",
      success: "Object successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; entityId: string; objectId?: string }): Promise<any> => {
    const { payload, entityId, objectId } = variables;

    if (objectId) {
      const { data } = await Send(this._instance, "PUT", `/admin/objects/${objectId}`, payload, {
        loading: "Updating object...",
        success: "Object successfully updated.",
      });
      return data;
    }

    const { data } = await Send(
      this._instance,
      "POST",
      "/admin/objects",
      { ...payload, _self: { schema: { id: entityId } } },
      {
        loading: "Creating object...",
        success: "Object successfully created.",
      },
    );

    return data;
  };
}
