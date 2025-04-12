# primera-API-express

Nota: Esta creación de una API está fuertemente basada en el repositorio de del curso [Mi-primera-APi](https://github.com/IIC2513/Mi-primera-API) del profesor Antonio Ossa [aaossa](https://github.com/aaossa). Esta se desarrolló usando el framework Express en vez de Koa.

Paso a paso en el desarrollo de una API utilizando [Express](https://expressjs.com/) y [Sequelize](https://sequelize.org/)


## 1. "Hello world"

1. Crear proyecto: 
```bash 
yarn init -y
```

2. Agregar dependencies de Express y similares: 
```bash 
yarn add express morgan
```

3. Crear archivo `src/index.js` con código base:
```bash
mkdir src && touch src/index.js
```

4. Importar Express y Morgan, y creamos un servidor básico:
```javascript
// src/index.js
const express = require('express');
const morgan = require('morgan');

const app = express();

// morgan middleware para mostrar logs de las peticiones HTTP en consola
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
```

5. Agregar dependencia dev Nodemon: 
```bash
yarn add nodemon --dev
```

6. Agregar script en `package.json`:
```diff
{
  ...
  "repository": "https://github.com/IIC2513/primera-API-express",
  "author": "Rodrigo Meza Aranda <rmezaa@uc.cl>",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^5.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```
7. Ejecutar servidor: 
```bash
yarn dev
```

7. Probar servidor en [localhost:3000/](http://localhost:3000/) esperando recibir `"Hello world"`


## 2. El primer router

1. Crear el primer router en `src/routes/movies.js` con código base:
```bash
mkdir src/routes && touch src/routes/movies.js
```

2. Agregar un endpoint básico al router:
```javascript
// src/routes/movies.js
const express = require('express');
const router = express.Router();

// Metodo GET para obtener todas las películas
router.get('/', (req, res) => {
    res.send('GET /movies');
});

// Exportamos el router con los endpoints de películas
module.exports = router;
```

3. Crear el router principal en `src/routes/index.js`, al que se van a conectar los routers de cada recurso:
```javascript
// src/routes/index.js
const express = require('express');
// importamos el router de movies
const moviesRouter = require('./movies');

const router = express.Router();
// Definimos la ruta para las peliculas conectando el router de movies al principal
router.use('/movies', moviesRouter);
// ...
// más routers si hubiesen
// ...


// exportar para usarlo en la app principal
module.exports = router;
```

4. Modificar el servidor inicial en `src/index.js` para que utilice los endpoints alcanzables por medio del router principal:
```javascript
// src/index.js
const express = require('express');
const morgan = require('morgan');

// importamos el router principal 
const router = require('./routes');

const app = express();
app.use(morgan('dev'));

// servidor utiliza el router principal
app.use(router);

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

4. Ejecutar servidor: 
```bash
yarn dev
```

5. Probar servidor en [localhost:3000/movies](http://localhost:3000/movies) esperando recibir `"GET /movies"`


## 3. Configurando Sequelize

1. Agregar dependencies de Sequelize y Postgres: `yarn add sequelize pg pg-hstore`

2. Agregar dependencia dev Sequelize CLI: `yarn add sequelize-cli --dev`

3. Crear carpetas base para Sequelize con el comando: `yarn sequelize-cli init`

4. Mover las carpetas creadas por el comando (`config/`, `migrations/`, `models/`, y `seeders/`) dentro de la carpeta `src/`

5. Crear archivo `.sequelizerc`:
```bash
// .sequelizerc
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'config.json'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
}
```


## 4. Configurando Postgres

1. Instalar, configurar e iniciar Postgres: `sudo service postgresql start`
   En Mac (si usan brew): `brew services start postgresql`

3. Iniciar sesión como el usuario de Postgres: `sudo -i -u postgres`
   (no necesario en Mac)

4. Crear base de datos: `createdb demo_dev` (cambiar "demo_dev" por tu base de datos)

5. Agregar usuario: `createuser aaossa` (cambiar "aaossa" por tu usuario)

6. Crear credenciales y dar permisos a usuario sobre la base de datos:
```bash
psql  # Iniciará la consola de postgres
alter user aaossa with encrypted password 'pwd';
grant all privileges on database demo_dev to aaossa;
alter user aaossa createdb;
exit  # Cerrará la consola de postgres
```

6. Cerrar la sesión del usuario de Postgres (abierta en paso 2): `exit`

Los pasos 2 a 6 deberían resultar en una interacción similar a esta:
```
> sudo -i -u postgres
postgres@LAPTOP-C5PQL48R:~$ createdb demo_dev
postgres@LAPTOP-C5PQL48R:~$ createuser aaossa
postgres@LAPTOP-C5PQL48R:~$ psql
psql (12.16 (Ubuntu 12.16-0ubuntu0.20.04.1))
Type "help" for help.

postgres=# alter user aaossa with encrypted password 'pwd';
ALTER ROLE
postgres=# grant all privileges on database demo_dev to aaossa;
GRANT
postgres=# alter user aaossa createdb;
ALTER ROLE
postgres=# exit
postgres@LAPTOP-C5PQL48R:~$ exit
logout
```

#### Tip: Si quieres verificar que todo está correcto, puedes ingresar a la consola de Postgres y listar las bases de datos y usuarios:
```
sudo -i -u postgres
psql
\l    # Listar bases de datos
\du   # Listar usuarios
\q    # Salir de la consola de Postgres
exit  # Salir del usuario de Postgres
```

7. Actualizar credenciales y datos en archivo `src/config/config.json`:
```json
 {
   "development": {
    "username": "aaossa",
    "password": "pwd",
    "database": "demo_dev",
     "host": "127.0.0.1",
    "dialect": "postgres"
   },
   "test": {
     "username": "root",
     "password": null,
     "database": "database_test",
     "host": "127.0.0.1",
    "dialect": "postgres"
   },
   "production": {
     "username": "root",
     "password": null,
     "database": "database_production",
     "host": "127.0.0.1",
    "dialect": "postgres"
   }
 }
```

8. De ser necesario, crear la base de datos con Sequelize CLI:
```bash
yarn sequelize-cli db:create
```
lanzará este error si ya se creó:
```
ERROR: database "demo_dev" already exists
error Command failed with exit code 1.
```

Para que sequelize cree la db con este comando, no deben haberla creado en la consola de psql, y deben tener los datos de usuario, contraseña y nombre de la database en config.json. Luego veremos que en la práctica, es necesario cambiarlo a config.js, para así cargar un archivo .env con las credenciales (manteniéndolas ocultas, no se deben subir al repositorio)

9. Archivo .env:
    Es un archivo para definir variables que no se deben publicar por temas de seguridad. Además facilita que estos datos se cambien solo una vez en el dotenv en caso de querer cambiar alguno, sin tener que estar cambiándolo en todos los archivos.

Agregamos dependencia de dotenv y creamos el archivo .env en la raíz del proyecto:
```bash
yarn add dotenv && touch .env
```

Es necesario que añadan el .env al .gitignore para no subirlo al repositorio. Acá se subió uno de ejemplo .env.example para que sepan cómo se debe definir, pero en un ambiente real no se sube. 

Debemos cambiar el archivo config/config.json a config/config.js, para poder importar dotenv y acceder a sus variables.
```javascript
require('dotenv').config();

// en este caso usamos solo db de development, ustedes pueden usar distintas para su proyecto

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
  },
  ...
}

