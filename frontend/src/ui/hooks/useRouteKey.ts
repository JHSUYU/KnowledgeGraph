import { useLocation } from "react-router";
export const routeKeys: {
  home: "home";
  setting: "setting";
  recommond: "recommond";
} = {
  home: "home",
  setting: "setting",
  recommond: "recommond",
};
export function useRouteKey() {
  const { pathname } = useLocation();
  const keys = pathname.split("/");
  const headKey = keys[1] as ValueOf<typeof routeKeys>;
  return {
    headKey,
  };
}
