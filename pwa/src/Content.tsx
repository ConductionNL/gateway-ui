import * as React from "react";
import * as styles from "./Content.module.css";
import { Container } from "@conduction/components";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import {
  Divider,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Tab,
  TabContext,
  TabPanel,
  Tabs,
} from "@gemeente-denhaag/components-react";
import clsx from "clsx";

interface ContentProps {
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<"pip" | "website" | "dashboard">("pip");
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [content, setContent] = React.useState<any>(templateDetails["pip"]);

  React.useEffect(() => {
    setContent(templateDetails[selectedTemplate]);
  }, [selectedTemplate]);

  return (
    <Container>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <Heading1>Welcome to the Skeleton Application</Heading1>

          <Link target="_blank" href="https://conduction.nl" icon={<ArrowRightIcon />} iconAlign="start">
            Created by Conduction
          </Link>
        </div>

        <Divider />

        <div className={styles.textContainer}>
          <Heading2>Step one: pick your template</Heading2>

          <span>
            The Skeleton Application comes with three out-of-the-box templates: PIP, Website and Dashboard. Each with
            its own functionalities, such as: authentication, shielded pages and components, layouts as headers and
            footers and much more. Every template has fully built-in NL-Design support.
          </span>

          <span>Select one of the templates below for more information.</span>
        </div>

        <div className={styles.templatesGrid}>
          <div
            className={clsx(styles.templateCard, selectedTemplate === "pip" && styles.active)}
            onClick={() => setSelectedTemplate("pip")}
          >
            <Heading3>PIP</Heading3>

            <span>
              Out-of-the-box authentication, gateway support, NL Design support, multiple navigations and much more.
            </span>
          </div>

          <div
            className={clsx(styles.templateCard, selectedTemplate === "website" && styles.active)}
            onClick={() => setSelectedTemplate("website")}
          >
            <Heading3>Website</Heading3>

            <span>
              A simple website skeleton, including headers, footers, routing and more. Does not initiate authentication.
            </span>
          </div>

          <div
            className={clsx(
              styles.templateCard,
              styles.templateCardDashboard,
              selectedTemplate === "dashboard" && styles.active,
            )}
          >
            <Heading3>Dashboard</Heading3>

            <span>Coming soon.</span>
          </div>
        </div>

        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
          >
            <Tab label="Introduction" value={0} />
            <Tab label="Local installation guide" value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <div className={styles.tabHeading}>
              <Heading3>{content.introduction.title}</Heading3>

              {content.introduction.linkToLive && (
                <Link
                  target="_blank"
                  href={content.introduction.linkToLive.href}
                  icon={<ArrowRightIcon />}
                  iconAlign="start"
                >
                  {content.introduction.linkToLive.label}
                </Link>
              )}
            </div>

            <span>{content.introduction.content}</span>

            <span>
              For more information, you can{" "}
              <Link
                target="_blank"
                href="https://github.com/ConductionNL/skeleton-app/tree/development"
                icon={<ArrowRightIcon />}
                iconAlign="start"
              >
                Check out the Skeleton Application documentation
              </Link>
            </span>
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            <Heading3>{content.installation.title}</Heading3>

            <span>{content.installation.content}</span>

            <span>
              For more information, you can{" "}
              <Link
                target="_blank"
                href="https://github.com/ConductionNL/skeleton-app/tree/development"
                icon={<ArrowRightIcon />}
                iconAlign="start"
              >
                Check out the Skeleton Application documentation
              </Link>
            </span>
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

/**
 * Component: Installation Steps
 */
interface InstallationStepsProps {
  commandMacOS: JSX.Element;
  commandWindows: JSX.Element;
}

const InstallationSteps: React.FC<InstallationStepsProps> = ({ commandMacOS, commandWindows }) => {
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  return (
    <div>
      <ol className={styles.list}>
        <li>
          <span>Navigate to the source folder of this project</span>
        </li>

        <li>
          <span>Run the following command</span>
          <TabContext value={currentTab.toString()}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue: number) => {
                setCurrentTab(newValue);
              }}
              className={styles.installationTabs}
            >
              <Tab label="MacOS (using rsync)" value={0} />
              <Tab label="Powershell (using robocopy)" value={1} />
            </Tabs>

            <TabPanel className={styles.tabPanel} value="0">
              <span className={styles.code}>$ {commandMacOS}</span>
            </TabPanel>

            <TabPanel className={styles.tabPanel} value="1">
              <span className={styles.code}>$ {commandWindows}</span>
            </TabPanel>
          </TabContext>
        </li>

        <li>
          <span>Restart the development server!</span>
        </li>
      </ol>
    </div>
  );
};