```
Como cambiamos la extensión del archivo, debemos actualizarlo en .sequelierc, para que pueda encontrar el archivo con el nuevo path usando .js en vez de .json. 

```bash
// .sequelizerc
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'config.js'), // acá cambia a config.js
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
}
```

(Puede que igual tengan que cambiarlo en el archivo model/index.js si ya lo tenían generado)
```javascript
// models/index.js (linea 9 aprox)
const config = require(__dirname + '/../config/config.js')[env]; // cambiar acá también de config.json a config.js
```
## 5. Creando el primer recurso (Tablas)

1. Creamos el modelo para la clase **Movie** (y su migración) usando Sequelize CLI: 
    - `yarn sequelize-cli model:generate --name Movie --attributes title:string,genre:string,description:string,rating:float`
2. Creamos el modelo para la clase **Review** (y su migración) usando Sequelize CLI:
    - `yarn sequelize-cli model:generate --name Review --attributes comment:string,rating:float,movieId:integer`
3. Modificamos el archivo de migración de la clase Review para asegurarnos que cumple la asociación con la clase Movie, este debe verse así:
```javascript
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT
      },
      movieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Movies', // nombre de la tabla a la que se hace referencia
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};
```
4. Editamos el método static associate del archivo **src/models/movie.js** para que se vea así:
```javascript
// src/models/movie.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      // Una movie tiene muchas reviews
      Movie.hasMany(models.Review, { foreignKey: 'movieId', as: 'reviews' });
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};

