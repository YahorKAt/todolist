import { setAppErrorAC } from "@/app/app-slice"
import { z } from "zod"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react"
import { ZodTypeAny } from "zod"

type TBaseQuery = BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    { dataSchema?: ZodTypeAny },
    FetchBaseQueryMeta
>

export const baseQueryWithZodValidation: (baseQuery: TBaseQuery) => TBaseQuery =
    (baseQuery: TBaseQuery) => async (args, api, extraOptions) => {
        const returnValue = await baseQuery(args, api, extraOptions)

        if (returnValue.error) {
            return returnValue
        }

        const zodSchema = extraOptions?.dataSchema

        if (returnValue.data && zodSchema) {
            try {
                zodSchema.parse(returnValue.data)
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.table(error.issues)
                    api.dispatch(setAppErrorAC({ error: "Zod error. Смотри консоль" }))
                }
            }
        }

        return returnValue
    }
