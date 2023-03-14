import * as React from "react";
import { navigate } from "gatsby";
import APIContext from "../apiService/apiContext";
import APIService from "../apiService/apiService";
import { useAuthentication } from "../hooks/useAuthentication";

const Logout: React.FC = () => {
  const { handleLogout } = useAuthentication();
  const API: APIService | null = React.useContext(APIContext);

  React.useEffect(() => {
    API && handleLogout(API);
    navigate("/");
  });

  return <></>;
};

export default Logout;
