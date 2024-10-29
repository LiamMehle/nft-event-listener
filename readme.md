# Read me

The entry point is `./index.ts`.
run via `npm run start`.
Events are printed into the console and uploaded to a mariadb server at `localhost:3306` with username `root` and password `1234`.

a local MariaDB server can be run using docker by running the following command:

```sh
docker run -it --detach	--name mariadb --env MARIADB_ROOT_PASSWORD=1234	-p 3306:3306 mariadb:latest
```
The server expects a database named `nft` with a table created using the following query:
```sql
    CREATE TABLE `events` (
        `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT 'Record ID. No touchy.',
        `token` BIGINT(20) NOT NULL DEFAULT '0' COMMENT 'Token IDs are 16 byte wide, but are generated sequentially. Realistically there won\'t be that many ShyTokens minted.',
        `eventType` ENUM('TokenMinted','TokenGiven','TokenDestroyed','other') NOT NULL DEFAULT 'other' COLLATE 'utf8mb4_uca1400_ai_ci',
        `previousOwner` CHAR(40) NOT NULL DEFAULT '0' COMMENT 'hex-encoded address of (new) owner withouth \'0x\' prefix.' COLLATE 'utf8mb4_uca1400_ai_ci',
        `newOwner` CHAR(40) NOT NULL DEFAULT '0' COMMENT 'hex-encoded address of (new) owner withouth \'0x\' prefix.' COLLATE 'utf8mb4_uca1400_ai_ci',
        `metadata` LONGTEXT NULL DEFAULT NULL COMMENT 'Optional metadata.' COLLATE 'utf8mb4_bin',
        PRIMARY KEY (`id`) USING BTREE,
        CONSTRAINT `metadata` CHECK (json_valid(`metadata`))
    )
    COMMENT='Shranjevanje podatkov v bazo\r\no Shrani osnovne podatke o NFT-jih (kot so ID, naslov lastnika in metapodatki)\r\nv izbrano bazo (MongoDB, Postgres ali katerokoli drugo).\r\no Če naletiš na težave pri povezavi z bazo ali pa vzame prevec casa, lahko\r\nnapises zgolj kodo, ki prikazuje logiko shranjevanja brez izvedbe.'
    COLLATE='utf8mb4_uca1400_ai_ci'
    ENGINE=InnoDB
    AUTO_INCREMENT=0
;
```

### troubleshooting:
If you encounter the following notice:
```
========= NOTICE =========
Request-Rate Exceeded for InfuraProvider (this message will not be repeated)

The default API keys for each service are provided as a highly-throttled,
community resource for low-traffic projects and early prototyping.

While your application will continue to function, we highly recommended
signing up for your own API keys to improve performance, increase your
request rate/limit and enable other perks, such as metrics and advanced APIs.

For more details: https://docs.ethers.org/api-keys/
==========================
```
you may add an INFURA_API_KEY key to the `./.env` file and set it to your Inufra API key.