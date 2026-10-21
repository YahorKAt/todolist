import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { ErrorSnackbar } from "@/common/components/ErrorSnackbar/ErrorSnackbar"
import { ResultCode } from "@/common/enums/enums"
import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { Routing } from "@/common/routing"
import { useMeQuery } from "@/features/auth/api/authApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { CircularProgress, CssBaseline, ThemeProvider } from "@mui/material"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { getTheme } from "@/common/theme/theme"
import { Header } from "@/common/components/Header/Header.tsx"
import { useEffect, useState } from "react"
import s from "./App.module.css"

export type TasksState = Record<string, DomainTask[]>

export const App = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)
    const dispatch = useAppDispatch()

    const [isInitialized, setIsInitialized] = useState(false)

    const { data, isLoading } = useMeQuery()

    useEffect(() => {
        if (isLoading) return
        if (data?.resultCode === ResultCode.Success) {
            dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        }
        setIsInitialized(true)
    }, [isLoading])

    if (!isInitialized) {
        return (
            <div className={s.circularProgressContainer}>
                <CircularProgress size={150} thickness={3} />
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Routing />
            <ErrorSnackbar />
        </ThemeProvider>
    )
}
