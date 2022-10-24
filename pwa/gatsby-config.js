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
            pathname: "/cronjobs/[cronjobId]",
            crumbLabel: "Cronjob",
          },
          {
            pathname: "/endpoints/[endpointId]",
            crumbLabel: "Endpoint",
          },
          {
            pathname: "/datalayers",
            crumbLabel: "Data layers",
          },
          {
            pathname: "/datalayers/[dataLayerId]",
            crumbLabel: "Data layer",
          },
          {
            pathname: "/schemes/[schemeId]",
            crumbLabel: "Scheme",
          },
          {
            pathname: "/logs/[logId]",
            crumbLabel: "Log",
          },
          {
            pathname: "/plugins/[pluginId]",
            crumbLabel: "Plugin",
          },
        ],
      },
    },
  ],
};
