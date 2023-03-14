import * as React from "react";
import { navigate } from "gatsby";
import { useAuthentication } from "../hooks/useAuthentication";

const Logout: React.FC = () => {
  const { handleLogout } = useAuthentication();

  React.useEffect(() => {
    handleLogout();
    navigate("/");
  });

  return <></>;
};

export default Logout;
