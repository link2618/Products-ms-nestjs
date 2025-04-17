import {
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('ProductsService');

    onModuleInit() {
        this.$connect();
        this.logger.log('Database connected');
    }

    create(createProductDto: CreateProductDto) {
        return this.product.create({
            data: createProductDto,
        });
    }

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;

        const totalRecords = await this.product.count({
            where: { available: true },
        });
        const lastPage = Math.ceil(totalRecords / limit);

        return {
            data: await this.product.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    available: true,
                },
            }),
            meta: {
                total: totalRecords,
                page: page,
                lastPage: lastPage,
            },
        };
    }

    async findOne(id: number) {
        const product = await this.product.findFirst({
            where: { id, available: true },
        });

        if (!product) {
            throw new NotFoundException(`Product with id #${id} not found`);
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        // const { id: __, ...data } = updateProductDto;

        await this.findOne(id);

        return this.product.update({
            where: { id },
            // data: data,
            data: updateProductDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        // return this.product.delete({
        //   where: { id }
        // });

        const product = await this.product.update({
            where: { id },
            data: {
                available: false,
            },
        });

        return product;
    }
}
