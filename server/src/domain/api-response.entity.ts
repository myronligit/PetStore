/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { BaseEntity } from './base/base.entity';




/**
 * A ApiResponse.
 */
@Entity('api_response')
export class ApiResponse extends BaseEntity  {

    @Column({type: 'integer' ,name: "code", nullable: true})
    code: number;

    @Column({name: "type", nullable: true})
    type: string;

    @Column({name: "message", nullable: true})
    message: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
