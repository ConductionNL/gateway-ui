require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/layout/Layout.tsx`),
      },
    },
    {
      resolve: `gatsby-plugin-breadcrumb`,
      options: {
        useAutoGen: true,
        exclude: [
          `**/dev-404-page/**`,
          `**/404/**`,
          `**/404.html`,
          `**/offline-plugin-app-shell-fallback/**`,
        ],
        excludeOptions: {
          separator: ".",
        },
        autoGenHomeLabel: "Dashboard",
        crumbLabelUpdates: [
          {
            pathname: "/actions/[actionId]",
            crumbLabel: "Action",
          },
          {
            pathname: "/sources/[sourceId]",
            crumbLabel: "Source",
          },
          {
            pathname: "/sources/[sourceId]/[calllogId]",
            crumbLabel: "CallLog",
          },
          {
            pathname: "/cronjobs/[cronjobId]",
            crumbLabel: "Cronjob",
          },
          {
            pathname: "/endpoints/[endpointId]",
            crumbLabel: "Endpoint",
          },
          {
            pathname: "/objects",
            crumbLabel: "Objects",
          },
          {
            pathname: "/objects/[objectId]",
            crumbLabel: "Object",
          },
          {
            pathname: "/schemes/[schemeId]",
            crumbLabel: "Schema",
          },
          {
            pathname: "/logs/[logId]",
            crumbLabel: "Log",
          },
          {
            pathname: "/plugins/[pluginId]",
            crumbLabel: "Plugin",
          },
          {
            pathname: "/collections/[collectionId]",
            crumbLabel: "collection",
          },
        ],
      },
    },
  ],
};
