import React, { useEffect } from "react";
import headerStyles from "./Header.module.css";
import { MobileMenuProps } from "../../../types/interfaces";
import Navbar from "./Navbar";

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle, items }) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(!isOpen);
  };

  // Stäng mobile menu när skärmen blir bredare än 875px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 876 && isOpen) {
        onToggle(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Mobile hamburger menu button */}
      <div className={headerStyles.mobileMenuButton}>
        <button
          className={headerStyles.hamburgerButton}
          onClick={handleToggle}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`${headerStyles.hamburgerLine} ${
              isOpen ? headerStyles.open : ""
            }`}
          ></span>
          <span
            className={`${headerStyles.hamburgerLine} ${
              isOpen ? headerStyles.open : ""
            }`}
          ></span>
          <span
            className={`${headerStyles.hamburgerLine} ${
              isOpen ? headerStyles.open : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className={headerStyles.mobileMenuOverlay}
            onClick={() => onToggle(false)}
          ></div>
          <div className={headerStyles.mobileMenu}>
            <Navbar
              type="blue"
              items={items}
              show={true}
              onItemClick={() => onToggle(false)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;

