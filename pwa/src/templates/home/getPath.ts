type TgetPath =
  | "Action"
  | "Gateway"
  | "Cronjob"
  | "Endpoint"
  | "ObjectEntity"
  | "Entity"
  | "Log"
  | "Plugin"
  | "CollectionEntity";

export const getPath = (path: TgetPath): string => {
  switch (path) {
    case "Action":
      return "actions";

    case "Gateway":
      return "sources";

    case "Cronjob":
      return "cronjobs";

    case "Endpoint":
      return "endpoints";

    case "ObjectEntity":
      return "objects";

    case "Entity":
      return "schemas";

    case "Log":
      return "logs";

    case "Plugin":
      return "plugins";

    case "CollectionEntity":
      return "collections";
  }
};
