import { AxiosInstance, AxiosResponse } from "axios";

type IUser = {
  username: string;
  password: string;
};

export default class Login {
  private _instance: AxiosInstance;

  constructor(_instance: AxiosInstance) {
    this._instance = _instance;
  }

  public login = (data: IUser): Promise<AxiosResponse> => {
    return this._instance.post("/users/login", JSON.stringify(data));
  };

  public renewToken = (): Promise<AxiosResponse> => {
    return this._instance.get("/users/reset_token", { withCredentials: true });
  };

  public logout = (): Promise<AxiosResponse> => {
    return this._instance.post("/users/logout");
  };
}
