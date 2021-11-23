import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TagDTO }  from '../service/dto/tag.dto';
import { TagMapper }  from '../service/mapper/tag.mapper';
import { TagRepository } from '../repository/tag.repository';

const relationshipNames = [];
    relationshipNames.push('name');


@Injectable()
export class TagService {
    logger = new Logger('TagService');

    constructor(@InjectRepository(TagRepository) private tagRepository: TagRepository) {}

      async findById(id: number): Promise<TagDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.tagRepository.findOne(id, options);
        return TagMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<TagDTO>): Promise<TagDTO | undefined> {
        const result = await this.tagRepository.findOne(options);
        return TagMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<TagDTO>): Promise<[TagDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.tagRepository.findAndCount(options);
        const tagDTO: TagDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(tag => tagDTO.push(TagMapper.fromEntityToDTO(tag)));
            resultList[0] = tagDTO;
        }
        return resultList;
      }

      async save(tagDTO: TagDTO, creator?: string): Promise<TagDTO | undefined> {
        const entity = TagMapper.fromDTOtoEntity(tagDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.tagRepository.save(entity);
        return TagMapper.fromEntityToDTO(result);
      }

      async update(tagDTO: TagDTO, updater?: string): Promise<TagDTO | undefined> {
        const entity = TagMapper.fromDTOtoEntity(tagDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.tagRepository.save(entity);
        return TagMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.tagRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
