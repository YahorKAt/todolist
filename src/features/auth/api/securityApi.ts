import { baseApi } from "@/app/baseApi"
import type { CaptchaResponse } from "@/common/types"

export const securityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCaptchaUrl: builder.query<CaptchaResponse, void>({
            query: () => "security/get-captcha-url",
        }),
    }),
})

export const { useLazyGetCaptchaUrlQuery } = securityApi
