import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants/constants"
import { ResultCode } from "@/common/enums/enums"
import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { getTheme } from "@/common/theme/theme"
import { useLoginMutation, useMeQuery } from "@/features/auth/api/authApi"
import { useLazyGetCaptchaUrlQuery } from "@/features/auth/api/securityApi"
import { type LoginInputs, loginSchema } from "@/features/auth/model/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

export const Login = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)
    const dispatch = useAppDispatch()

    const [login] = useLoginMutation()
    const { data, refetch } = useMeQuery()
    const [getCaptchaUrl, { data: captcha }] = useLazyGetCaptchaUrlQuery()

    const { handleSubmit, control, reset, setError, setValue, clearErrors } = useForm<LoginInputs>({
        defaultValues: { email: "", password: "", rememberMe: false },
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (data: LoginInputs) => {
        login(data)
            .unwrap()
            .then((res) => {
                if (res.resultCode === ResultCode.Success) {
                    localStorage.setItem(AUTH_TOKEN, res.data.token)
                    dispatch(setIsLoggedInAC({ isLoggedIn: true }))
                    reset()
                    refetch()
                } else if (res.resultCode === ResultCode.CaptchaError) {
                    getCaptchaUrl()
                    setValue("captcha", "")
                    setError("captcha", {
                        type: "server",
                        message: res.messages[0] || "Invalid captcha",
                    })
                } else {
                    setError("root", {
                        type: "server",
                        message: res.messages[0] || "Login failed",
                    })
                }
            })
    }

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl component="form" onSubmit={handleSubmit(onSubmit)}>
                <FormLabel>
                    <p>
                        To login get registered
                        <a
                            style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                            href="https://social-network.samuraijs.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>
                        <b>Email:</b> free@samuraijs.com
                    </p>
                    <p>
                        <b>Password:</b> free
                    </p>
                </FormLabel>
                <FormGroup>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Email"
                                margin="normal"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                margin="normal"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    aria-label={
                                                        showPassword ? "hide the password" : "display the password"
                                                    }
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} checked={field.value} />}
                                label="Remember me"
                            />
                        )}
                    />

                    {captcha && (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 2 }}>
                            <img
                                src={captcha.url}
                                alt="captcha"
                                onClick={() => {
                                    getCaptchaUrl()
                                    setValue("captcha", "")
                                    clearErrors("captcha")
                                }}
                                style={{
                                    cursor: "pointer",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                                title="Click to refresh captcha"
                            />
                            <Controller
                                name="captcha"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="Enter captcha"
                                        type="text"
                                        margin="normal"
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>
                    )}

                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </FormGroup>
            </FormControl>
        </Box>
    )
}
