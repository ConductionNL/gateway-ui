import * as React from "react";
import * as styles from "./Layout.module.css";
import "../translations/i18n";
import APIContext, { APIProvider } from "../apiService/apiContext";
import APIService from "../apiService/apiService";
import { GatsbyProvider, IGatsbyContext, TScreenSize } from "../context/gatsby";
import { StylesProvider } from "@gemeente-denhaag/components-react";
import { Head } from "./Head";
import { Content } from "../Content";
import { ThemeProvider } from "../templates/themeProvider/ThemeProvider";
import Favicon from "react-favicon";
import Logo from "../assets/svgs/conduction-logo.svg";
import { TabsProvider, ITabs, tabs as _tabs } from "../context/tabs";
import { getScreenSize } from "../services/getScreenSize";

interface LayoutProps {
  children: React.ReactNode;
  pageContext: any; // Gatsby pageContext
  location: any; // Gatsby location
}

const Layout: React.FC<LayoutProps> = ({ children, pageContext, location }) => {
  const [API, setAPI] = React.useState<APIService>(React.useContext(APIContext));
  const [gatsbyContext, setGatsbyContext] = React.useState<IGatsbyContext>({
    ...{ pageContext, location, screenSize: "mobile" },
  });
  const [screenSize, setScreenSize] = React.useState<TScreenSize>("mobile");
  const [tabs, setTabs] = React.useState<ITabs>(_tabs);

  React.useEffect(() => {
    setAPI(new APIService());
  }, []);

  React.useEffect(() => {
    setGatsbyContext({ ...{ pageContext, location, screenSize: getScreenSize(window.innerWidth) } });

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

      <GatsbyProvider value={gatsbyContext}>
        <APIProvider value={API}>
          <StylesProvider>
            <TabsProvider value={[tabs, setTabs]}>
              <ThemeProvider>
                <Favicon url={Logo} />

                <div className={styles.container}>
                  <Content {...{ children }} />
                </div>
              </ThemeProvider>
            </TabsProvider>
          </StylesProvider>
        </APIProvider>
      </GatsbyProvider>
    </>
  );
};

export default Layout;
