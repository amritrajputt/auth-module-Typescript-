import Joi from "joi";
import { BaseDto } from "../../common/dto/base.dto.js";

export class regenerateAccessTokenDto extends BaseDto {
    static schema = Joi.object({
        refreshToken: Joi.string().required()
    })
}