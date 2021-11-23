import { EntityRepository, Repository } from 'typeorm';
import { Pet } from '../domain/pet.entity';

@EntityRepository(Pet)
export class PetRepository extends Repository<Pet> {}
