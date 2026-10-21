import { z } from "zod/v4"

export const loginSchema = z.object({
    email: z.email("Невалидный email"),
    password: z.string().min(3, "Пароль должен быть больше 3 символов"),
    rememberMe: z.boolean(),
    captcha: z.string().optional(),
})

export type LoginInputs = z.infer<typeof loginSchema>
