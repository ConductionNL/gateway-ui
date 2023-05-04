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

    const _payload = {
      ...payload,
      entity: payload.entity && `/admin/entities/${payload.entity}`,
      // object: objectId,
      action: payload.action && `/admin/actions/${payload.action.value}`,
      gateway: payload.source && `/admin/gateways/${payload.source.value}`,
    };

    delete _payload.source;

    if (syncId) {
      const { data } = await Send(this._instance, "PUT", `/admin/synchronizations/${syncId}`, _payload, {
        loading: "Updating synchronization...",
        success: "Synchronization successfully updated.",
      });
      return data;
    }

    const { data } = await Send(this._instance, "POST", "/admin/synchronizations", _payload, {
      loading: "Creating synchronization...",
      success: "Synchronization successfully created.",
    });
    return data;
  };
}
