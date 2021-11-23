import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PetDTO } from '../src/service/dto/pet.dto';
import { PetService } from '../src/service/pet.service';

describe('Pet Controller', () => {
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
        .overrideProvider(PetService)
        .useValue(serviceMock)
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all pets ', async () => {

        const getEntities: PetDTO[] = (await request(app.getHttpServer())
        .get('/api/pets')
        .expect(200)).body;

        expect(getEntities).toEqual(entityMock);

    }
    );

    it('/GET pets by id', async () => {


        const getEntity: PetDTO = (await request(app.getHttpServer())
            .get('/api/pets/' + entityMock.id)
            .expect(200)).body;

        expect(getEntity).toEqual(entityMock);

    }
    );

    it('/POST create pets', async () => {

        const createdEntity: PetDTO = (await request(app.getHttpServer())
            .post('/api/pets')
            .send(entityMock)
            .expect(201)).body;

        expect(createdEntity).toEqual(entityMock);

    }
    );

    it('/PUT update pets', async () => {


        const updatedEntity: PetDTO = (await request(app.getHttpServer())
            .put('/api/pets')
            .send(entityMock)
            .expect(201)).body;


        expect(updatedEntity).toEqual(entityMock);

    }
    );

    it('/PUT update pets from id', async () => {


        const updatedEntity: PetDTO = (await request(app.getHttpServer())
            .put('/api/pets/' + entityMock.id)
            .send(entityMock)
            .expect(201)).body;


        expect(updatedEntity).toEqual(entityMock);

    }
    );


    it('/DELETE pets', async () => {


        const deletedEntity: PetDTO = (await request(app.getHttpServer())
            .delete('/api/pets/' + entityMock.id)
            .expect(204)).body;

            expect(deletedEntity).toEqual({});
    }
    );

    afterEach(async () => {
        await app.close();
    });
});

