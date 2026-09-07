"use client";

import type { ReactElement } from "react";
import dynamic from 'next/dynamic';

const GlassSurface = dynamic(() => import('@/components/ui/glassSurface'), {
    ssr: false,
});

type GlassButtonProps = {
    icon: ReactElement,
    action?: any,
}

export default function GlassButton({ icon, action }: GlassButtonProps) {
    return (
        <button onClick={action}>
            <GlassSurface
                width={50}
                height={50}
                borderRadius={50}      
                blur={13} 
            >
                {icon}
            </GlassSurface>
        </button>
    )
}