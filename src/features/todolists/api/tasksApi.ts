import { baseApi } from "@/app/baseApi"
import { type DefaultResponse, defaultResponseSchema } from "@/common/types"
import {
    type GetTasksResponse,
    getTasksSchema,
    type TaskOperationResponse,
    taskOperationResponseSchema,
    type UpdateTaskModel,
} from "@/features/todolists/api/tasksApi.types"

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getTasks: builder.query<GetTasksResponse, { id: string; params: { page: number } }>({
                query: ({ id, params }) => ({
                    url: `/todo-lists/${id}/tasks`,
                    params: { ...params, count: 4 },
                }),
                extraOptions: { dataSchema: getTasksSchema }, //ZOD 💎
                providesTags: (_result, _error, { id }) => [{ type: "Task", id }],
            }),

            createTask: builder.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
                query: ({ todolistId, title }) => ({
                    url: `/todo-lists/${todolistId}/tasks`,
                    method: "POST",
                    body: { title },
                }),
                extraOptions: { dataSchema: taskOperationResponseSchema }, //ZOD 💎
                invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
            }),

            updateTask: builder.mutation<
                TaskOperationResponse,
                { todolistId: string; taskId: string; model: UpdateTaskModel }
            >({
                onQueryStarted: async ({ taskId, model, todolistId }, { dispatch, queryFulfilled, getState }) => {
                    const args = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

                    const patchResults: { undo: () => void }[] = []

                    args.forEach((arg) => {
                        patchResults.push(
                            dispatch(
                                tasksApi.util.updateQueryData(
                                    "getTasks",
                                    { id: todolistId, params: { page: arg.params.page } },
                                    (res) => {
                                        const index = res.items.findIndex((task) => task.id === taskId)
                                        if (index !== -1) {
                                            res.items[index] = { ...res.items[index], ...model }
                                        }
                                    },
                                ),
                            ),
                        )
                    })

                    try {
                        await queryFulfilled
                    } catch (e) {
                        patchResults.forEach((patchResult) => patchResult.undo())
                    }
                },
                query: ({ todolistId, taskId, model }) => ({
                    url: `/todo-lists/${todolistId}/tasks/${taskId}`,
                    method: "PUT",
                    body: model,
                }),
                extraOptions: { dataSchema: taskOperationResponseSchema }, //ZOD 💎
                invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
            }),

            deleteTask: builder.mutation<DefaultResponse, { todolistId: string; taskId: string }>({
                onQueryStarted: async ({ todolistId, taskId }, { dispatch, queryFulfilled, getState }) => {
                    const args = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

                    const patchResults: { undo: () => void }[] = []

                    args.forEach((arg) => {
                        patchResults.push(
                            dispatch(
                                tasksApi.util.updateQueryData(
                                    "getTasks",
                                    { id: todolistId, params: { page: arg.params.page } },
                                    (res) => {
                                        const index = res.items.findIndex((task) => task.id === taskId)
                                        if (index !== -1) {
                                            res.items.splice(index, 1)
                                        }
                                    },
                                ),
                            ),
                        )
                    })

                    try {
                        await queryFulfilled
                    } catch (e) {
                        patchResults.forEach((patchResult) => patchResult.undo())
                    }
                },

                query: ({ todolistId, taskId }) => ({
                    url: `/todo-lists/${todolistId}/tasks/${taskId}`,
                    method: "DELETE",
                }),
                extraOptions: { dataSchema: defaultResponseSchema }, //ZOD 💎
                invalidatesTags: (_result, _error, { todolistId }) => [{ type: "Task", id: todolistId }],
            }),

            changeTaskOrder: builder.mutation<
                DefaultResponse,
                { todolistId: string; taskId: string; putAfterItemId: string | null }
            >({
                query: ({ todolistId, taskId, putAfterItemId }) => ({
                    url: `/todo-lists/${todolistId}/tasks/${taskId}/reorder`,
                    method: "PUT",
                    body: { putAfterItemId },
                }),
                extraOptions: { dataSchema: defaultResponseSchema }, //ZOD 💎

                onQueryStarted: async (
                    { todolistId, taskId, putAfterItemId },
                    { dispatch, queryFulfilled, getState },
                ) => {
                    const args = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")
                    const patchResults: any[] = []

                    args.forEach(({ id, params }) => {
                        if (id === todolistId) {
                            const patchResult = dispatch(
                                tasksApi.util.updateQueryData(
                                    "getTasks",
                                    { id: todolistId, params: { page: params.page } },
                                    (draft) => {
                                        const currentIndex = draft.items.findIndex((task) => task.id === taskId)
                                        if (currentIndex === -1) return

                                        const [movedTask] = draft.items.splice(currentIndex, 1)

                                        if (putAfterItemId === null) {
                                            draft.items.unshift(movedTask)
                                        } else {
                                            const targetIndex = draft.items.findIndex(
                                                (task) => task.id === putAfterItemId,
                                            )
                                            if (targetIndex !== -1) {
                                                draft.items.splice(targetIndex + 1, 0, movedTask)
                                            }
                                        }
                                    },
                                ),
                            )
                            patchResults.push(patchResult)
                        }
                    })

                    try {
                        await queryFulfilled
                    } catch {
                        patchResults.forEach((patchResult) => patchResult.undo())
                    }
                },
            }),
        }
    },
})

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useChangeTaskOrderMutation,
} = tasksApi
