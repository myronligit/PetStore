/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { PetStatus } from './enumeration/pet-status';


/**
 * A Pet.
 */
@Entity('pet')
export class Pet extends BaseEntity  {


    @Column({name: "name" })
    name: string;

    @Column({type: 'simple-enum', name: 'status', enum: PetStatus})
    status: PetStatus;


    @ManyToOne(type => Category, category => category.pets)
    category: Category;

    @ManyToMany(type => Tag )
    @JoinTable({
      name: 'rel_pet__tags',
      joinColumn: { name: 'pet_id', referencedColumnName: "id" },
      inverseJoinColumn: { name: 'tags_id', referencedColumnName: "id" }
    })
    tags: Tag[];

    @Column({type: "text", array: true})
    photoUrls: string[]

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
