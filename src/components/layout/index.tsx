import "../../assets/css/components/layout/layout.css";
import { IHeaderProps, ILayoutProps, ILSiderProps, IMainProps, ISectionProps } from "./IProps";
import Footer from "./Footer";
import Header from "./Header";
import LSider from "./LSider";
import Main from "./Main";
import React, { JSXElementConstructor } from "react";
import RSider from "./RSider";
import Section from "./Section";

const Layout: React.FC<ILayoutProps> & {
  Header: React.FC<IHeaderProps>;
  Main: React.FC<IMainProps>;
  LSider: React.FC<ILSiderProps>;
  Section: React.FC<ISectionProps>;
  RSider: React.FC;
  Footer: React.FC;
} = ({ children }) => {
  const validOrder = ["Layout.LSider", "Layout.Main"]; // Doğru sıralama

  React.Children.forEach(children, (child, index) => {
    if (React.isValidElement(child)) {
      const componentType = child.type as JSXElementConstructor<any> & { displayName?: string };

      if (validOrder[index] != componentType.displayName) {
        throw new Error(
          `Layout içerisindeki bileşenler yanlış sırada. Beklenen sırada değil: ${componentType.displayName}`
        );
      }
    }
  });

  return (
    <div className="ar-layout">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return;

        return child;
      })}
    </div>
  );
};

Layout.Header = Header;
Layout.Main = Main;
Layout.LSider = LSider;
Layout.Section = Section;
Layout.RSider = RSider;
Layout.Footer = Footer;

Layout.displayName = "Layout";
export default Layout;
