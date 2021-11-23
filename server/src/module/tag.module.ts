import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from '../web/rest/tag.controller';
import { TagRepository } from '../repository/tag.repository';
import { TagService } from '../service/tag.service';


@Module({
  imports: [TypeOrmModule.forFeature([TagRepository])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
