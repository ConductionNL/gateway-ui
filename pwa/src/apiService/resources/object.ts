import { Send } from "../apiService";
import { AxiosInstance } from "axios";

export default class Sources {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (currentPage: number, order: string, limit?: number, searchQuery?: string): Promise<any> => {
    const url = new URL("/admin/objects", "http://localhost"); // localhost is overwritten by the service, ignore it

    url.searchParams.append("extend[]", "all");
    url.searchParams.append("page", currentPage.toString());

    limit && url.searchParams.append("_limit", limit.toString());
    searchQuery && url.searchParams.append("_search", searchQuery);
    order && url.searchParams.append("_order[_self.dateCreated]", order);

    console.log(url.toString());

    const { data } = await Send(this._instance, "GET", url.toString());

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/objects/${id}`);

    return data;
  };

  public getAllFromEntity = async (entityId: string, currentPage: number, searchQuery?: string): Promise<any> => {
    const { data } = await Send(
      this._instance,
      "GET",
      `/admin/objects?_self.schema.id=${entityId}&page=${currentPage}&_limit=10${
        searchQuery ? `&_search=${searchQuery}` : ""
      }`,
    );

    return data;
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
