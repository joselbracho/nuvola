# nuvola

## Installation

- Clone the repo
- Install all dependecenciese Composer & NPM.

```bash
composer install && npm install
```

- Copy .env.example to .env
- Generate app key
- Edit correct values in .env file

```bash
php artisan key:generate
```

- Run database migration

```bash
php artisan migrate:fresh
```

- Compiling Assets

- for development:

```bash
npm run dev
```
- for production:

```bash
npm run prod
```

- Boot up a server

```bash
php artisan serve
```
