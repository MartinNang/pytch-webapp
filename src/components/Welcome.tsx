import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavBanner } from "./NavBanner";
import { EmptyProps } from "../utils";
import { useStoreActions } from "../store";
import { Header } from "./front-page/Header";
import { CodingJourney } from "./front-page/CodingJourney";
import { CardCarousel } from "./front-page/CardCarousel";
import { LearnPython } from "./front-page/LearnPython";
import { ContactInvitation } from "./front-page/ContactInvitation";
import { Footer } from "./front-page/Footer";
import { useScrollToUrlFragment } from "./hooks/use-fragment-scroll";
import "./Welcome.scss";

// Leave this placeholder here for when we want to put announcements on
// the front page.
const NewsLink: React.FC<EmptyProps> = () => {
  return false;
  // In real use, put content into this div:
  // return <div className="Welcome-NewsLink"></div>;
};

const Welcome: React.FC<EmptyProps> = () => {
  const { t } = useTranslation("welcome");
  // I have NO IDEA why the following is needed.  I suspect a bug in
  // Vite or the bundler.  Without the following line, the value
  // "pytchAppModel" exported from model/index.ts is not defined before
  // that value is used by store.ts.  It's possible there's a better fix
  // but I am not inclined to go looking for it just now.
  useStoreActions(() => void 0);

  useEffect(() => {
    document.title = "Pytch";
  });

  useScrollToUrlFragment();

  return (
    <>
      <NavBanner />
      <div className="welcome-text">
        <Header />
        <CodingJourney />

        <h3 className="pytch-summary">{t("pytch-summary")}</h3>

        <NewsLink />
        <CardCarousel />
        <LearnPython />
        <ContactInvitation />
        <Footer />
      </div>
    </>
  );
};

export default Welcome;
