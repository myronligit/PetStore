import { Tag } from '../../domain/tag.entity';
import { TagDTO } from '../dto/tag.dto';


/**
 * A Tag mapper object.
 */
export class TagMapper {

  static fromDTOtoEntity (entityDTO: TagDTO): Tag {
    if (!entityDTO) {
      return;
    }
    let entity = new Tag();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Tag): TagDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new TagDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
