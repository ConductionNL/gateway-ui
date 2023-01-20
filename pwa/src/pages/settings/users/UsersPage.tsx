import * as React from "react";
import { navigate } from "gatsby";

const UsersPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default UsersPage;
