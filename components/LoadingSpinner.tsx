import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingSpinner = () => {
  return (
    <div className='w-56 h-56 mt-24 flex justify-center items-center mx-auto '>

      <DotLottieReact
        src="https://lottie.host/5a91c2b9-2f1c-484a-a301-d072eaa047c1/rQmBAFqYyb.lottie"
        loop
        autoplay
        
      />
    </div>
  );
};
export default LoadingSpinner