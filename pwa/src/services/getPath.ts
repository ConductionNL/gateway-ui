export const getPath = (value: any): any => {
  switch (value) {
    case "Action":
      return "actions";

    case "Gateway":
      return "sources";

    case "Cronjob":
      return "cronjobs";

    case "Endpoint":
      return "endpoints";

    case "Object Entity":
      return "objects";

    case "Entity":
      return "schemes";

    case "Log":
      return "logs";

    case "Plugin":
      return "plugins";

    case "Collection":
      return "collections";
  }
};
