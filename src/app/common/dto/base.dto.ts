import Joi from "joi"
export class BaseDto {
    static schema = Joi.object({})
    static validate(data: any) {
        const { error, value } = this.schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,

        })
        if (error) {
            const errorMsg = error.details.map((d) => d.message).join(",")
            return { data: null, error: errorMsg }
        }
        return { data: value, error: null };
    }
}