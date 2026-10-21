import { TaskStatus } from "@/common/enums/enums"
import { useChangeTaskOrderMutation, useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { TasksPagination } from "@/features/todolists/ui/Todolists/TodolistItem/TaskPagination/TaskPagination"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton"
import { DragDropProvider } from "@dnd-kit/react"
import { List } from "@mui/material"
import Box from "@mui/material/Box"
import { useState } from "react"
import { TaskItem } from "./TaskItem/TaskItem.tsx"

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
    const { id, filter } = todolist

    const [page, setPage] = useState(1)

    const { data: tasks, isLoading, refetch } = useGetTasksQuery({ id, params: { page } })

    const [changeTaskOrder] = useChangeTaskOrderMutation()

    let filteredTasks = tasks?.items
    if (filter === "active") {
        filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
    }
    if (filter === "completed") {
        filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
    }

    if (isLoading) {
        return <TasksSkeleton />
    }

    const handleDragEnd = (event: any) => {
        if (event.canceled) return

        const { source, target } = event.operation

        if (!target) {
            refetch()
            return
        }
        // 🔥 ИСПОЛЬЗУЕМ initialIndex для source (исходная позиция до перетаскивания)
        const oldIndex = source.initialIndex
        const newIndex = target.index

        // Если индексы совпадают или не найдены — выходим
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return

        if (!tasks) return

        // Получаем массив после перемещения
        const updatedTodolists = [...(tasks?.items || [])]
        const [movedItem] = updatedTodolists.splice(oldIndex, 1)
        updatedTodolists.splice(newIndex, 0, movedItem)

        // Определяем putAfterItemId
        const putAfterItemId = newIndex === 0 ? null : updatedTodolists[newIndex - 1].id

        // Отправляем запрос
        changeTaskOrder({
            taskId: String(source.id),
            todolistId: todolist.id,
            putAfterItemId,
        })
    }

    if (filter !== "all") {
        return (
            <>
                {filteredTasks?.length === 0 ? (
                    <p>Тасок нет</p>
                ) : (
                    <List>
                        {filteredTasks?.map((task) => (
                            <TaskItem key={task.id} task={task} todolistId={todolist.id} index={-1} />
                        ))}
                    </List>
                )}
                <TasksPagination page={page} totalCount={tasks?.totalCount || 0} setPage={setPage} />
            </>
        )
    }

    return (
        <>
            {filteredTasks?.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <DragDropProvider onDragEnd={handleDragEnd}>
                    <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                        <List>
                            {filteredTasks?.map((task, index) => (
                                <TaskItem key={task.id} task={task} todolistId={id} index={index} />
                            ))}
                        </List>
                        <TasksPagination totalCount={tasks?.totalCount || 0} page={page} setPage={setPage} />
                    </Box>
                </DragDropProvider>
            )}
        </>
    )
}
