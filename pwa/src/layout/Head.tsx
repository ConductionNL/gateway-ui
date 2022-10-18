import * as React from "react";
import _ from "lodash";
import "../styling/index.css";
import { Helmet } from "react-helmet";

interface HeadProps {
  crumbs: any[];
}

export const Head: React.FC<HeadProps> = ({ crumbs }) => {
  return (
    <Helmet>
      <title>{`Common Gateway | ${crumbs && _.capitalize(_.last(crumbs).crumbLabel)}`}</title>
      <script src="/env.js"></script>
    </Helmet>
  );
};