```
5. Editamos el método static associate del archivo **src/models/review.js** para que se vea así:
```javascript
// src/models/review.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Una review pertenece a una movie
      Review.belongsTo(models.Movie, { foreignKey: 'movieId', as: 'movie' });
    }
  }
  Review.init({
    comment: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    movieId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};

```
6. Ejecutamos la migración para crear la tabla correspondiente en la DB: 
    - `yarn sequelize-cli db:migrate`

7. Creamos un archivo de *seeds* para la tabla de películas y para la tabla de Reviews:
    - `yarn sequelize-cli seed:generate --name first-movies`
    - `yarn sequelize-cli seed:generate --name seed-reviews`

8. Agregamos nuestras propias *seeds* en los archivos creado:

Movies:

```javascript
// src/seeders/*-first-movies.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Movies', [{
      title: 'Arrival',
      genre: 'Sci-fi/Thriller',
      description: 'Louise Banks, a linguistics expert, along with her team, must interpret the language of aliens who have come to Earth in a mysterious spaceship.',
      rating: 7.9,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Gone Girl',
      genre: 'Thriller/Mystery',
      description: 'Nick Dunne discovers that the entire media focus has shifted on him when his wife, Amy Dunne, mysteriously disappears on the day of their fifth wedding anniversary.',
      rating: 8.1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Movies', null, {});
  }
};
```
Reviews:
```javascript
// src/seeders/{timestamp}-seed-reviews.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Asegúrate de que existan películas antes de insertar reseñas
    await queryInterface.bulkInsert('Reviews', [{
      comment: '¡Excelente película!',
      rating: 9.0,
      movieId: 1, // Asegúrate de que el id 1 exista en Movies
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      comment: 'Pudo haber estado mejor.',
      rating: 6.5,
      movieId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      comment: 'Una obra maestra.',
      rating: 9.5,
      movieId: 2, // Supongamos que existe otra película con id 2
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};

```

9. Agregamos las *seeds* a la base de datos: 
    - `yarn sequelize-cli db:seed:all`

10. Actualizamos el controlador de películas para cargar todas las películas disponibles:
```javascript
// src/routes/movies.js
const express = require('express');
const router = express.Router();

// Importar el modelo Movie creado con sequelize
const { Movie } = require('../models');

// GET /movies
// Ahora tenemos que utilizar async para que espere la respuesta de la base de datos
router.get('/', async (req, res) => {
    // usamos try catch para manejar errores
    try {
        // buscamos todas las peliculas con await para esperar la respuesta
        const movies = await Movie.findAll();
        // enviamos el array de peliculas como respuesta, siempre en formato json y status 200
        res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener las películas' });
    }
});

module.exports = router;
```

11. Ejecutar servidor: 
```
yarn dev
```

12. Probar servidor en [localhost:3000/movies](http://localhost:3000/movies) esperando recibir:
```json
[
  {
    "id": 1,
    "title": "Arrival",
    "genre": "Sci-fi/Thriller",
    "description": "Louise Banks, a linguistics expert, along with her team, must interpret the language of aliens who have come to Earth in a mysterious spaceship.",
    "rating": 7.9,
    "createdAt": "2024-04-16T21:06:05.273Z",
    "updatedAt": "2024-04-16T21:06:05.273Z"
  },
  {
    "id": 2,
    "title": "Gone Girl",
    "genre": "Thriller/Mystery",
    "description": "Nick Dunne discovers that the entire media focus has shifted on him when his wife, Amy Dunne, mysteriously disappears on the day of their fifth wedding anniversary.",
    "rating": 8.1,
    "createdAt": "2024-04-16T21:06:05.273Z",
    "updatedAt": "2024-04-16T21:06:05.273Z"
  }
]
```
13. Podemos agregar un nuevo endpoint para también ver las reseñas de una Movie:
```javascript
// Endpoint para obtener una película y sus reseñas
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          as: 'reviews'
        }
      ]
    });
    if (!movie) return res.status(404).json({ error: 'Película no encontrada' });
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

```
14. Podemos probarlo usando por ejemplo [localhost:3000/movies/1](http://localhost:3000/movies/1), obteniendo la Movie de id 1 con todas sus reseñas.

---

## Eliminado la base de datos

1. Ingresamos al usuario de Postgres: `sudo -i -u postgres`

2. Eliminamos la base de datos: `dropdb demo_dev`

3. Eliminamos al usuario: `dropuser aaossa`

4. Salimos del usuario de Postgres: `exit`

5. Detenemos el servicio de Postgres: `sudo service postgresql stop`
