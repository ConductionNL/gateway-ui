import * as React from "react";
import { navigate } from "gatsby";

const DatabasesPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default DatabasesPage;
