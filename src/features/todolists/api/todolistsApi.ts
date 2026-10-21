import { baseApi } from "@/app/baseApi"
import { type BaseResponse, type DefaultResponse, defaultResponseSchema } from "@/common/types"
import {
    type CreateTodolistResponse,
    createTodolistResponseSchema,
    type Todolist,
    todolistSchema,
} from "@/features/todolists/api/todolistsApi.types"
import type { DomainTodolist } from "@/features/todolists/lib/types"

export const todolistsApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getTodolists: builder.query<DomainTodolist[], void>({
                query: () => "/todo-lists",
                transformResponse: (todolists: Todolist[]) => todolists.map((tl) => ({ ...tl, filter: "all" })),
                extraOptions: { dataSchema: todolistSchema.array() }, //ZOD 💎
                providesTags: ["Todolist"],
            }),
            addTodolist: builder.mutation<CreateTodolistResponse, string>({
                query: (title) => ({ url: "/todo-lists", method: "POST", body: { title } }),
                extraOptions: { dataSchema: createTodolistResponseSchema }, //ZOD 💎
                invalidatesTags: ["Todolist"],
            }),
            removeTodolist: builder.mutation<DefaultResponse, string>({
                onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                    const patchResult = dispatch(
                        todolistsApi.util.updateQueryData("getTodolists", undefined, (todolists) => {
                            const index = todolists.findIndex((todo) => todo.id === id)
                            if (index !== -1) {
                                todolists.splice(index, 1)
                            }
                        }),
                    )
                    try {
                        await queryFulfilled
                    } catch (e) {
                        patchResult.undo()
                    }
                },
                query: (id) => ({ url: `/todo-lists/${id}`, method: "DELETE" }),
                extraOptions: { dataSchema: defaultResponseSchema }, //ZOD 💎
                invalidatesTags: ["Todolist"],
            }),
            updateTodolistTitle: builder.mutation<DefaultResponse, { id: string; title: string }>({
                query: ({ id, title }) => ({ url: `/todo-lists/${id}`, method: "PUT", body: { title } }),
                extraOptions: { dataSchema: defaultResponseSchema }, //ZOD 💎
                invalidatesTags: ["Todolist"],
            }),
            changeTodolistOrder: builder.mutation<BaseResponse, { todolistId: string; putAfterItemId: string | null }>({
                query: ({ todolistId, putAfterItemId }) => ({
                    url: `todo-lists/${todolistId}/reorder`,
                    method: "PUT",
                    body: { putAfterItemId },
                }),
                extraOptions: { dataSchema: defaultResponseSchema }, //ZOD 💎

                onQueryStarted: async ({ todolistId, putAfterItemId }, { dispatch, queryFulfilled }) => {
                    // Оптимистично меняем порядок прямо в кэше RTK Query
                    const patchResult = dispatch(
                        todolistsApi.util.updateQueryData("getTodolists", undefined, (draft) => {
                            const currentIndex = draft.findIndex((todo) => todo.id === todolistId)
                            if (currentIndex === -1) return

                            const [movedTodolist] = draft.splice(currentIndex, 1)

                            if (putAfterItemId === null) {
                                draft.unshift(movedTodolist)
                            } else {
                                const targetIndex = draft.findIndex((todo) => todo.id === putAfterItemId)
                                if (targetIndex !== -1) {
                                    draft.splice(targetIndex + 1, 0, movedTodolist)
                                }
                            }
                        }),
                    )
                    try {
                        await queryFulfilled
                    } catch {
                        patchResult.undo()
                    }
                },
            }),
        }
    },
})

export const {
    useGetTodolistsQuery,
    useAddTodolistMutation,
    useRemoveTodolistMutation,
    useUpdateTodolistTitleMutation,
    useChangeTodolistOrderMutation,
} = todolistsApi
