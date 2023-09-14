import { TDownloadType } from "../data/downloadTypes";

export const downloadAsExtention = (data: any, name: string, type: TDownloadType): void => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;

  link.setAttribute("download", `${name}.${type.toLowerCase()}`);
  document.body.appendChild(link);
  link.click();
};
