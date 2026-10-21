import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist, FilterValues } from "@/features/todolists/lib/types"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import { useAppDispatch } from "@/common/hooks/useAppDispatch.ts"
import Box from "@mui/material/Box"

type Props = {
    todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
    const { id } = todolist

    const dispatch = useAppDispatch()

    const changeFilterHandler = (filter: FilterValues) => {
        dispatch(
            todolistsApi.util.updateQueryData("getTodolists", undefined, (todolists) => {
                const todolist = todolists.find((todolist) => todolist.id === id)
                if (todolist) {
                    todolist.filter = filter
                }
            }),
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <ButtonGroup color={"primary"} variant="contained">
                <Button onClick={() => changeFilterHandler("all")}>All</Button>
                <Button onClick={() => changeFilterHandler("active")}>Active</Button>
                <Button onClick={() => changeFilterHandler("completed")}>Completed</Button>
            </ButtonGroup>
        </Box>
    )
}
