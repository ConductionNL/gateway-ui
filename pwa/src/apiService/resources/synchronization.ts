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

    // const params = {
    //   action: payload.action && payload.action.value,
    //   endpoint: payload.endpoint,
    //   externalId: payload.externalId,
    //   sourceId: sourceId,
    // };

    const _payload = {
      ...payload,
      action: payload.action && `/admin/actions/${payload.action.value}`,
      sourceId: payload.source.value,
      entity: `/admin/entities/0b585fc0-e1a1-45dd-bbb7-8dd11513cee9`,
      object: `/admin/object_entities/${objectId}`,
    };

    if (syncId) {
      const { data } = await Send(this._instance, "PUT", `/admin/synchronizations/${syncId}`, _payload);
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/synchronizations", _payload);
    return data;
  };
}
// CURRENT
// endpoint:
// abc
// externalId:
// abc
// sourceId:
// 2ad619f3-832d-4113-9647-b6a329a342cf

// TARGET
// {
//   "entity": "/admin/entities/00645704-cb5a-4906-be2f-cdfc9d0a1d44", // CHECK!
//   "object": "/admin/object_entities/uuid", // CHECK
//   "action": "/admin/actions/0f25cabe-dd26-4ae9-8b64-c28f5a165e77", // CHECK!
//   "sourceId": "uuid" // CHECK!
// }
