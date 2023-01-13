export const getPath = (value: any): any => {
  switch (value) {
    case "Action":
      return "actions";
    case "action":
      return "actions";

    case "Source":
      return "sources";
    case "source":
      return "sources";

    case "Cronjob":
      return "cronjobs";
    case "cronjob":
      return "cronjobs";

    case "Endpoint":
      return "endpoints";
    case "endpoint":
      return "endpoints";

    case "Object":
      return "objects";
    case "object":
      return "objects";

    case "Schema":
      return "schemas";
    case "schema":
      return "schemas";

    case "Log":
      return "logs";
    case "log":
      return "logs";

    case "Plugin":
      return "plugins";
    case "plugin":
      return "plugins";

    case "Collection":
      return "collections";
    case "collection":
      return "collections";
  }
};
