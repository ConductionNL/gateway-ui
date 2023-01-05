import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { paramsToQueryParams } from "../../services/paramsToQueryParams";

export default class Synchroniation {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await Send(this._instance, "GET", "/admin/synchronizations");

    return data;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/synchronizations/${id}`);

    return data;
  };

  public delete = async (variables: { id: string }): Promise<any> => {
    const { id } = variables;

    const { data } = await Send(this._instance, "DELETE", `/admin/synchronizations/${id}`);
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
      const { data } = await Send(this._instance, "PUT", `/admin/synchronizations/${syncId}`, _payload);
      return data;
    }

    const { data } = await Send(
      this._instance,
      "POST",
      `/admin/object_entities/${objectId}/sync/${sourceId}${paramsToQueryParams(params, true)}`,
    );
    return data;
  };
}
