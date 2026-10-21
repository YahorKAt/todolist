import { useRemoveTodolistMutation, useUpdateTodolistTitleMutation } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import { EditableSpan } from "@/common/components"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import Typography from "@mui/material/Typography"

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
    const { id, title } = todolist

    const [deleteTodolist] = useRemoveTodolistMutation()
    const [changeTodolistTitle] = useUpdateTodolistTitleMutation()

    const deleteTodolistHandler = async () => {
        deleteTodolist(id)
    }

    const changeTodolistTitleHandler = (title: string) => changeTodolistTitle({ id, title })

    return (
        <Box sx={{ display: "flex", paddingBottom: "20px", gap: "10px", justifyContent: "center" }}>
            <Typography variant="h6">
                <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
            </Typography>
            <IconButton onClick={deleteTodolistHandler} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </Box>
    )
}
