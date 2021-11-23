/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';


import { OrderStatus } from '../../domain/enumeration/order-status';


/**
 * A OrderDTO object.
 */
export class OrderDTO extends BaseDTO {

            @ApiModelProperty({description: 'petId field', required: false})
        petId: number;

            @ApiModelProperty({description: 'quantity field', required: false})
        quantity: number;

            @ApiModelProperty({description: 'shipDate field', required: false})
        shipDate: string;

            @ApiModelProperty({ enum: OrderStatus,description: 'status enum field', required: false})
        status: OrderStatus;

            @ApiModelProperty({description: 'complete field', required: false})
        complete: boolean;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
