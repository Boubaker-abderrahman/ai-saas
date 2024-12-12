import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface EmptyProps {
    label: string;
}
export const Empty = ({ label}: EmptyProps)=>{

    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative ">
            <DotLottieReact
                src="https://lottie.host/43dbb27b-118e-401a-adb3-39d2b8a084ca/QYoMGRlxwt.lottie"
                loop
                autoplay
            />
            </div>
            <p className="text-muted-foreground text-sm text-center mt-2">
                {label}
            </p>
        </div>
    );
}
