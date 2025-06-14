# name.com dns updater

A simple script that you can run to update name.com DNS records if youre IP changes frequently. This will only update
the `A` records listed under your domain.

- https://www.name.com/support/articles/360007597874-signing-up-for-api-access
- https://docs.name.com/
- https://checkip.amazonaws.com/

### Requirements

- Node 22
- Yarn (automatic with corepack)
- Docker

### Config

Create a file in `./config` or use the default `./config/default.yaml`

```yaml
# name.com username
user: ''

# name.com api token
token: ''

# name.com production or sandbox url
endpoint: ''

# the domain you want to manage
domain: ''
```

### Usage

```
# install dependencies
yarn install

# run locally
yarn start

# build docker image
docker build -t name-dns-update .

# run
docker run --rm name-dns-update
```
