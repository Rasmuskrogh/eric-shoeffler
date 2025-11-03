import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./RequestButton.module.css";
import { RequestButtonProps } from "../../../types/interfaces";

const RequestButton: React.FC<RequestButtonProps> = ({
  active,
  pathname,
  onRequest,
  onBack,
}) => {
  const t = useTranslations("Header");

  const getButtonConfig = () => {
    if (active) {
      return {
        text: t("buttonActive"),
        onClick: onRequest,
        wrapper: null,
        style: {},
      };
    }

    if (pathname === "/") {
      return {
        text: t("buttonInactive"),
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onBack();
        },
        wrapper: null,
        style: {
          cursor: "pointer",
          position: "relative" as const,
          zIndex: 15,
        },
      };
    }

    return {
      text: t("buttonInactive"),
      onClick: null,
      wrapper: "link",
      style: {},
    };
  };

  const config = getButtonConfig();

  const button = (
    <div
      className={styles.bookButton}
      onClick={config.onClick || undefined}
      style={config.style}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 50"
        width="100%"
        height="100%"
      >
        <rect
          x="2"
          y="2"
          width="116"
          height="46"
          rx="8"
          ry="8"
          fill="transparent"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="bold"
        >
          {config.text}
        </text>
      </svg>
    </div>
  );

  return config.wrapper === "link" ? <Link href="/">{button}</Link> : button;
};

export default RequestButton;

