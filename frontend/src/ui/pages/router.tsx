/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { AnimatedSwitch, spring } from "react-router-transition";
import { useSubScribeDarkMode } from "@/state/page/drak";
import { Header } from "./components/Header";
import styles from "./index.less";
import Home from "./Home";
import TagSelect from "./TagSelect";
import QuestionModal from "./components/QuestionModal";
import { EmptyHeader } from "./components/EmptyHeader";
import {
  useLoginCheck,
  useSubScribeLoginState,
} from "@/state/hooks/useLoginCheck";
import Login from "./Login";
import SettingPage from "./Setting";
import { Shower } from "./Shower";
import { Fallback } from "../components/Fallback";

// This is used to router switch animation
function mapStyles(styles: { opacity: any; scale: any }) {
  return {
    opacity: styles.opacity,
  };
}

function bounce(val: any) {
  return spring(val, {
    stiffness: 130,
    damping: 22,
  });
}

const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
  },
};
export default function MainRouter() {
  const { value: user } = useSubScribeLoginState();
  const { value } = useSubScribeDarkMode();
  useLoginCheck();

  return (
    <div
      className="transition-all duration-500 ease-in-out h-screen flex-1 flex bg-white text-black dark:text-white"
      style={value === "dark" ? { backgroundColor: "#18191A" } : {}}
    >
      <div className="flex-1 flex flex-col">
        <BrowserRouter basename="so-coin">
          <Switch>
            <Route path="/login">
              {!user ? <LoginPage /> : <Redirect to="/home" />}
            </Route>
            <Route>{user ? <MainPage /> : <Redirect to="/login" />}</Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}
export function LoginPage() {
  return (
    <>
      <EmptyHeader />
      <div className="flex-1 flex flex-col justify-center items-center">
        <Login />
      </div>
    </>
  );
}
export function MainPage() {
  return (
    <>
      <Header />
      <div className="flex-1">
        <Switch>
          <AnimatedSwitch
            atEnter={bounceTransition.atEnter}
            atLeave={bounceTransition.atLeave}
            atActive={bounceTransition.atActive}
            mapStyles={mapStyles}
            className={styles.switchWrapper}
          >
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/recommond">
              <React.Suspense fallback={<Fallback />}>
                <TagSelect />
              </React.Suspense>
            </Route>
            <Route path="/setting">
              <SettingPage />
            </Route>
            <Route path="/shower/:showerid">
              <React.Suspense fallback={<Fallback />}>
                <Shower />
              </React.Suspense>
            </Route>
            <Route>
              <Redirect to="/home" />
            </Route>
          </AnimatedSwitch>
        </Switch>
      </div>
      <QuestionModal />
    </>
  );
}
