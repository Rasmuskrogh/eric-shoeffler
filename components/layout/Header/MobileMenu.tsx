import React, { useEffect } from "react";
import headerStyles from "./Header.module.css";
import { MobileMenuProps } from "../../../types/interfaces";
import Navbar from "./Navbar";

const MobileMenu = ({ isOpen, onToggle, items }: MobileMenuProps) => {
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

  // Förhindra scrollning när menyn är öppen
  useEffect(() => {
    if (isOpen) {
      // Spara nuvarande scrollposition
      const scrollY = window.scrollY;
      // Förhindra scrollning
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Återställ scrollning
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      // Återställ scrollposition
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      // Rensa upp vid unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
