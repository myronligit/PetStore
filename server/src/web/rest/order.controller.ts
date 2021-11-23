import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {OrderDTO} from '../../service/dto/order.dto';
import {OrderService} from '../../service/order.service';
import {PetService} from '../../service/pet.service';
import {Page, PageRequest} from '../../domain/base/pagination.entity';
import {AuthGuard, Roles, RolesGuard, RoleType} from '../../security';
import {HeaderUtil} from '../../client/header-util';
import {Request} from '../../client/request';
import {LoggingInterceptor} from '../../client/interceptors/logging.interceptor';
import {PetStatus} from "../../domain/enumeration/pet-status";


@Controller('store')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('orders')
export class OrderController {
  logger = new Logger('OrderController');

  constructor(private readonly orderService: OrderService,
              private readonly petService: PetService) {}


  @Get('/orders')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: OrderDTO,
  })
  async getAll(@Req() req: Request): Promise<OrderDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.orderService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/order/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: OrderDTO,
  })
  async getOne(@Param('id') id: number): Promise<OrderDTO>  {
    return await this.orderService.findById(id);
  }

  @Get('/inventory')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found inventory',
    type: Object,
  })
  async getInventory(): Promise<any>  {
    const [results, count] = await this.petService.findByStatus(['available']);
    return {'available':count};
  }

  @PostMethod('/order')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Create order' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: OrderDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() orderDTO: OrderDTO): Promise<OrderDTO>  {
    if (!orderDTO.petId) {
      throw new HttpException("You must specify a pet", 400);
    }
    const petDTO = await this.petService.findById(orderDTO.petId);
    if (!petDTO) {
      throw new HttpException("The pet is not found", 400);
    }
    if (petDTO.status === PetStatus.SOLD) {
      throw new HttpException("The pet was sold", 400);
    } else if (petDTO.status === PetStatus.PENDING) {
      throw new HttpException("The pet is not on sale", 400);
    }
    const created = await this.orderService.save(orderDTO, req.user?.login);
    petDTO.status = PetStatus.SOLD;
    await this.petService.update(petDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Order', created.id);
    return created;
  }

  @Put('/order')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update order' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: OrderDTO,
  })
  async put(@Req() req: Request, @Body() orderDTO: OrderDTO): Promise<OrderDTO>  {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Order', orderDTO.id);
    return await this.orderService.update(orderDTO, req.user?.login);
  }

  @Put('/order/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update order with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: OrderDTO,
  })
  async putId(@Req() req: Request, @Body() orderDTO: OrderDTO): Promise<OrderDTO>  {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Order', orderDTO.id);
    return await this.orderService.update(orderDTO, req.user?.login);
  }

  @Delete('/order/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Delete order' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Order', id);
    return await this.orderService.deleteById(id);
  }
}
