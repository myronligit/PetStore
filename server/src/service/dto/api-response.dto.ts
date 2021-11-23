/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';




/**
 * A ApiResponseDTO object.
 */
export class ApiResponseDTO extends BaseDTO {

            @ApiModelProperty({description: 'code field', required: false})
        code: number;

            @ApiModelProperty({description: 'type field', required: false})
        type: string;

            @ApiModelProperty({description: 'message field', required: false})
        message: string;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
