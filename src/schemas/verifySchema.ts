import {z} from "zod"

export const verifyCode = z.object({
    code : z.string().length(7,"Verificatiion code must be 6 digits")
})