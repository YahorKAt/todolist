import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { useSortable } from "@dnd-kit/react/sortable"
import { CircularProgress } from "@mui/material"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"
import { CreateItemForm } from "@/common/components"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { Tasks } from "./Tasks/Tasks"

type Props = {
    todolist: DomainTodolist
    index: number
}

export const TodolistItem = ({ todolist, index }: Props) => {
    const [createTask, { status }] = useCreateTaskMutation()

    const { ref } = useSortable({ id: todolist.id, index })

    const createTaskHandler = (title: string) => {
        createTask({ todolistId: todolist.id, title })
    }

    const isDisabled = status === "pending"

    return (
        <Box
            ref={ref}
            sx={{
                minWidth: 275,
                position: "relative",
                opacity: isDisabled ? 0.5 : 1,
                pointerEvents: isDisabled ? "none" : "auto",
                transition: "opacity 0.3s ease-in-out",
            }}
        >
            <Card variant="outlined">
                <CardContent>
                    <TodolistTitle todolist={todolist} />
                    <CreateItemForm onCreateItem={createTaskHandler} />
                    <Tasks todolist={todolist} />
                    <FilterButtons todolist={todolist} />
                </CardContent>
            </Card>
            {isDisabled && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)", // Полупрозрачный белый фон
                        zIndex: 10,
                        borderRadius: 1,
                    }}
                >
                    <CircularProgress size={28} />
                </Box>
            )}
        </Box>
    )
}

export default TodolistItem
