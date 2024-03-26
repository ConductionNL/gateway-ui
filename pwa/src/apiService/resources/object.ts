import { AxiosInstance } from "axios";
import { TSendFunction } from "../apiService";
import { TDownloadType, downloadTypes } from "../../data/downloadTypes";
export default class Sources {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (currentPage: number, order: string, limit?: number, searchQuery?: string): Promise<any> => {
    let url = `/admin/objects?extend[]=all&page=${currentPage.toString()}`;

    if (limit) {
      url += `&_limit=${limit.toString()}`;
    }
    if (searchQuery) {
      url += `&_search=${searchQuery}`;
    }
    if (order) {
      url += `&_order[_self.dateCreated]=${order}`;
    }

    const { data } = await this._send(this._instance, "GET", url);

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/objects/${id}`);

    return data;
  };

  public downloadPDF = async (variables: { id: string; name: string; type: TDownloadType }): Promise<any> => {
    const { id, type } = variables;

    const acceptType = downloadTypes.find((_type) => _type.label === type);

    const instance = this._instance;

    instance.interceptors.request.use(function (config) {
      return {
        ...config,
        headers: { ...config.headers, Accept: acceptType?.accept },
        responseType: "arraybuffer",
      };
    });

    const { data } = await this._send(this._instance, "DOWNLOAD", `admin/objects/${id}`, undefined, {
      loading: `Looking for downloadable ${type}...`,
      success: `${type}, found starting download.`,
    });

    return data;
  };

  public getAllFromEntity = async (entityId: string, currentPage: number, searchQuery?: string): Promise<any> => {
    const { data } = await this._send(
      this._instance,
      "GET",
      `/admin/objects?_self.schema.id=${entityId}&page=${currentPage}&_limit=10${
        searchQuery ? `&_search=${searchQuery}` : ""
      }`,
    );

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/objects?limit=200");

    return data?.results?.map((object: any) => ({ label: object.titel, value: object.id }));
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

    if (objectId || payload.id) {
      const { data } = await this._send(this._instance, "PATCH", `/admin/objects/${objectId ?? payload.id}`, payload, {
        loading: "Updating object...",
        success: "Object successfully updated.",
      });

      return data;
    }

    const { data } = await this._send(
      this._instance,
      "POST",
      "/admin/objects",
      { ...payload, _self: payload._self ?? { schema: { id: entityId } } },
      {
        loading: "Creating object...",
        success: "Object successfully created.",
      },
    );

    return data;
  };
}
