export const downloadAsPDF = (data: any, name: string): void => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;

  link.setAttribute("download", `${name}.pdf`);
  document.body.appendChild(link);
  link.click();
};
