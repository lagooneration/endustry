import { Element, Link as LinkScroll } from "react-scroll";
import Button from "@/components/ui/custom/button";
import AniLottie from "@/components/ui/custom/AniLottie";

const Hero = () => {
  return (
    <section className="relative pt-60 pb-40 px-4 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      <Element name="hero">
        <div className="container">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            <div className="caption small-2 uppercase text-p1">
              Endustry AI
            </div>
            <h1 className="mb-6 h1 text-p4 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
              End of Industry
            </h1>
            <p className="max-w-440 mb-14 body-1 max-md:mb-10 text-p5">
            Streamline your industry operations with our AI-powered solution that transforms time consuming processes into digital workflows.
            </p>
            <LinkScroll to="features" offset={-100} spy smooth>
              <Button icon="/images/zap.svg">Try it now</Button>
            </LinkScroll>
          </div>

          <div className="absolute -top-10 max-md:top-36 z-1 left-[calc(50%-340px)] w-[1230px] pointer-events-none hero-img_res">
            <img
              src="/images/hero2.png"
              className="size-1230 max-lg:h-auto mix-blend-screen opacity-30"
              alt="hero"
            />
          </div>
          <div className="absolute -top-48 left-[calc(50%-340px)] w-[1230px] pointer-events-none hero-img_res">
            <AniLottie />
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Hero;