import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
    const logger = new Logger('Main');

    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.NATS,
            options: {
                servers: envs.natsServers,
            },
        },
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen();
    // await app.listen(envs.port);
    // aplicacion hibrida entre http y micro
    // await app.startAllMicroservices();

    logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
