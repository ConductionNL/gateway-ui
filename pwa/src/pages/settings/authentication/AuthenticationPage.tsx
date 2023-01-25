import * as React from "react";
import { navigate } from "gatsby";

const AuthenticationPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default AuthenticationPage;
