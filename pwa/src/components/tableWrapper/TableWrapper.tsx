import * as React from "react";
import * as styles from "./TableWrapper.module.css";

interface TableWrapperProps {
  children: React.ReactNode;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({ children }) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [tableScrollX, setTableScrollX] = React.useState<number>(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = (event.target as HTMLDivElement).scrollLeft;
    setTableScrollX(scrollLeft);
  };

  React.useEffect(() => {
    const handleWindowResize = () => {
      if (!tableContainerRef.current) return;

      console.log(tableContainerRef.current.scrollWidth);
      console.log(tableContainerRef.current.);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.scrollIndicator} />

      <div onScroll={handleScroll} ref={tableContainerRef}>
        {children}
      </div>
    </div>
  );
};
