export type TDownloadType = "PDF" | "CSV" | "XLSX" | "JSON";

export const downloadTypes = [
  { label: "PDF", value: "pdf", accept: "application/pdf" },
  { label: "CSV", value: "csv", accept: "text/csv" },
  { label: "XLSX", value: "xlsx", accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { label: "JSON", value: "json", accept: "application/json+schema" },
];
