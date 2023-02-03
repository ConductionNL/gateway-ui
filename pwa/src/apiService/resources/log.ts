import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { LogProps } from "../../context/logs";
import { filtersToQueryParams } from "../../services/filtersToQueryParams";

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getAll = async (filters: LogProps): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/monologs?_limit=15${filtersToQueryParams(filters)}`);

    return data.results;
  };

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/logs/${id}`);

    return data;
  };
}
