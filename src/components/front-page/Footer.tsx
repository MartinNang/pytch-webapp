import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../LinkWithinApp";
import { urlWithinApp } from "../../env-utils";
import { DecorativeUnderscore } from "../decorations";
import "./Footer.scss";

// TODO: Use research site URL from constants.  Or generalise to function giving
// a particular page within research site.

export const Footer = () => {
  const { t } = useTranslation("welcome");
  const riLogo = urlWithinApp("/assets/logos/RI-white-on-transparent.png");
  const tcdLogo = urlWithinApp("/assets/logos/TCD-white-on-transparent.png");
  const tudLogo = urlWithinApp("/assets/logos/TUD-white-on-transparent.png");

  return (
    <footer className="Footer">
      <div className="section-content">
        <div className="sitemap">
          <div className="list-container">
            <h2 id="contact-info">
              {t("footer.contact-us.heading")}
              <DecorativeUnderscore />
            </h2>
            <ul>
              <li>
                <a href="mailto:info@pytch.org">
                  {t("footer.contact-us.email")}
                </a>
              </li>
              <li>
                <a href="https://x.com/pytchlang/">
                  {t("footer.contact-us.twitter")}
                </a>
              </li>
              <li>
                <a href="https://bsky.app/profile/pytchlang.bsky.social">
                  {t("footer.contact-us.bluesky")}
                </a>
              </li>
            </ul>
          </div>
          <div className="list-container">
            <h2>
              {t("footer.about.heading")}
              <DecorativeUnderscore />
            </h2>
            <ul>
              <li>
                <a href="https://pytch.scss.tcd.ie/who-we-are/">
                  {t("footer.about.our-team")}
                </a>
              </li>
              <li>
                <a href="https://pytch.scss.tcd.ie/blog/">
                  {t("footer.about.news")}
                </a>
              </li>
            </ul>
          </div>
          <div className="list-container">
            <h2>
              {t("footer.for-teachers.heading")}
              <DecorativeUnderscore />
            </h2>
            <ul>
              <li>
                <Link to="/tutorials/">
                  {t("footer.for-teachers.tutorials")}
                </Link>
              </li>
              <li>
                <a href="https://pytch.scss.tcd.ie/lesson-plans/">
                  {t("footer.for-teachers.lesson-plans")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="section-images">
          <img src={riLogo} alt={t("footer.logo-alt.research-ireland")} />
          <img src={tcdLogo} alt={t("footer.logo-alt.tcd")} />
          <img src={tudLogo} alt={t("footer.logo-alt.tud")} />
        </div>
      </div>
    </footer>
  );
};
