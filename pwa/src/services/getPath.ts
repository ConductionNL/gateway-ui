export const getPath = (value: any): any => {
  const pathValue = value.toLowerCase();

  switch (pathValue) {
    case "action":
      return "actions";

    case "source":
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

    case "Organization":
      return "settings/organizations";

    case "User":
      return "settings/users";

    case "Authentication":
      return "settings/authentication";
  }
};
