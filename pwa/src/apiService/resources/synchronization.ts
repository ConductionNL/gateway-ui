import { AxiosInstance } from "axios";
import { paramsToQueryParams } from "../../services/paramsToQueryParams";
import { TSendFunction } from "../apiService";

export default class Synchroniation {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getAll = async (): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", "/admin/synchronizations");

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

  public createOrUpdate = async (variables: { payload: any; objectId: string; syncId?: string }): Promise<any> => {
    const { payload, objectId, syncId } = variables;

    const _payload = {
      ...payload,
      entity: payload.entity && `/admin/entities/${payload.entity}`,
      object: objectId,
      action: payload.action && `/admin/actions/${payload.action.value}`,
      gateway: payload.source && `/admin/gateways/${payload.source.value}`,
    };

    delete _payload.source;

    if (syncId) {
      const { data } = await this._send(this._instance, "PUT", `/admin/synchronizations/${syncId}`, _payload, {
        loading: "Updating synchronization...",
        success: "Synchronization successfully updated.",
      });
      return data;
    }

    const { data } = await this._send(this._instance, "POST", "/admin/synchronizations", _payload, {
      loading: "Creating synchronization...",
      success: "Synchronization successfully created.",
    });
    return data;
  };
}
