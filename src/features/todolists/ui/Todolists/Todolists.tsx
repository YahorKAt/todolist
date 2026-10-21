import { containerSx } from "@/common/styles/container.styles"
import { useChangeTodolistOrderMutation, useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import { TodolistSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/TodolistSkeleton/TodolistSkeleton"
import { DragDropProvider } from "@dnd-kit/react"
import TodolistItem from "./TodolistItem/TodolistItem.tsx"
import Box from "@mui/material/Box"

export const Todolists = () => {
    const { data: todolists, isLoading, refetch } = useGetTodolistsQuery()
    const [changeTodolistOrder] = useChangeTodolistOrderMutation()

    if (isLoading) {
        return (
            <Box sx={containerSx} style={{ gap: "32px" }}>
                {Array(3)
                    .fill(null)
                    .map((_, id) => (
                        <TodolistSkeleton key={id} />
                    ))}
            </Box>
        )
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

        if (!todolists) return

        // Получаем массив после перемещения
        const updatedTodolists = [...todolists]
        const [movedItem] = updatedTodolists.splice(oldIndex, 1)
        updatedTodolists.splice(newIndex, 0, movedItem)

        // Определяем putAfterItemId
        const putAfterItemId = newIndex === 0 ? null : updatedTodolists[newIndex - 1].id

        // Отправляем запрос
        changeTodolistOrder({
            todolistId: String(source.id),
            putAfterItemId,
        })
    }

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <Box sx={{ display: "flex", gap: "50px", flexWrap: "wrap" }}>
                {todolists?.map((todolist, index) => (
                    <TodolistItem key={todolist.id} todolist={todolist} index={index} />
                ))}
            </Box>
        </DragDropProvider>
    )
}
