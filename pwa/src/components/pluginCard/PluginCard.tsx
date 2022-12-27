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
import {
  faArrowsRotate,
  faCheckCircle,
  faCircleDown,
  faDownload,
  faHouse,
  faScroll,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
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
  license: string;
  homepageUrl: string;
  installed: boolean;
  update: boolean;
}

export const PluginCard: React.FC<PluginCardProps> = ({
  title,
  description,
  packagistUrl,
  repositoryUrl,
  downloads,
  favers,
  license,
  homepageUrl,
  installed,
  update,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleLink} onClick={() => navigate(title.href)}>
          <Link icon={<ArrowRightIcon />} iconAlign="start">
            {title.label}
          </Link>
        </div>
        {installed === false && (
          <div>
            <FontAwesomeIcon icon={faCircleDown} /> <span>Install</span>
          </div>
        )}
        {installed && update && (
          <div>
            <FontAwesomeIcon className={styles.updateIcon} icon={faArrowsRotate} /> <span>Update</span>
          </div>
        )}
        {installed && update === false && (
          <div>
            <FontAwesomeIcon className={styles.upToDateIcon} icon={faCheckCircle} /> <span>Up-to-date</span>
          </div>
        )}
      </div>

      <Paragraph className={styles.description}>{description}</Paragraph>

      <div className={styles.tags}>
        {packagistUrl && (
          <ToolTip tooltip=" View Packagist">
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
          <Tag label={favers ?? 0} icon={<FontAwesomeIcon icon={faStar} />} />
        </ToolTip>

        {license && (
          <ToolTip tooltip="Licentie">
            <Tag label={license ?? 0} icon={<FontAwesomeIcon icon={faScroll} />} />
          </ToolTip>
        )}
        {homepageUrl && (
          <ToolTip tooltip="Homepage">
            <Tag label={t("Homepage")} icon={<FontAwesomeIcon icon={faHouse} />} onClick={() => open(homepageUrl)} />
          </ToolTip>
        )}
      </div>
    </div>
  );
};
