# Spackle

Spackle is a platform for small businesses to share their content and attract new customers.

## Overview

Spackle runs as a web application built with React and TypeScript. All of the frontend code is in the `client/` directory.

On the backend, Spackle is powered by a Node.js server, also using TypeScript, and a PostgreSQL database. The backend code is in the `server/` directory.

## Development Setup

The easiest way to develop Spackle is with Docker:

1. Install the following dependencies:
    - [docker](https://docs.docker.com/get-docker/)
    - [docker-compose](https://docs.docker.com/compose/install/)

2. From the root project directory, run the following commands to install node modules and start up the client, server, and database. The client is served on port 3000 and the server runs on port 8000.

```bash
$ docker-compose run server yarn
$ docker-compose run client yarn
$ docker-compose up
```

Both the client and server watch for changes, and the directories on your machine are mounted into the containers -- so you can edit the files on your machine like normal, and the changes will be reflected.

If you need to run a command inside one of the containers, you can do so:

```bash
docker-compose exec <service> <command> [args...]
```

Here are some examples:

```bash
$ docker-compose exec server yarn add some-node-module # add a node module to the server
$ docker-compose exec client yarn lint # run the linter on the client code
$ docker-compose exec db psql -U spackle # interact directly with the PostgreSQL database
$ docker-compose exec server bash # get a shell inside the server container to run lots of commands
```

> You can also use `docker-compose run` instead of `docker-compose exec` for most commands. `run` creates a new container with the same setup as defined in the `docker-compose.yml` file, whereas `exec` runs the command inside the existing container (this means `exec` won't work if you haven't run `docker-compose up` already). The one exception is to interact with the database -- `docker-compose run db psql` will fail because it will run in a new container that doesn't have `postgres` running.

If you'd like to to run `yarn` commands outside of the Docker containers, that works too, but I'd suggest checking the versions of node and yarn in each of the containers so that you can use the same ones locally:

```bash
$ docker-compose run server node --version
$ docker-compose run server yarn --version
```

If you want to interact with the database you can run the following command.

```bash
$ docker-compose exec db psql --help
```

## Best Practices

- Don't push directly to `master`. Create a branch, push it, and then open a pull request for a team member to review.

- Run the linter before you commit:

    ```bash
    $ docker-compose run server yarn lint --fix
    $ docker-compose run client yarn lint --fix
    ```

- Write tests. (We don't have a testing framework set up yet but will soon!)

- Keep commits small (no unrelated changes) and write [good commit messages](https://chris.beams.io/posts/git-commit/#seven-rules).
