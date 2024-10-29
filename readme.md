# Read me

The entry point is `./index.ts`.
run via `npm run start`.
Events are printed into the console and uploaded to a mariadb server at `localhost:3306` with username `root` and password `1234`.

a local MariaDB server can be run using docker by running the following command:

```sh
docker run -it --detach	--name mariadb --env MARIADB_ROOT_PASSWORD=1234	-p 3306:3306 mariadb:latest
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