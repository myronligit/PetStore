import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { OrderDTO }  from '../service/dto/order.dto';
import { OrderMapper }  from '../service/mapper/order.mapper';
import { OrderRepository } from '../repository/order.repository';

const relationshipNames = [];


@Injectable()
export class OrderService {
    logger = new Logger('OrderService');

    constructor(@InjectRepository(OrderRepository) private orderRepository: OrderRepository) {}

      async findById(id: number): Promise<OrderDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.orderRepository.findOne(id, options);
        return OrderMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<OrderDTO>): Promise<OrderDTO | undefined> {
        const result = await this.orderRepository.findOne(options);
        return OrderMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<OrderDTO>): Promise<[OrderDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.orderRepository.findAndCount(options);
        const orderDTO: OrderDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(order => orderDTO.push(OrderMapper.fromEntityToDTO(order)));
            resultList[0] = orderDTO;
        }
        return resultList;
      }

      async save(orderDTO: OrderDTO, creator?: string): Promise<OrderDTO | undefined> {
        const entity = OrderMapper.fromDTOtoEntity(orderDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.orderRepository.save(entity);
        return OrderMapper.fromEntityToDTO(result);
      }

      async update(orderDTO: OrderDTO, updater?: string): Promise<OrderDTO | undefined> {
        const entity = OrderMapper.fromDTOtoEntity(orderDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.orderRepository.save(entity);
        return OrderMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.orderRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
