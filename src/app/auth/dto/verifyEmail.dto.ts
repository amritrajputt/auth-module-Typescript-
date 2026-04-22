import Joi from "joi";
import { BaseDto } from "../../common/dto/base.dto.js";

export class VerifyEmailDto extends BaseDto {
    static schema = Joi.object({
        token: Joi.string().required(),
    });
}