import { DataSource, type EntityTarget, type ObjectLiteral, Repository } from "typeorm";

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {

    constructor(target: EntityTarget<T>, dataSource: DataSource) {
        // super(target, manager, queryRunner)
        super(target, dataSource.createEntityManager());
    }

    async paginated(page: number = 1, limit: number = 10) {

        const skip = (page - 1) * limit;

        const alias = this.metadata.tableName.toLowerCase();

        const [data, total] = await this
            .createQueryBuilder(alias)
            .orderBy(`${alias}.createdAt`, "DESC")
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        console.log(JSON.stringify({
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }))
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

}