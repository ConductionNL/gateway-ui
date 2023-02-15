import * as React from "react";
import * as styles from "./Layout.module.css";
import "../translations/i18n";
import APIContext, { APIProvider } from "../apiService/apiContext";
import APIService from "../apiService/apiService";
import { TScreenSize, useGatsbyContext } from "../context/gatsby";
import { StylesProvider } from "@gemeente-denhaag/components-react";
import { Head } from "./Head";
import { Content } from "../Content";
import { ThemeProvider } from "../templates/themeProvider/ThemeProvider";
import { getScreenSize } from "../services/getScreenSize";
import { Toaster } from "react-hot-toast";
import { defaultGlobalContext, GlobalProvider, IGlobalContext } from "../context/global";
import { isLoggedIn } from "../services/auth";

interface LayoutProps {
  children: React.ReactNode;
  pageContext: any; // Gatsby pageContext
  location: any; // Gatsby location
}

const Layout: React.FC<LayoutProps> = ({ children, pageContext, location }) => {
  const [API, setAPI] = React.useState<APIService>(React.useContext(APIContext));
  const [screenSize, setScreenSize] = React.useState<TScreenSize>("mobile");
  const [globalContext, setGlobalContext] = React.useState<IGlobalContext>(defaultGlobalContext);

  React.useEffect(() => {
    setAPI(new APIService());
  }, []);

  React.useEffect(() => {
    if (isLoggedIn()) {
      setGlobalContext((context) => ({
        ...context,
        gatsby: {
          ...{ pageContext, location, screenSize: getScreenSize(window.innerWidth), previousPath: location.pathname },
        },
      }));
    }

    const JWT = sessionStorage.getItem("JWT");

    !API.authenticated && JWT && API.setAuthentication(JWT);
  }, [pageContext, location, screenSize]);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    window.addEventListener("resize", handleWindowResize);

    () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <>
      <Head crumbs={pageContext.breadcrumb?.crumbs} />

      <GlobalProvider value={[globalContext, setGlobalContext]}>
        <APIProvider value={API}>
          <StylesProvider>
            <Toaster position="bottom-right" />

            <ThemeProvider>
              <div className={styles.container}>
                <Content {...{ children }} />
              </div>
            </ThemeProvider>
          </StylesProvider>
        </APIProvider>
      </GlobalProvider>
    </>
  );
};

export default Layout;
