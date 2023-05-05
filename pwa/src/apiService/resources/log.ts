import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { ILogFiltersContext, TLogChannel } from "../../context/logs";
import { filtersToQueryParams } from "../../services/filtersToQueryParams";

export const CHANNEL_LOG_LIMIT = 10;

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/monologs?_id=${id}`);

    return data.results[0];
  };

  public getAll = async (logFilters: ILogFiltersContext, currentPage: number): Promise<any> => {
    const { data } = await Send(
      this._instance,
      "GET",
      `/admin/monologs?_limit=15&_page=${currentPage}${filtersToQueryParams(logFilters)}`,
    );

    return data;
  };

  public getAllFromChannel = async (channel: TLogChannel, resourceId: string, page: number): Promise<any> => {
    const { data } = await Send(
      this._instance,
      "GET",
      `/admin/monologs?_limit=${CHANNEL_LOG_LIMIT}&_page=${page}&context.${channel}=${resourceId}`,
    );

    return data;
  };
}
