import { AxiosInstance } from "axios";
import { ILogFiltersContext, TLogChannel } from "../../context/logs";
import { filtersToQueryParams } from "../../services/filtersToQueryParams";
import { TSendFunction } from "../apiService";

export default class Log {
  private _instance: AxiosInstance;
  private _send: TSendFunction;

  constructor(instance: AxiosInstance, send: TSendFunction) {
    this._instance = instance;
    this._send = send;
  }

  public getOne = async (id: string): Promise<any> => {
    const { data } = await this._send(this._instance, "GET", `/admin/monologs?_id=${id}`);

    return data.results[0];
  };

  public getAll = async (logFilters: ILogFiltersContext, currentPage: number): Promise<any> => {
    const { data } = await this._send(
      this._instance,
      "GET",
      `/admin/monologs?_limit=15&_page=${currentPage}${filtersToQueryParams(logFilters)}`,
    );

    return data;
  };

  public getAllFromChannel = async (channel: TLogChannel, resourceId: string, page: number): Promise<any> => {
    const { data } = await this._send(
      this._instance,
      "GET",
      `/admin/monologs?_limit=10&_page=${page}&context.${channel}=${resourceId}`,
    );

    return data;
  };
}
