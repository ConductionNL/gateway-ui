import * as React from "react";
import { navigate } from "gatsby";

const UserGroupsPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default UserGroupsPage;
