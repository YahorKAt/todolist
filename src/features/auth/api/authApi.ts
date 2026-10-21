import { baseApi } from "@/app/baseApi"
import type { BaseResponse, DefaultResponse } from "@/common/types"
import type { LoginInputs } from "@/features/auth/model/schemas"

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            me: builder.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
                query: () => "/auth/me",
            }),
            login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginInputs>({
                query: (body) => ({
                    url: `/auth/login`,
                    method: "POST",
                    body,
                }),
            }),
            logout: builder.mutation<DefaultResponse, void>({
                query: () => ({
                    url: `/auth/login`,
                    method: "DELETE",
                }),
            }),
        }
    },
})

export const { useMeQuery, useLogoutMutation, useLoginMutation } = authApi
