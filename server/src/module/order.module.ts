import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../web/rest/order.controller';
import { OrderRepository } from '../repository/order.repository';
import { OrderService } from '../service/order.service';
import {PetModule} from "./pet.module";


@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository]), PetModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
