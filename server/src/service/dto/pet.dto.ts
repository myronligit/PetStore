/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { CategoryDTO } from './category.dto';
import { TagDTO } from './tag.dto';
import { PetStatus } from '../../domain/enumeration/pet-status';


/**
 * A PetDTO object.
 */
export class PetDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiModelProperty({description: 'name field'})
        name: string;

            @ApiModelProperty({ enum: PetStatus,description: 'status enum field', required: false})
        status: PetStatus;


        @ApiModelProperty({ type: CategoryDTO,description: 'category relationship'})
        category: CategoryDTO;

         @ApiModelProperty({ type: TagDTO, isArray: true,description: 'tags relationship'})
        tags: TagDTO[];

        @IsNotEmpty()
        @ApiModelProperty({description: 'photo urls'})
        photoUrls: string[]

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
