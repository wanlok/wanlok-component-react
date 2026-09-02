import { LayoutMenu } from "../../components/LayoutMenu";
import { Landing } from "../../pages/landing";
import { mountApp } from "../../mountApp";

mountApp(
  <LayoutMenu activeSection="home">
    <Landing />
  </LayoutMenu>
);
