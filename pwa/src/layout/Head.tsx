import * as React from "react";
import _ from "lodash";
import "../styling/index.css";
import { Helmet } from "react-helmet";

interface HeadProps {
  crumbs: any[];
}

export const Head: React.FC<HeadProps> = ({ crumbs }) => {
  const title = crumbs && _.capitalize(_.last(crumbs).crumbLabel);

  return (
    <Helmet>
      <title>{`Common Gateway | ${title ?? "Error"}`}</title>
      <script src="/env.js"></script>
    </Helmet>
  );
};
