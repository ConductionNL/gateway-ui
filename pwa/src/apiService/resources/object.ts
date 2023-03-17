import { AxiosInstance } from "axios";

export default class Sources {
  private _instance: AxiosInstance;
  private _send: any; // TODO: add type

  constructor(instance: AxiosInstance, send: any) {
    // TODO: add type
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (currentPage: number, limit?: number): Promise<any> => {
    const { data } = await this._send(
      this._instance,
      "GET",
      `/admin/objects?extend[]=all&page=${currentPage}${limit ? `&_limit=${limit}` : ""}`,
    );

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/objects/${id}`);

    return data;
  };

  public getAllFromEntity = async (entityId: string, currentPage: number): Promise<any> => {
    const { data } = await this._send(
      this._instance,
      "GET",
      `/admin/objects?_self.schema.id=${entityId}&page=${currentPage}&_limit=10`,
    );

    return data;
  };

  public getAllFromList = async (list: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", list);

    return data.results;
  };

  public getSchema = async (id: string): Promise<any> => {
    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return { ...config, headers: { ...config.headers, Accept: "application/json+schema" } };
    });

    const { data } = await this._send(this._instance, "GET", `admin/objects/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/objects/${id}`, undefined, {
      loading: "Removing object...",
      success: "Object successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; entityId: string; objectId?: string }): Promise<any> => {
    const { payload, entityId, objectId } = variables;

    if (objectId) {
      const { data } = await this._send(this._instance, "PUT", `/admin/objects/${objectId}`, payload, {
        loading: "Updating object...",
        success: "Object successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(
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
