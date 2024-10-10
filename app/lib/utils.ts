import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


const listOne = [
    'mercury', 'gold', 'silver', 'copper', 'iron',
    'platinum', 'titanium', 'bronze', 'steel', 'aluminum'
];

const listTwo = [
    'desire', 'hunger', 'need', 'ambition', 'passion',
    'curiosity', 'wisdom', 'courage', 'serenity', 'vigor'
];


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export type Styling = {
    header?: {
        backgroundColor: string;
        textColor: string,
        minimizeIconColor: string
    };
    message?: {
        ai?: { backgroundColor: string; textColor: string };
        human?: { backgroundColor: string; textColor: string };
    },
    input?: { sendButtonColor?: string; sendText?: string; }
}

export type FramedStyling = Styling & {
    maxHeight?: string;
}

export function generateName(postfix: string, isNameUsed?: (name: string) => boolean): string {
    let name: string;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop if all combinations are exhausted
    do {
        const randomElementOne = listOne[Math.floor(Math.random() * listOne.length)];
        const randomElementTwo = listTwo[Math.floor(Math.random() * listTwo.length)];
        name = `${randomElementOne}-${randomElementTwo}-${postfix}`;
        attempts++;
    } while (isNameUsed && isNameUsed(name) && attempts < maxAttempts);

    if (attempts === maxAttempts) {
        throw new Error("Unable to generate a unique name after maximum attempts");
    }

    return name;
}
