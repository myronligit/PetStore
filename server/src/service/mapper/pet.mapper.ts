import { Pet } from '../../domain/pet.entity';
import { PetDTO } from '../dto/pet.dto';


/**
 * A Pet mapper object.
 */
export class PetMapper {

  static fromDTOtoEntity (entityDTO: PetDTO): Pet {
    if (!entityDTO) {
      return;
    }
    let entity = new Pet();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
        entity[field] = entityDTO[field];
    });
    return entity;

  }

  static fromEntityToDTO (entity: Pet): PetDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new PetDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
        entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
