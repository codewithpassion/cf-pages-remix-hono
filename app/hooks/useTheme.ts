import { useTheme as useNextThemes } from 'next-themes'
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

export function useTheme() {
    const { theme, setTheme } = useNextThemes()
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }
    return { theme, setTheme, toggleTheme }
}
