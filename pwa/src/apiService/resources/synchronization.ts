import { AxiosInstance } from "axios";
import { paramsToQueryParams } from "../../services/paramsToQueryParams";
import { DEFAULT_LIMIT, TSendFunction } from "../apiService";

export default class Synchroniation {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/synchronizations?limit=${DEFAULT_LIMIT}`);

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/synchronizations/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await this._send(this._instance, "DELETE", `/admin/synchronizations/${id}`);
    return data;
  };

  public createOrUpdate = async (variables: {
    payload: any;
    objectId: string;
    sourceId: string;
    syncId?: string;
  }): Promise<any> => {
    const { payload, sourceId, objectId, syncId } = variables;

    const params = {
      action: payload.action && payload.action.value,
      endpoint: payload.endpoint,
      externalId: payload.externalId,
      sourceId: sourceId,
    };

    const _payload = {
      ...payload,
      action: payload.action && `/admin/actions/${payload.action.value}`,
      sourceId: payload.source.value,
    };

    if (syncId) {
      const { data } = await this._send(this._instance, "PUT", `/admin/synchronizations/${syncId}`, _payload);
      return data;
    }

    const { data } = await this._send(
      this._instance,
      "POST",
      `/admin/object_entities/${objectId}/sync/${sourceId}${paramsToQueryParams(params, true)}`,
    );
    return data;
  };
}
