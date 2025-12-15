import React, { useEffect, useState } from "react";
import { withinSite } from "../env-utils";
import { Link } from "./LinkWithinApp";
import { pytchResearchSiteUrl } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import "../pytch-navbar.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import pytchLogo from "../images/pytch.png";

const NavBanner = () => {
  const [menuIsExpanded, setMenuIsExpanded] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuDiv = menuRef.current;
    if (menuDiv == null) return;

    let resizeObserver: ResizeObserver | null = new ResizeObserver(() => {
      const mMenuDisplay = menuDiv.computedStyleMap().get("display");
      if (mMenuDisplay == null) return;

      const menuDisplay = mMenuDisplay as CSSKeywordValue;
      if (menuIsExpanded && menuDisplay.value === "none") {
        setMenuIsExpanded(false);
      }
    });

    resizeObserver.observe(menuDiv);

    return () => {
      resizeObserver?.disconnect();
      resizeObserver = null;
    };
  });

  const ulClass = classNames({ menuIsExpanded });
  const toggleMenu = () => {
    setMenuIsExpanded(!menuIsExpanded);
  };

  const burgerIcon: IconProp = menuIsExpanded ? "xmark" : "bars";
  const burgerClass = classNames(
    "burger-menu",
    menuIsExpanded ? "is-expanded" : "is-collapsed"
  );

  return (
    <div className="NavBar">
      <div className={"NavBarContent"}>
        <div className="title-and-version">
          <Link to="/">
            <img src={pytchLogo} alt={"Pytch Logo"} height={"70"} />
          </Link>
        </div>
        <div className={burgerClass} onClick={toggleMenu} ref={menuRef}>
          <FontAwesomeIcon icon={burgerIcon} />
        </div>
        <ul className={ulClass}>
          <li>
            <a href={pytchResearchSiteUrl}>
              About
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Interface / External_Link">
                    <path
                      id="Vector"
                      d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                      stroke="#ffffff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </g>
              </svg>
            </a>
          </li>
          <li>
            <a href={`${pytchResearchSiteUrl}lesson-plans`}>
              Lesson plans
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Interface / External_Link">
                    <path
                      id="Vector"
                      d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                      stroke="#ffffff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </g>
              </svg>
            </a>
          </li>
          <li>
            <a href={withinSite("/doc/index.html")}>Help</a>
          </li>
          <li>
            <Link to="/tutorials/">Tutorials</Link>
          </li>
          <li>
            <Link to="/my-projects/">My projects</Link>
          </li>
          <li>
            <Link
              className="contact-us-link"
              to="/#contact-info"
              onClick={() => setMenuIsExpanded(false)}
            >
              <FontAwesomeIcon icon={["far", "envelope"]} />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBanner;
