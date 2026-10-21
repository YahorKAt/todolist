import { useMemo } from "react"
import { createTheme } from "@mui/material"
import { ThemeMode } from "@/app/app-slice.ts"

export const getTheme = (themeMode: ThemeMode) => {
    return useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    primary: {
                        main: "#194737",
                    },
                },
            }),
        [themeMode],
    )
}
