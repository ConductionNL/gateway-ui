import * as React from "react";
import * as styles from "./PluginCard.module.css";
import { Link, Paragraph } from "@gemeente-denhaag/components-react";
import { navigate } from "gatsby";
import _ from "lodash";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useTranslation } from "react-i18next";
import { Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHubLogo } from "../../assets/svgs/GitHub";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { PackagistLogo } from "../../assets/svgs/Packagist";

export interface PluginCardProps {
  title: {
    label: string;
    href: string;
  };
  description: string;
  packagistUrl: string;
  repositoryUrl: string;
  downloads: string;
  favers: string;
}

export const PluginCard: React.FC<PluginCardProps> = ({
  title,
  description,
  packagistUrl,
  repositoryUrl,
  downloads,
  favers,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.titleLink} onClick={() => navigate(title.href)}>
        <Link icon={<ArrowRightIcon />} iconAlign="start">
          {title.label}
        </Link>
      </div>

      <Paragraph className={styles.description}>{description}</Paragraph>

      <div className={styles.tags}>
        {packagistUrl && (
          <ToolTip tooltip="Packagist">
            <Tag
              layoutClassName={styles.svgLogo}
              label={t("Packagist")}
              icon={<PackagistLogo />}
              onClick={() => open(packagistUrl)}
            />
          </ToolTip>
        )}

        {repositoryUrl && (
          <ToolTip tooltip="GitHub">
            <Tag
              layoutClassName={styles.svgLogo}
              label={t("Repository")}
              icon={<GitHubLogo />}
              onClick={() => open(repositoryUrl)}
            />
          </ToolTip>
        )}

        <ToolTip tooltip="Aantal downloads">
          <Tag label={downloads ?? 0} icon={<FontAwesomeIcon icon={faDownload} />} />
        </ToolTip>

        <ToolTip tooltip="Aantal favers">
          <Tag label={favers ?? 0} icon={<FontAwesomeIcon icon={faDownload} />} />
        </ToolTip>
      </div>
    </div>
  );
};
