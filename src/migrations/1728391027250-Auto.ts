import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1728391027250 implements MigrationInterface {
    name = 'Auto1728391027250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('article', 'music', 'video') NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`parentCategoryId\` int NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` timestamp(6) NULL, \`likeCount\` int NOT NULL DEFAULT '0', \`authorId\` int NULL, \`articleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`pic\` text NOT NULL, \`content\` text NOT NULL, \`readCount\` int NOT NULL DEFAULT '0', \`shareCount\` int NOT NULL DEFAULT '0', \`coinCount\` int NOT NULL DEFAULT '0', \`likeCount\` int NOT NULL DEFAULT '0', \`commentCount\` int NOT NULL DEFAULT '0', \`favoriteCount\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` timestamp(6) NULL, \`status\` int NOT NULL DEFAULT '0', \`authorId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`music\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`artist\` varchar(255) NOT NULL, \`album\` varchar(255) NULL, \`duration\` int NULL, \`filePath\` varchar(255) NOT NULL, \`externalId\` varchar(255) NULL, \`genre\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`authorId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`video\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`videoUrl\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, \`deletedAt\` timestamp(6) NULL, \`authorId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uid\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`role\` enum ('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer', \`avatar\` longtext NULL, \`backgroundImage\` longtext NULL, \`bio\` varchar(255) NULL, \`coins\` int NOT NULL DEFAULT '0', \`lastLogin\` timestamp NULL, \`devices\` text NULL, \`level\` enum ('0', '1', '2', '3', '4', '5', '6') NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_df955cae05f17b2bcf5045cc02\` (\`uid\`), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_fans_user\` (\`userId_1\` int NOT NULL, \`userId_2\` int NOT NULL, INDEX \`IDX_8920c1e1632a96bb612fdf5172\` (\`userId_1\`), INDEX \`IDX_ef09b98286f0069964c2851e64\` (\`userId_2\`), PRIMARY KEY (\`userId_1\`, \`userId_2\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_following_user\` (\`userId_1\` int NOT NULL, \`userId_2\` int NOT NULL, INDEX \`IDX_9691163a986dfb589a90dea3d5\` (\`userId_1\`), INDEX \`IDX_a89f5a432c1edcd03a3b655532\` (\`userId_2\`), PRIMARY KEY (\`userId_1\`, \`userId_2\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` (\`id_ancestor\`), INDEX \`IDX_6a22002acac4976977b1efd114\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_9e5435ba76dbc1f1a0705d4db43\` FOREIGN KEY (\`parentCategoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c20404221e5c125a581a0d90c0e\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_a9c5f4ec6cceb1604b4a3c84c87\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_12824e4598ee46a0992d99ba553\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_399110eb8829edc9deecdebc9e7\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`music\` ADD CONSTRAINT \`FK_4a7411899ab5b535ac27d091856\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`video\` ADD CONSTRAINT \`FK_66bcd4be37895e84dfa19c5a812\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`video\` ADD CONSTRAINT \`FK_038baf265a6504529ffb1dcff0f\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_fans_user\` ADD CONSTRAINT \`FK_8920c1e1632a96bb612fdf51722\` FOREIGN KEY (\`userId_1\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_fans_user\` ADD CONSTRAINT \`FK_ef09b98286f0069964c2851e645\` FOREIGN KEY (\`userId_2\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_following_user\` ADD CONSTRAINT \`FK_9691163a986dfb589a90dea3d5f\` FOREIGN KEY (\`userId_1\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_following_user\` ADD CONSTRAINT \`FK_a89f5a432c1edcd03a3b6555321\` FOREIGN KEY (\`userId_2\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_4aa1348fc4b7da9bef0fae8ff48\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_closure\` ADD CONSTRAINT \`FK_6a22002acac4976977b1efd114a\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_6a22002acac4976977b1efd114a\``);
        await queryRunner.query(`ALTER TABLE \`category_closure\` DROP FOREIGN KEY \`FK_4aa1348fc4b7da9bef0fae8ff48\``);
        await queryRunner.query(`ALTER TABLE \`user_following_user\` DROP FOREIGN KEY \`FK_a89f5a432c1edcd03a3b6555321\``);
        await queryRunner.query(`ALTER TABLE \`user_following_user\` DROP FOREIGN KEY \`FK_9691163a986dfb589a90dea3d5f\``);
        await queryRunner.query(`ALTER TABLE \`user_fans_user\` DROP FOREIGN KEY \`FK_ef09b98286f0069964c2851e645\``);
        await queryRunner.query(`ALTER TABLE \`user_fans_user\` DROP FOREIGN KEY \`FK_8920c1e1632a96bb612fdf51722\``);
        await queryRunner.query(`ALTER TABLE \`video\` DROP FOREIGN KEY \`FK_038baf265a6504529ffb1dcff0f\``);
        await queryRunner.query(`ALTER TABLE \`video\` DROP FOREIGN KEY \`FK_66bcd4be37895e84dfa19c5a812\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_4a7411899ab5b535ac27d091856\``);
        await queryRunner.query(`ALTER TABLE \`music\` DROP FOREIGN KEY \`FK_399110eb8829edc9deecdebc9e7\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_12824e4598ee46a0992d99ba553\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_a9c5f4ec6cceb1604b4a3c84c87\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c20404221e5c125a581a0d90c0e\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_9e5435ba76dbc1f1a0705d4db43\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a22002acac4976977b1efd114\` ON \`category_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_4aa1348fc4b7da9bef0fae8ff4\` ON \`category_closure\``);
        await queryRunner.query(`DROP TABLE \`category_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_a89f5a432c1edcd03a3b655532\` ON \`user_following_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_9691163a986dfb589a90dea3d5\` ON \`user_following_user\``);
        await queryRunner.query(`DROP TABLE \`user_following_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_ef09b98286f0069964c2851e64\` ON \`user_fans_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_8920c1e1632a96bb612fdf5172\` ON \`user_fans_user\``);
        await queryRunner.query(`DROP TABLE \`user_fans_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_df955cae05f17b2bcf5045cc02\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`video\``);
        await queryRunner.query(`DROP TABLE \`music\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
    }

}
