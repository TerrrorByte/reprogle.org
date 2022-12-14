'use client';

import Nav from "./nav";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <div className={"relative overflow-hidden"}>
      <Nav />
      <span className={"ellipse"} />
      <main>{children}</main>
      <span
        className={
          "absolute w-full outline outline-[0.5px] outline-dark-base-blue-200"
        }
      />
      <Footer
        className={
          "mt-10 mb-5 px-5 text-center text-white md:mx-auto md:flex md:max-w-screen-md md:flex-col md:space-y-2 md:text-left lg:max-w-screen-lg xl:max-w-screen-xl"
        }
      />
    </div>
  );
}
