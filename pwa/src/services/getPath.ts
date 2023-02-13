export const getPath = (value: any): any => {
  const pathValue = value.toLowerCase();

  switch (pathValue) {
    case "action":
      return "actions";

    case "source":
      return "sources";

    case "gateway":
      return "sources";

    case "cronjob":
      return "cronjobs";

    case "endpoint":
      return "endpoints";

    case "object":
      return "objects";

    case "schema":
      return "schemas";

    case "log":
      return "logs";

    case "plugin":
      return "plugins";

    case "collection":
      return "collections";

    case "organization":
      return "settings/organizations";

    case "user":
      return "settings/users";

    case "authentication provider":
      return "settings/authentication";

    case "mapping":
      return "mappings";
  }
};
