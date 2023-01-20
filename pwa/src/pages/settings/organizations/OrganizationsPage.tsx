import * as React from "react";
import { navigate } from "gatsby";

const OrganizationsPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default OrganizationsPage;
