import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1728474521393 implements MigrationInterface {
    name = 'Auto1728474521393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`nsleft\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`nsright\` int NOT NULL DEFAULT '2'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4bb3fbb86fb58fe2de057ea32a\` ON \`category\` (\`type\`, \`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4bb3fbb86fb58fe2de057ea32a\` ON \`category\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`nsright\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`nsleft\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\` (\`name\`)`);
    }

}
