import * as React from "react";
import * as styles from "./PluginCard.module.css";
import { Link, Paragraph } from "@gemeente-denhaag/components-react";
import { navigate } from "gatsby";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { Tag } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHubLogo } from "../../assets/svgs/GitHub";
import {
  faArrowRight,
  faArrowsRotate,
  faCheckCircle,
  faCircleDown,
  faDownload,
  faHouse,
  faScroll,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { PackagistLogo } from "../../assets/svgs/Packagist";
import { usePlugin } from "../../hooks/plugin";
import { useQueryClient } from "react-query";
import { TOOLTIP_ID } from "../../layout/Layout";

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

  const queryClient = useQueryClient();
  const _usePlugin = usePlugin(queryClient);
  const installPlugin = _usePlugin.install();
  const upgradePlugin = _usePlugin.upgrade();

  const handleInstallPlugin = () => {
    installPlugin.mutate({ name: title.label });
  };

  const handleUpgradePlugin = () => {
    upgradePlugin.mutate({ name: title.label });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleLink} onClick={() => navigate(title.href)}>
          <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
            {title.label}
          </Link>
        </div>
        {installed === false && (
          <div className={styles.buttonOnClick} onClick={handleInstallPlugin}>
            <FontAwesomeIcon icon={faCircleDown} /> <span>Install</span>
          </div>
        )}
        {installed && update && (
          <div className={styles.buttonOnClick} onClick={handleUpgradePlugin}>
            <FontAwesomeIcon className={styles.updateIcon} icon={faArrowsRotate} /> <span>Update</span>
          </div>
        )}
        {installed && update === false && (
          <div className={styles.buttonNoOnClick}>
            <FontAwesomeIcon className={styles.upToDateIcon} icon={faCheckCircle} /> <span>Up-to-date</span>
          </div>
        )}
      </div>

      <Paragraph className={styles.description}>{description}</Paragraph>

      <div className={styles.tags}>
        {packagistUrl && (
          <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="View Packagist">
            <Tag
              layoutClassName={styles.svgLogo}
              label={t("Packagist")}
              icon={<PackagistLogo />}
              onClick={() => open(packagistUrl)}
            />
          </span>
        )}

        {repositoryUrl && (
          <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Github">
            <Tag
              layoutClassName={styles.svgLogo}
              label={t("Repository")}
              icon={<GitHubLogo />}
              onClick={() => open(repositoryUrl)}
            />
          </span>
        )}

        <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Aantal downloads">
          <Tag label={downloads ?? 0} icon={<FontAwesomeIcon icon={faDownload} />} />
        </span>

        <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Aantal favers">
          <Tag label={favers ?? 0} icon={<FontAwesomeIcon icon={faStar} />} />
        </span>

        {license && (
          <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Licentie">
            <Tag label={license ?? 0} icon={<FontAwesomeIcon icon={faScroll} />} />
          </span>
        )}
        {homepageUrl && (
          <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Homepage">
            <Tag label={t("Homepage")} icon={<FontAwesomeIcon icon={faHouse} />} onClick={() => open(homepageUrl)} />
          </span>
        )}
      </div>
    </div>
  );
};
