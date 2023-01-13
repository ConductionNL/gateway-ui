export const getPath = (value: any): any => {
  switch (value) {
    case "App\\Entity\\Action":
      return "actions";

    case "App\\Entity\\Gateway":
      return "sources";

    case "App\\Entity\\Cronjob":
      return "cronjobs";

    case "App\\Entity\\Endpoint":
      return "endpoints";

    case "App\\Entity\\ObjectEntity":
      return "objects";

    case "App\\Entity\\Entity":
      return "schemas";

    case "App\\Entity\\Log":
      return "logs";

    case "App\\Entity\\Plugin":
      return "plugins";

    case "App\\Entity\\CollectionEntity":
      return "collections";

    case "App\\Entity\\Organization":
      return "settings/organizations";

    case "App\\Entity\\User":
      return "settings/users";
  }
};
