import { baseApi } from "@/app/baseApi"
import { NavButton } from "@/common/components"
import { AUTH_TOKEN } from "@/common/constants/constants"
import { ResultCode } from "@/common/enums/enums"
import { containerSx } from "@/common/styles/container.styles"
import { useLogoutMutation, useMeQuery } from "@/features/auth/api/authApi"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import MenuIcon from "@mui/icons-material/Menu"
import IconButton from "@mui/material/IconButton"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import { useAppDispatch } from "@/common/hooks/useAppDispatch.ts"
import { changeThemeModeAC, selectIsLoggedIn, selectStatus, selectThemeMode, setIsLoggedInAC } from "@/app/app-slice.ts"
import { LinearProgress, Switch } from "@mui/material"
import { useAppSelector } from "@/common/hooks/useAppSelector.ts"

export const Header = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const status = useAppSelector(selectStatus)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    const onChangeMode = () => {
        dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
    }

    const { data } = useMeQuery()
    const [logout] = useLogoutMutation()

    const username = data?.data.login

    const logoutHandler = () => {
        logout()
            .unwrap()
            .then((data) => {
                if (data.resultCode === ResultCode.Success) {
                    dispatch(setIsLoggedInAC({ isLoggedIn: false }))
                    localStorage.removeItem(AUTH_TOKEN)
                }
            })
            .then(() => {
                // dispatch(baseApi.util.resetApiState()) // полная очистка стейта при логауте.
                dispatch(baseApi.util.invalidateTags(["Todolist", "Task"])) // полная/частичная очистка стейта при логауте.
            })
    }

    return (
        <AppBar position="static" sx={{ mb: "30px" }}>
            <Toolbar>
                <Container maxWidth="lg" sx={containerSx}>
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: "20px" }}>
                        Title Site
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "20px", backgroundColor: "red" }}>
                        {isLoggedIn && (
                            <>
                                <Typography variant="subtitle1" component="h2">
                                    {username}
                                </Typography>
                                <NavButton onClick={logoutHandler}>Log Out</NavButton>
                            </>
                        )}
                        <Switch color={"default"} onChange={onChangeMode} />
                    </Box>
                </Container>
                {status === "loading" && (
                    <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} />
                )}
            </Toolbar>
        </AppBar>
    )
}
