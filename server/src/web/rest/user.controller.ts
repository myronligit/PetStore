import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor, HttpException, Res,
} from '@nestjs/common';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { UserDTO } from '../../service/dto/user.dto';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../service/user.service';
import { transformPassword } from '../../security';
import {Response} from "express";

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('user-resource')
export class UserController {
    logger = new Logger('UserController');

    constructor(private readonly userService: UserService) {}

    @Get('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get the list of users' })
    @ApiResponse({
        status: 200,
        description: 'List all users',
        type: UserDTO,
    })
    async getAllUsers(@Req() req: Request): Promise<UserDTO[]> {
        const sortField = req.query.sort;
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
        const [results, count] = await this.userService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Post('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create user' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: UserDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createUser(@Req() req: Request, @Body() userDTO: UserDTO): Promise<UserDTO> {
        if (!userDTO.username) {
          throw new HttpException("Please specify username", 400);
        }
        const userOnDb = await this.userService.find({ where: { username: userDTO.username } });
        if (userOnDb) {
          throw new HttpException(`The user ${userDTO.username} has existed`, 400);
        }
        userDTO.login = userDTO.username;
        userDTO.password = userDTO.password ? userDTO.password : userDTO.login;
        await transformPassword(userDTO);
        const created = await this.userService.save(userDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);
        return created;
    }

    @Post('/createWithList')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create users' })
    @ApiResponse({
        status: 201,
        description: 'The records has been successfully created.',
        type: UserDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createMultipleUsers(@Req() req: Request, @Body() userDTOs: UserDTO[]): Promise<UserDTO[]> {
        let options = {where: []};
        userDTOs.forEach(u => {
          u.login = u.username;
          u.password = u.password ? u.password : u.login;
          options.where.push({login:u.login});
        })
        const [results, count] = await this.userService.findAndCount(options);
        if (count > 0) {
          const existUsers = results.map(r => r.username);
          throw new HttpException(`users: ${existUsers} has existed`, 400);
        }
        await Promise.all(userDTOs.map(u => transformPassword(u)));
        const created = await this.userService.saveAll(userDTOs, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.map(c => c.id));
        return created;
    }

    @Post('/createWithArray')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create users' })
    @ApiResponse({
        status: 201,
        description: 'The records has been successfully created.',
        type: UserDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async createMultipleUsersWithArray(@Req() req: Request, @Body() userDTOs: UserDTO[]): Promise<UserDTO[]> {
        return this.createMultipleUsers(req, userDTOs);
    }

    @Put('/:username')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update user' })
    @ApiResponse({
      status: 200,
      description: 'The record has been successfully updated.',
      type: UserDTO,
    })
    async updateUserByName(@Req() req: Request, @Param('username') username: string, @Body() userDTO: UserDTO): Promise<UserDTO> {
      const userOnDb = await this.userService.find({ where: { username: username } });
      if (userOnDb && userOnDb.id) {
        userDTO.id = userOnDb.id;
      } else {
        throw new HttpException(`The user ${username} not found`, 400);
      }
      await transformPassword(userDTO);
      const createdOrUpdated = await this.userService.update(userDTO, req.user?.login);
      HeaderUtil.addEntityUpdatedHeaders(req.res, 'User', createdOrUpdated.id);
      return createdOrUpdated;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update user' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: UserDTO,
    })
    async updateUser(@Req() req: Request, @Body() userDTO: UserDTO): Promise<UserDTO> {
        const userOnDb = await this.userService.find({ where: { login: userDTO.login } });
        let updated = false;
        if (userOnDb && userOnDb.id) {
            userDTO.id = userOnDb.id;
            updated = true;
        } else {
            userDTO.password = userDTO.login;
        }
        await transformPassword(userDTO);
        const createdOrUpdated = await this.userService.update(userDTO, req.user?.login);
        if (updated) {
            HeaderUtil.addEntityUpdatedHeaders(req.res, 'User', createdOrUpdated.id);
        } else {
            HeaderUtil.addEntityCreatedHeaders(req.res, 'User', createdOrUpdated.id);
        }
        return createdOrUpdated;
    }

    @Get('/:login')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Get user' })
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: UserDTO,
    })
    async getUser(@Param('login') loginValue: string): Promise<UserDTO> {
        return await this.userService.find({ where: { login: loginValue } });
    }

    @Delete('/:login')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete user' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
        type: UserDTO,
    })
    async deleteUser(@Req() req: Request, @Param('login') loginValue: string): Promise<UserDTO> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'User', loginValue);
        const userToDelete = await this.userService.find({ where: { login: loginValue } });
        return await this.userService.delete(userToDelete);
    }

    @Post('/logout')
    @ApiOperation({ title: 'logout api' })
    @ApiResponse({
      status: 201,
      description: 'Authorized',
    })
    async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
      const userDTO = await this.userService.find({ where: { username: req.user.username } });
      if (userDTO) {
        return res.json('success');
      }
      return res.json('failed');
    }
}
