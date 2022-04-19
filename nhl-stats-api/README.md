# NHL Stats App backend

## setup
### environmental variables
 | process.env | default |
 | :---------- | :------ |
 | SECRET_KEY | 'development-not-so-secret-key' |
 | PORT | 3001 |
 | NODE_ENV | *(if this variable is anything BUT 'test' or 'development', the software assumes production)* |

### to install databases for the first time in PSQL
**IF YOU ALREADY HAVE DATABASES NAMED `nhl_stats_app` and/or `nhl_stats_app_test`, THIS WILL DROP THOSE DATABASES AND CREATE BLANK ONES WITH THOSE NAMES**
```
psql -f setup.sql
```

### to build tables in databases
**AGAIN, IF THESE DATABASES EXIST ON THIS SERVER, THESE TABLES WILL BE DROPPED AND ALL DATA WITHIN WILL BE LOST**
```
psql -f schema.sql -d nhl_stats_app
psql -f schema.sql -d nhl_stats_app_test
```

### install dependencies
```
npm install
```

### to run server for development
```
nodemon server.js
```

### to run tests
```
npm run test -- --runInBand --watch
```

