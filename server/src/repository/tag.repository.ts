import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../domain/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {}