/**
 * Data: Template details
 */
const templateDetails: any = {
  ["pip"]: {
    introduction: {
      title: "PIP Template",
      linkToLive: {
        label: "Live PIP implementation",
        href: "https://mijn.commonground.nu",
      },
      content: (
        <span>
          Out-of-the-box authentication, gateway support, NL Design support, multiple navigations and much more.
        </span>
      ),
    },
    installation: {
      title: "Getting started",
      content: (
        <InstallationSteps
          commandMacOS={
            <>
              cp pwa/src/skeleton-implementations/pip/Content.tsx pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/pip/layout pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/pip/pages pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/pip/templates pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/pip/templates/templateParts pwa/src/templates/ && <br />
              rm -rf pwa/src/skeleton-implementations && <br />
              rm pwa/src/Content.module.css
            </>
          }
          commandWindows={
            <>
              cp pwa/src/skeleton-implementations/pip/Content.tsx pwa/src/ ; <br />
              Robocopy /S pwa/src/skeleton-implementations/pip/layout pwa/src/layout ; <br />
              Robocopy /S pwa/src/skeleton-implementations/pip/pages pwa/src/pages ; <br />
              Robocopy /S pwa/src/skeleton-implementations/pip/templates pwa/src/templates ; <br />
              Robocopy /S pwa/src/skeleton-implementations/pip/templates/templateParts pwa/src/templates/templateParts ;{" "}
              <br />
              rmdir pwa/src/skeleton-implementations ; <br />
              del pwa/src/Content.module.css ;
            </>
          }
        />
      ),
    },
  },
  ["website"]: {
    introduction: {
      title: "Website Template",
      linkToLive: {
        label: "Live Website implementation",
        href: "https://opencatalogi.nl",
      },
      content: (
        <span>
          A simple website skeleton, including headers, footers, routing and more. Does not initiate authentication.
        </span>
      ),
    },
    installation: {
      title: "Getting started",
      content: (
        <InstallationSteps
          commandMacOS={
            <>
              rm -rf pwa/src/pages/callbacks && <br />
              rm pwa/src/pages/login.tsx && <br />
              rm pwa/src/pages/logout.tsx && <br />
              cp pwa/src/skeleton-implementations/website/Content.tsx pwa/src/ && <br />
              cp pwa/src/skeleton-implementations/website/Content.module.css pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/website/pages pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/website/templates pwa/src/ && <br />
              rsync -r pwa/src/skeleton-implementations/website/templates/templateParts pwa/src/templates/ && <br />
              rm -rf pwa/src/skeleton-implementations
            </>
          }
          commandWindows={
            <>
              rmdir pwa/src/pages/callbacks ; <br />
              del pwa/src/pages/login.tsx ; <br />
              del pwa/src/pages/logout.tsx ; <br />
              cp pwa/src/skeleton-implementations/website/Content.tsx pwa/src/ ; <br />
              cp pwa/src/skeleton-implementations/website/Content.module.css pwa/src/ ; <br />
              Robocopy /S pwa/src/skeleton-implementations/website/pages pwa/src/pages ; <br />
              Robocopy /S pwa/src/skeleton-implementations/website/templates pwa/src/templates ; <br />
              Robocopy /S pwa/src/skeleton-implementations/website/templates/templateParts
              pwa/src/templates/templateParts ; <br />
              rmdir pwa/src/skeleton-implementations ;
            </>
          }
        />
      ),
    },
  },
};
