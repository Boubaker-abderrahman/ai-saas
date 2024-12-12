import * as z from "zod";

export const formScheme = z.object({
    text : z.string().min(1 , {
        message : " text is required"
    })
})