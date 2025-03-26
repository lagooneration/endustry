"use client";

import * as animationData from "@/data/industry.json";
import { useLottie } from "lottie-react";

const AniLottie = () => {
    
  const defaultOptions = {
    animationData: animationData,
    loop: true,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <>
      <div className="">
        <div className="w-full h-full scale-[0.6]">{View}</div>
      </div>
    </>
  );
};

export default AniLottie;