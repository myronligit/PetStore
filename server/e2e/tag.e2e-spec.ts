import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TagDTO } from '../src/service/dto/tag.dto';
import { TagService } from '../src/service/tag.service';

describe('Tag Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId'
    }

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock
    };


    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).overrideGuard(AuthGuard)
        .useValue(authGuardMock)
        .overrideGuard(RolesGuard)
        .useValue(rolesGuardMock)
        .overrideProvider(TagService)
        .useValue(serviceMock)
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all tags ', async () => {

        const getEntities: TagDTO[] = (await request(app.getHttpServer())
        .get('/api/tags')
        .expect(200)).body;

        expect(getEntities).toEqual(entityMock);

    }
    );

    it('/GET tags by id', async () => {


        const getEntity: TagDTO = (await request(app.getHttpServer())
            .get('/api/tags/' + entityMock.id)
            .expect(200)).body;

        expect(getEntity).toEqual(entityMock);

    }
    );

    it('/POST create tags', async () => {

        const createdEntity: TagDTO = (await request(app.getHttpServer())
            .post('/api/tags')
            .send(entityMock)
            .expect(201)).body;

        expect(createdEntity).toEqual(entityMock);

    }
    );

    it('/PUT update tags', async () => {


        const updatedEntity: TagDTO = (await request(app.getHttpServer())
            .put('/api/tags')
            .send(entityMock)
            .expect(201)).body;


        expect(updatedEntity).toEqual(entityMock);

    }
    );

    it('/PUT update tags from id', async () => {


        const updatedEntity: TagDTO = (await request(app.getHttpServer())
            .put('/api/tags/' + entityMock.id)
            .send(entityMock)
            .expect(201)).body;


        expect(updatedEntity).toEqual(entityMock);

    }
    );


    it('/DELETE tags', async () => {


        const deletedEntity: TagDTO = (await request(app.getHttpServer())
            .delete('/api/tags/' + entityMock.id)
            .expect(204)).body;

            expect(deletedEntity).toEqual({});
    }
    );

    afterEach(async () => {
        await app.close();
    });
});

