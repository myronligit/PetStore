import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PetDTO }  from '../service/dto/pet.dto';
import { PetMapper }  from '../service/mapper/pet.mapper';
import { PetRepository } from '../repository/pet.repository';

const relationshipNames = ["category", "tags"];


@Injectable()
export class PetService {
    logger = new Logger('PetService');

    constructor(@InjectRepository(PetRepository) private petRepository: PetRepository) {}

      async findById(id: number): Promise<PetDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.petRepository.findOne(id, options);
        return PetMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<PetDTO>): Promise<PetDTO | undefined> {
        const result = await this.petRepository.findOne(options);
        return PetMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<PetDTO>): Promise<[PetDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.petRepository.findAndCount(options);
        const petDTO: PetDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(pet => petDTO.push(PetMapper.fromEntityToDTO(pet)));
            resultList[0] = petDTO;
        }
        return resultList;
      }

      async findByStatus(statuses: string[]): Promise<[PetDTO[], number]> {
        let options = {
          where: [],
          relations: relationshipNames
        };
        statuses.forEach(s => {
          options.where.push({status: s.toUpperCase().trim()})
        });
        const resultList = await this.petRepository.findAndCount(options);
        const petDTO: PetDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(pet => petDTO.push(PetMapper.fromEntityToDTO(pet)));
            resultList[0] = petDTO;
        }
        return resultList;
      }

      async save(petDTO: PetDTO, creator?: string): Promise<PetDTO | undefined> {
        const entity = PetMapper.fromDTOtoEntity(petDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.petRepository.save(entity);
        return PetMapper.fromEntityToDTO(result);
      }

      async update(petDTO: PetDTO, updater?: string): Promise<PetDTO | undefined> {
        const entity = PetMapper.fromDTOtoEntity(petDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.petRepository.save(entity);
        return PetMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.petRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
