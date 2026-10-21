import { ResultCode } from "@/common/enums/enums"
import * as z from "zod"

export const fieldErrorSchema = z.object({
    error: z.string(),
    field: z.string(),
})
export type FieldError = z.infer<typeof fieldErrorSchema>

export type BaseResponse<T = unknown> = {
    data: T
    resultCode: ResultCode
    messages: string[]
    fieldsErrors?: FieldError[]
}

export const baseResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        data: schema,
        resultCode: z.enum(ResultCode),
        messages: z.string().array(),
        fieldsErrors: fieldErrorSchema.array(),
    })

export const defaultResponseSchema = baseResponseSchema(z.object({}))
export type DefaultResponse = z.infer<typeof defaultResponseSchema>

export type CaptchaResponse = {
    url: string
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
