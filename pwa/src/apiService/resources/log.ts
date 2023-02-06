import { Send } from "../apiService";
import { AxiosInstance } from "axios";
import { LogProps, TLogChannel } from "../../context/logs";
import { filtersToQueryParams } from "../../services/filtersToQueryParams";
import { IPaginationFilters } from "../../context/filters";

export default class Log {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public getOne = async (id: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/monologs?_id=${id}`);

    return data.results[0];
  };

  public getAll = async (logFilters: LogProps, paginationFilters: IPaginationFilters): Promise<any> => {
    const { data } = await Send(
      this._instance,
      "GET",
      `/admin/monologs?_limit=15&_page=${paginationFilters.logCurrentPage}${filtersToQueryParams(logFilters)}`,
    );

    return data;
  };

  public getAllFromChannel = async (channel: TLogChannel, resourceId: string): Promise<any> => {
    const { data } = await Send(this._instance, "GET", `/admin/monologs?_limit=10&context.${channel}=${resourceId}`);

    return data;
  };
}
