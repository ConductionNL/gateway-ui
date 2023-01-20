import * as React from "react";
import { navigate } from "gatsby";

const ApplicationsPage: React.FC = () => {
  React.useEffect(() => {
    navigate("/settings");
  });

  return <></>;
};

export default ApplicationsPage;
