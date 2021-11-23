import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetController } from '../web/rest/pet.controller';
import { PetRepository } from '../repository/pet.repository';
import { PetService } from '../service/pet.service';


@Module({
  imports: [TypeOrmModule.forFeature([PetRepository])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
