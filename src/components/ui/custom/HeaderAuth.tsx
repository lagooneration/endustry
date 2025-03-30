"use client"
import { Link as LinkScroll } from "react-scroll";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/custom/button";
import { LoginButton } from "@/components/auth/login-button";
import Link from "next/link";


const HeaderAuth = () => {
  const [isOpen, setIsOpen] = useState(false);





  return (
    <header
      className="fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500 max-lg:py-4 text-p4"
    >
      <div className="container flex h-14 items-center max-lg:px-5">
        <a href="/" className="lg:hidden flex-1 cursor-pointer z-2">
          <img src="/logo.svg" width={38} height={55} alt="logo" />
        </a>

        <div
          className="w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-s2 max-lg:opacity-0"
        >
          <div className="max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
            <nav className="max-lg:relative max-lg:z-2 max-lg:my-auto">
              <ul className="flex max-lg:block max-lg:px-12">
                <li className="nav-li">
                  <Link href="/" >Home</Link>
                  <div className="dot" />
                  <Link href="/auth/register" >Register</Link>

                </li>

                <li className="nav-logo">
                  <Link
                   href="/"
                  >
                    <img
                      src="/logo.svg"
                      width={55}
                      height={55}
                      alt="logo"
                    />
                  </Link>
                </li>

                <li className="nav-li">
                    <Link href="/blogs" >Blogs</Link>
                  <div className="dot" />
                  <LoginButton mode="modal">
                    <Button>
                        LOGIN
                    </Button>
                </LoginButton>
                </li>
              </ul>
            </nav>

            <div className="lg:hidden block absolute top-1/2 left-0 w-[960px] h-[380px] translate-x-[-290px] -translate-y-1/2 rotate-90">
              <img
                src="/images/bg-outlines.svg"
                width={960}
                height={380}
                alt="outline"
                className="relative z-2"
              />
              <img
                src="/images/bg-outlines-fill.png"
                width={960}
                height={380}
                alt="outline"
                className="absolute inset-0 mix-blend-soft-light opacity-5"
              />
            </div>
          </div>
        </div>

        <button
          className="lg:hidden z-2 size-10 border-2 border-s4/25 rounded-full flex justify-center items-center"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <img
            src={`/images/${isOpen ? "close" : "magic"}.svg`}
            alt="magic"
            className="size-1/2 object-contain"
          />
        </button>
      </div>
    </header>
  );
};

export default HeaderAuth;