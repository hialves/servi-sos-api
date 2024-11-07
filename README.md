<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Servi-SOS API is a backend application designed to connect service providers with customers. The platform allows customers to post service requests, receive quotes from service providers, and approve or reject these quotes.

It was an application to send to market, but i decided to drop the project due to the lack of knowledge in entrepeneur and marketing, so i decided to make this repository public.

## Features

- **Service Requests**: Customers can post service requests.
- **Quote Management**: Service providers can offer quotes on service requests, and customers can approve or reject these quotes.
- **Geolocation**: Service providers are notified based on user's location radius

## Installation

1. Clone repository
```bash
$ git clone https://github.com/hialves/servi-sos-api.git
$ cd servi-sos-api
```

2. Install dependencies
```bash
$ pnpm install
```

3. Set up your environment variables:
- Create a `.env` file with the required configurations.

## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm dev

# production mode
$ pnpm prod
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Links

- Author - Hiago A.
- [LinkedIn](https://www.linkedin.com/in/hiago-alves-dev/)
- [GitHub](https://github.com/hialves)
