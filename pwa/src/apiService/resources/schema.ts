import { AxiosInstance } from "axios";
import { DEFAULT_LIMIT, TSendFunction } from "../apiService";
import { TDownloadType, downloadTypes } from "../../data/downloadTypes";

export default class Schema {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/entities?limit=${DEFAULT_LIMIT}`);

    return data;
  };

  public getAllSelectOptions = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/entities?limit=${DEFAULT_LIMIT}`);

    return data?.map((schema: any) => ({ label: schema.name, value: schema.id }));
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/entities/${id}`);

    return data;
  };

  public getSchema = async (id: string): Promise<any> => {
    const instance = this._instance;

    instance.interceptors.request.use(function (config: any) {
      return { ...config, headers: { ...config.headers, Accept: "application/json+schema" } };
    });

    const { data } = await this._send(this._instance, "GET", `admin/entities/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/entities/${id}`, undefined, {
      loading: "Removing schema...",
      success: "Schema successfully removed.",
    });
    return data;
  };

  public createOrUpdate = async (variables: { payload: any; id?: string }): Promise<any> => {
    const { payload, id } = variables;

    if (id) {
      const { data } = await this._send(this._instance, "PUT", `/admin/entities/${id}`, payload, {
        loading: "Updating schema...",
        success: "Schema successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/entities", payload, {
      loading: "Creating schema...",
      success: "Schema successfully created.",
    });
    return data;
  };

  public downloadSchema = async (variables: { id: string; name: string; type: TDownloadType }): Promise<any> => {
    const { id, type } = variables;

    const acceptType = downloadTypes.find((_type) => _type.label === type);

    const instance = this._instance;

    instance.interceptors.request.use(function (config: any) {
      return {
        ...config,
        headers: { ...config.headers, Accept: acceptType?.accept },
        responseType: "arraybuffer",
      };
    });

    const { data } = await this._send(this._instance, "DOWNLOAD", `/admin/entities/${id}`, undefined, {
      loading: `Looking for downloadable ${type}...`,
      success: `${type}, found starting download.`,
    });

    return data;
  };

  public downloadObjects = async (variables: { id: string; name: string; type: TDownloadType }): Promise<any> => {
    const { id, type } = variables;

    const acceptType = downloadTypes.find((_type) => _type.label === type);

    const instance = this._instance;

    instance.interceptors.request.use(function (config: any) {
      return {
        ...config,
        headers: { ...config.headers, Accept: acceptType?.accept },
        responseType: "arraybuffer",
      };
    });

    const { data } = await this._send(this._instance, "DOWNLOAD", `/admin/objects?_self.schema.id=${id}`, undefined, {
      loading: `Looking for downloadable ${type}...`,
      success: `${type}, found starting download.`,
    });

    return data;
  };
}
