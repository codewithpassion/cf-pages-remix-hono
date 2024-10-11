import { useTheme } from 'next-themes';
import { Image } from "@/components/ui/image";

import remixDark from "~/assets/logo-dark.png"
import remixLight from "~/assets/logo-light.png"

export default function Logo() {
    const { theme } = useTheme();

    return (
        <div>
            <Image
                src={remixLight}
                alt="Image"
                width="auto"
                height="auto"
                className="block h-full w-full object-cover dark:hidden"
            />
            <Image
                src={remixDark}
                alt="Image"
                width="auto"
                height="auto"
                className="hidden h-full w-full object-cover dark:block"
            />

        </div>
    );
}