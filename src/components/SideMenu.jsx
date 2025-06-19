import React, { useEffect, useRef } from "react";
import styles from "./SideMenu.module.css";

const navLinks = [
  { label: "Shop", value: "Shop" },
  { label: "About", value: "About" },
  { label: "Wholesale", value: "Wholesale" },
];

const shopLinks = [
  "Hoodies",
  "Crewnecks",
  "Sweatpants",
  "T-shirts",
  "Headwear",
];

const fabrics = [
  "500 GSM French Terry",
  "400 GSM Fleece",
  "275 GSM Jersey",
  "200 GSM Jersey",
];

const SideMenu = ({ open, onClose, highlight }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay + (open ? " open" : "")}> 
      <div className={styles.sidemenu_backdrop} />
      <div className={styles.menu} ref={overlayRef}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">x</button>
        <div className={styles.menuHeader}>
          {/* Nav links at the top */}
          <nav className={styles.menuNav}>
            {navLinks.map((link) => (
              <span
                key={link.value}
                className={highlight === link.value ? styles.menuNavActive : undefined}
                style={{ cursor: "pointer" }}
              >
                {link.label}
              </span>
            ))}
          </nav>
        </div>
        {/* Shop All section */}
        <div className={styles.menuTitle}>Shop All</div>
        <ul className={styles.menuList}>
          {shopLinks.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        {/* Fabrics section */}
        <div className={styles.menuTitle}>Fabrics</div>
        <ul className={styles.menuList}>
          {fabrics.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu; 