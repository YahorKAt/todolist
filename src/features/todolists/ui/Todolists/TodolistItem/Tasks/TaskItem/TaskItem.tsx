import { EditableSpan } from "@/common/components"
import { TaskStatus } from "@/common/enums/enums"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"
import { useSortable } from "@dnd-kit/react/sortable"
import DeleteIcon from "@mui/icons-material/Delete"
import { IconButton } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import ListItem from "@mui/material/ListItem"
import { ChangeEvent } from "react"

type Props = {
    task: DomainTask
    todolistId: string
    index: number
}

export const TaskItem = ({ task, todolistId, index }: Props) => {
    const [updateTask] = useUpdateTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()

    const { ref } = useSortable({ id: task.id, index })

    const deleteTaskHandler = () => {
        deleteTask({ todolistId, taskId: task.id })
    }

    const createUpdateModel = (changes: Partial<UpdateTaskModel>): UpdateTaskModel => ({
        title: task.title,
        status: task.status,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        startDate: task.startDate,
        ...changes,
    })

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const model = createUpdateModel({
            status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
        })
        updateTask({ todolistId, taskId: task.id, model })
    }

    const changeTaskTitleHandler = (title: string) => {
        const model = createUpdateModel({ title })
        updateTask({ todolistId, taskId: task.id, model })
    }

    const checked = task.status === TaskStatus.Completed

    return (
        <div ref={ref} style={{ cursor: index !== -1 ? "grab" : "default" }}>
            <ListItem key={task.id} className={checked ? "is-done" : ""}>
                <Checkbox color="primary" checked={checked} onChange={changeTaskStatusHandler} />
                <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
                <IconButton onClick={deleteTaskHandler} aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </ListItem>
        </div>
    )
}
