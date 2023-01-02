import * as React from "react";
import { navigate } from "gatsby";

const SecurityGroupsPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default SecurityGroupsPage;
