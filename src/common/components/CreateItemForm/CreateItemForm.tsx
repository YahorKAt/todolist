import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import AddIcon from "@mui/icons-material/Add"
import IconButton from "@mui/material/IconButton"

type Props = {
    onCreateItem: (title: string) => void
}

export const CreateItemForm = ({ onCreateItem }: Props) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState<string | null>(null)

    const createItemHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle !== "") {
            onCreateItem(trimmedTitle)
            setTitle("")
        } else {
            setError("Title is required")
        }
    }

    const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
        setError(null)
    }

    const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            createItemHandler()
        }
    }

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <TextField
                size={"small"}
                value={title}
                label={"Add task"}
                error={!!error}
                helperText={error}
                onChange={changeTitleHandler}
                onKeyDown={createItemOnEnterHandler}
            />
            <IconButton onClick={createItemHandler}>
                <AddIcon color="primary" />
            </IconButton>
        </Box>
    )
}
