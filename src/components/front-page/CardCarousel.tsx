import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { EmptyProps } from "../../utils";
import TutorialMiniCard from "../TutorialMiniCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CardCarousel.scss";

export const CardCarousel: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("welcome");
  const [indexOffset, setIndexOffset] = useState(0);

  // TODO: Replace the hard-coded list of tutorial mini-cards with something
  // driven by the pytch-tutorials repo?

  const allCards: React.ReactNode[] = [];

  allCards.push(
    <TutorialMiniCard
      key="catch"
      title={t("card-carousel.catch.title")}
      slug="chase"
      screenshotBasename="screenshot.png"
    >
      <p>{t("card-carousel.catch.description")}</p>
    </TutorialMiniCard>
  );

  allCards.push(
    <TutorialMiniCard
      key="boing"
      title={t("card-carousel.boing.title")}
      slug="boing"
      screenshotBasename="summary-screenshot.png"
    >
      <p>
        <Trans
          ns="welcome"
          i18nKey="card-carousel.boing.description"
          components={{
            srcLink: (
              <a href="https://wireframe.raspberrypi.org/books/code-the-classics1" />
            ),
          }}
        />
      </p>
    </TutorialMiniCard>
  );

  allCards.push(
    <TutorialMiniCard
      key="qbert"
      title={t("card-carousel.qbert.title")}
      slug="qbert"
      screenshotBasename="screenshot.png"
    >
      <p>
        <Trans
          ns="welcome"
          i18nKey="card-carousel.qbert.description"
          components={{
            srcLink: <a href="https://wireframe.raspberrypi.org/issues/42" />,
          }}
        />
      </p>
    </TutorialMiniCard>
  );

  allCards.push(
    <TutorialMiniCard
      key="splat"
      title={t("card-carousel.splat.title")}
      slug="splat-the-moles"
      screenshotBasename="screenshot-w240.jpg"
    >
      <p>{t("card-carousel.splat.description")}</p>
    </TutorialMiniCard>
  );

  const shownCards = [
    ...allCards.slice(indexOffset),
    ...allCards.slice(0, indexOffset),
  ];

  const increaseOffsetFun = (dIndex: number) => () =>
    setIndexOffset((indexOffset + dIndex) % allCards.length);

  return (
    <div className="CardCarousel">
      <button className="prev-arrow" onClick={increaseOffsetFun(-1)}>
        <FontAwesomeIcon icon="chevron-left" />
      </button>
      <div className="cards-content">{shownCards}</div>
      <button className="next-arrow" onClick={increaseOffsetFun(1)}>
        <FontAwesomeIcon icon="chevron-right" />
      </button>
    </div>
  );
};
