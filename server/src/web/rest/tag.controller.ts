import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TagDTO } from '../../service/dto/tag.dto';
import { TagService } from '../../service/tag.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard,  Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';


@Controller('api/tags')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('tags')
export class TagController {
  logger = new Logger('TagController');

  constructor(private readonly tagService: TagService) {}


  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TagDTO,
  })
  async getAll(@Req() req: Request): Promise<TagDTO []>  {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tagService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TagDTO,
  })
  async getOne(@Param('id') id: number): Promise<TagDTO>  {
    return await this.tagService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Create tag' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TagDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tagDTO: TagDTO): Promise<TagDTO>  {
    const created = await this.tagService.save(tagDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Tag', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update tag' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TagDTO,
  })
  async put(@Req() req: Request, @Body() tagDTO: TagDTO): Promise<TagDTO>  {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Tag', tagDTO.id);
    return await this.tagService.update(tagDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Update tag with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TagDTO,
  })
  async putId(@Req() req: Request, @Body() tagDTO: TagDTO): Promise<TagDTO>  {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Tag', tagDTO.id);
    return await this.tagService.update(tagDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ title: 'Delete tag' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void>  {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Tag', id);
    return await this.tagService.deleteById(id);
  }
}
