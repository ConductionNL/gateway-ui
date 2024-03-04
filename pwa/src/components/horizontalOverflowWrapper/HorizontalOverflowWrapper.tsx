/**
 * IMPORTANT: This is a temporary component that will be removed if the @conduction/components package can be updated.
 */

import * as React from "react";
import * as styles from "./HorizontalOverflowWrapper.module.css";
import clsx from "clsx";
import { Button } from "@utrecht/component-library-react/dist/css-module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface HorizontalOverflowWrapperProps {
  children: React.ReactNode;
  ariaLabels: {
    scrollRightButton: string;
    scrollLeftButton: string;
  };
}

export const HorizontalOverflowWrapper: React.FC<HorizontalOverflowWrapperProps> = ({ children, ariaLabels }) => {
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false);

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const scrollRight = (): void => {
    wrapperRef.current?.scrollTo({
      left: wrapperRef.current.scrollLeft + wrapperRef.current.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  const scrollLeft = (): void => {
    wrapperRef.current?.scrollTo({
      left: wrapperRef.current.scrollLeft - wrapperRef.current.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    checkScrollDirections(); // initiate available scroll directions

    window.addEventListener("resize", checkScrollDirections);

    return () => window.removeEventListener("resize", checkScrollDirections);
  }, []);

  const checkScrollDirections = (): void => {
    if (!wrapperRef.current) return;

    setCanScrollRight(wrapperRef.current.scrollLeft + wrapperRef.current.clientWidth < wrapperRef.current.scrollWidth);
    setCanScrollLeft(wrapperRef.current.scrollLeft > 0);
  };

  return (
    <div className={styles.container}>
      {canScrollLeft && (
        <Button
          className={clsx(styles.scrollButton)}
          onClick={scrollLeft}
          appearance="secondary-action-button"
          aria-label={ariaLabels.scrollLeftButton}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      )}

      {canScrollRight && (
        <Button
          className={clsx(styles.scrollButton, styles.right)}
          onClick={scrollRight}
          appearance="secondary-action-button"
          aria-label={ariaLabels.scrollRightButton}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      )}

      <div ref={wrapperRef} className={styles.wrapper} onScroll={checkScrollDirections}>
        {children}
      </div>
    </div>
  );
};
