import { Element } from "react-scroll";
import { useState } from "react";
import clsx from "clsx";
import CountUp from "react-countup";
import { plans } from "@/constants/index";
import Button from "@/components/ui/custom/button";

const Pricing = () => {
  const [monthly, setMonthly] = useState(false);

  return (
    <section>
      <Element name="pricing">
        <div className="container mt-12">
          <div className="max-w-960 pricing-head_before relative mx-auto border-l border-r border-s2 bg-s1/50 pb-40 pt-28 max-xl:max-w-4xl max-lg:border-none max-md:pb-32 max-md:pt-16 max-sm:pb-24">
            <h3 className="h3 max-lg:h4 max-md:h5 z-3 relative mx-auto mb-14 max-w-lg text-center text-p4 max-md:mb-11 max-sm:mb-8 max-sm:max-w-xs">
              Flexible pricing for teams of all sizes
            </h3>

            <div className="relative z-4 mx-auto flex w-[375px] rounded-3xl border-[3px] border-s4/25 bg-s1/50 p-2 backdrop-blur-[6px] max-md:w-[310px] max-sm:w-[280px]">
              <button
                className={clsx("pricing-head_btn", monthly && "text-p4")}
                onClick={() => setMonthly(true)}
              >
                Monthly
              </button>
              <button
                className={clsx("pricing-head_btn", !monthly && "text-p4")}
                onClick={() => setMonthly(false)}
              >
                Annual
              </button>

              <div
                className={clsx(
                  "g4 rounded-14 before:h-100 pricing-head_btn_before absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(50%-8px)] overflow-hidden shadow-400 transition-transform duration-500",
                  !monthly && "translate-x-full",
                )}
              />
            </div>

            <div className="pricing-bg max-md:hidden">
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
                className="absolute inset-0 opacity-5 mix-blend-soft-light"
              />
            </div>
          </div>

          {/*  pricing section*/}
          <div className="scroll-hide relative z-2 -mt-12 flex items-start max-xl:gap-5 max-xl:overflow-auto max-xl:pt-6 max-md:flex-col max-md:items-center max-md:gap-8 max-md:mt-0">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={clsx(
                  "pricing-plan_first pricing-plan_last pricing-plan_odd pricing-plan_even relative border-2 p-7 max-xl:min-w-80 max-lg:rounded-3xl xl:w-[calc(33.33%+2px)]",
                  "max-md:w-full max-md:max-w-[400px]"
                )}
              >
                {index === 1 && (
                  <div className="g4 absolute h-330 left-0 right-0 top-0 z-1 rounded-tl-3xl rounded-tr-3xl" />
                )}

                <div
                  className={clsx(
                    "absolute left-0 right-0 z-2 flex items-center justify-center",
                    index === 1 ? "-top-6" : "-top-6 xl:-top-11",
                    "max-md:-top-6"
                  )}
                >
                  <img
                    src={plan.logo}
                    alt={plan.title}
                    className={clsx(
                      "object-contain drop-shadow-2xl",
                      index === 1 ? "size-[120px]" : "size-[88px]",
                      "max-sm:size-[80px]"
                    )}
                  />
                </div>

                <div
                  className={clsx(
                    "relative flex flex-col items-center",
                    index === 1 ? "pt-24" : "pt-12",
                    "max-sm:pt-16"
                  )}
                >
                  <div
                    className={clsx(
                      "small-2 rounded-20 relative z-2 mx-auto mb-6 border-2 px-4 py-1.5 uppercase",
                      index === 1 ? "border-p3 text-p3" : "border-p1 text-p1",
                      "max-sm:mb-4 max-sm:px-3 max-sm:py-1"
                    )}
                  >
                    {plan.title}
                  </div>

                  <div className="relative z-2 flex items-center justify-center">
                    {index === 2 ? (
                      <div className={clsx(
                        "h-num flex items-start",
                        "text-p4",
                        "max-sm:text-[36px] max-sm:leading-[44px]"
                      )}>
                        <Button>Contact us</Button>
                      </div>
                    ) : (
                      <>
                        <div
                          className={clsx(
                            "h-num flex items-start",
                            index === 1 ? "text-p3" : "text-p4",
                            "max-sm:text-[56px] max-sm:leading-[64px]"
                          )}
                        >
                          ₹{" "}
                          <CountUp
                            start={Number(plan.priceMonthly) || 0}
                            end={monthly ? Number(plan.priceMonthly) || 0 : Number(plan.priceYearly) || 0}
                            duration={0.4}
                            useEasing={false}
                            preserveValue
                          />
                        </div>
                        <div className="small-1 relative top-3 ml-1 uppercase max-sm:top-2">
                          / {monthly ? "mo" : "year"}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={clsx(
                    "body-1 relative z-2 mb-10 w-full border-b-s2 pb-9 text-center text-p4",
                    index === 1 && "border-b",
                    "max-sm:mb-6 max-sm:pb-6 max-sm:text-[18px] max-sm:leading-[28px]"
                  )}
                >
                  {plan.caption}
                </div>

                <ul className="mx-auto space-y-4 xl:px-7 max-sm:space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="relative flex items-center gap-5 max-sm:gap-3"
                    >
                      <img
                        src={"/images/check.png"}
                        alt="check"
                        className="size-10 object-contain max-sm:size-8"
                      />
                      <p className="flex-1 max-sm:text-[14px]">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex w-full justify-center max-sm:mt-8">
                  <Button icon={plan.icon}>Get Started</Button>
                </div>

                {index === 1 && (
                  <p className="small-compact mt-9 text-center text-p3 before:mx-2.5 before:content-['-'] after:mx-2.5 after:content-['-'] max-sm:mt-6">
                    Limited time offer
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Pricing;