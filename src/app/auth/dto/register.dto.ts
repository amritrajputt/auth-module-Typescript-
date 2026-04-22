import Joi from "joi";
import { BaseDto } from "../../common/dto/base.dto.js";

export class RegisterDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().required().max(45).min(3),
        lastName: Joi.string().required().max(45).min(3),
    });
}