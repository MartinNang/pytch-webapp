import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { EmptyProps } from "../../utils";
import { welcomeAssetUrl } from "./utils";
import { DecorativeUnderscore } from "../decorations";
import "./LearnPython.scss";
import { Link } from "react-router-dom";
import { sharingUrlFromSlugForDemo } from "../../model/user-interactions/share-tutorial";

type LaptopScreenshotProps = {
  imageUrl: string;
  tutorialSlug: string;
};
const LaptopScreenshot: React.FC<LaptopScreenshotProps> = ({
  imageUrl,
  tutorialSlug,
}) => {
  const shareUrl = sharingUrlFromSlugForDemo(tutorialSlug);
  return (
    <Link to={shareUrl}>
      <div className="LaptopScreenshot">
        <div className="screen-wrapper">
          <img src={imageUrl} />
        </div>
        <div className="angled-keyboard" />
        <div className="front-edge" />
      </div>
    </Link>
  );
};

export const LearnPython: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("welcome");
  const logoUrl = welcomeAssetUrl("pytch-colour-logo-960-320.png");
  const flatPreview = welcomeAssetUrl("flat-mock-up.png");
  const scriptByScriptPreview = welcomeAssetUrl("script-by-script-mock-up.png");

  return (
    <div className="LearnPython">
      <div className="content">
        <h2>
          <Trans
            ns="welcome"
            i18nKey="learn-python.heading"
            components={{ br: <br /> }}
          />
          <DecorativeUnderscore />
        </h2>

        <div className="content-text">
          <div className="feature-summary">
            <p>{t("learn-python.description")}</p>

            <div className="logo-container">
              <img src={logoUrl} alt="" />
            </div>
          </div>

          <h3>
            {t("learn-python.two-ways.heading")}
            <DecorativeUnderscore />
          </h3>

          <div className="laptop-screenshots">
            <div className="annotated-screenshot narrow">
              <h4>{t("learn-python.script-by-script.heading")}</h4>
              <LaptopScreenshot
                imageUrl={scriptByScriptPreview}
                tutorialSlug="script-by-script-catch-apple"
              />
            </div>

            <div className="annotated-screenshot narrow">
              <h4>{t("learn-python.one-big-program.heading")}</h4>
              <LaptopScreenshot
                imageUrl={flatPreview}
                tutorialSlug="catch-apple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
