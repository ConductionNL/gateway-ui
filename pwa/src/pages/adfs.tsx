import { navigate } from "gatsby";
import * as React from "react";

const AdfsPage: React.FC = () => {
  const fullURL = new URL(typeof window !== "undefined" ? window.location.href : "localhost:8000");
  fullURL.port = "";

  const url = fullURL.toString();

  navigate(`http://localhost/login/oidc/dex`);

  return <></>;
};

export default AdfsPage;
