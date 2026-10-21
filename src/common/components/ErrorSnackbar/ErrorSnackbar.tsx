import { selectAppError, setAppErrorAC } from "@/app/app-slice"
import { useAppDispatch } from "@/common/hooks/useAppDispatch"
import { useAppSelector } from "@/common/hooks/useAppSelector"
import { Alert } from "@mui/material"
import { type SyntheticEvent } from "react"
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"

export const ErrorSnackbar = () => {
    const error = useAppSelector(selectAppError)
    const dispatch = useAppDispatch()

    const handleClose = (_event: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return
        }
        dispatch(setAppErrorAC({ error: null }))
    }

    return (
        <Snackbar open={!!error} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled">
                {error}
            </Alert>
        </Snackbar>
    )
}
