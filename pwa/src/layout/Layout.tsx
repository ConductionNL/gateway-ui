import * as React from "react";
import * as styles from "./Layout.module.css";
import "../translations/i18n";
import APIContext, { APIProvider } from "../apiService/apiContext";
import APIService from "../apiService/apiService";
import { TScreenSize } from "../context/gatsby";
import { StylesProvider } from "@gemeente-denhaag/components-react";
import { Head } from "./Head";
import { Content } from "../Content";
import { ThemeProvider } from "../templates/themeProvider/ThemeProvider";
import Favicon from "react-favicon";
import Logo from "../assets/svgs/conduction-logo.svg";
import { TabsProvider, ITabs, tabs as _tabs } from "../context/tabs";
import { getScreenSize } from "../services/getScreenSize";
import { Toaster } from "react-hot-toast";
import { LogFiltersProvider, LogProps, logFilters as _logFilters } from "../context/logs";
import { defaultGlobalContext, GlobalProvider, IGlobalContext } from "../context/global";

interface LayoutProps {
  children: React.ReactNode;
  pageContext: any; // Gatsby pageContext
  location: any; // Gatsby location
}

const Layout: React.FC<LayoutProps> = ({ children, pageContext, location }) => {
  const [API, setAPI] = React.useState<APIService>(React.useContext(APIContext));
  const [screenSize, setScreenSize] = React.useState<TScreenSize>("mobile");
  const [tabs, setTabs] = React.useState<ITabs>(_tabs);
  const [logFilters, setLogFilters] = React.useState<LogProps>(_logFilters);

  const [globalContext, setGlobalContext] = React.useState<IGlobalContext>({
    ...defaultGlobalContext,
    gatsby: { ...{ pageContext, location, screenSize: "mobile" } },
  });

  React.useEffect(() => {
    setAPI(new APIService());
  }, []);

  React.useEffect(() => {
    setGlobalContext((context) => ({
      ...context,
      gatsby: { ...{ pageContext, location, screenSize: getScreenSize(window.innerWidth) } },
    }));

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
            <LogFiltersProvider value={[logFilters, setLogFilters]}>
              <TabsProvider value={[tabs, setTabs]}>
                <ThemeProvider>
                  <Favicon url={Logo} />

                  <div className={styles.container}>
                    <Content {...{ children }} />
                  </div>
                </ThemeProvider>
              </TabsProvider>
            </LogFiltersProvider>
          </StylesProvider>
        </APIProvider>
      </GlobalProvider>
    </>
  );
};

export default Layout;
