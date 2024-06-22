# Proyecto 7 API REST AUTH
### _Rock The Code_
#### Jorge Pirolo

## Objetivos

> - Servidor con express
> - Conexión a una base de datos de Mongo Atlas mediante mongoose
> - Creación de tres modelos, uno de ellos el de users
> - Una semilla que suba datos a una de las colecciones
> - Dos relaciones entre colecciones, la idea es que los usuarios tengan un dato relacionado también
> - CRUD completo de todas las colecciones
> - 2 roles de usuario con diferentes permisos
> - README.md con la documentación del proyecto, indicando los endpoints y que hace cada uno
> - Los usuarios sólo pueden ser creados con rol user
> - Crearemos nuestro primer admin cambiando su rol directamente en la BBDD
> - Los admins pueden modificar a un usuario normal para cambiar su rol y hacerlo admin también
> - Los admins pueden eliminar usuarios, pero un usuario se puede eliminar a si mismo
> - Existe un middleware que compruebe el token que se aporta en la petición para dejar pasar o mostrar un mensaje de error

## Servidor
Servidor levantado con express en la ruta:
```
http://localhost:3000
```
## BBDD
Conectado a BBDD usando la librería mongoose. Puedes encontrar el enlace a Mongo Atlas en la variable `DB_URL` guardada en el `.env`
## Modelos
#### player

```javascript
const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    team: { type: mongoose.Types.ObjectId, ref: 'teams' }
  },
  { timestamps: true, collection: 'players' }
)

const Player = mongoose.model('players', playerSchema, 'players')
```

#### team

```javascript
const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    trophies: { type: Number }
  },
  {
    timestamps: true,
    collection: 'teams'
  }
)

const Team = mongoose.model('teams', teamSchema, 'teams')
```

#### user
En la clave `role` se establece un array de 2 opciones posibles para escoger entre "admin" y "user"
Se utiliza la librería `bcrypt` para encriptar el password previo al guardado
```javascript
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'] },
    team: { type: mongoose.Types.ObjectId, ref: 'teams' }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('users', userSchema, 'users')
```

## Semilla

En la carpeta `seeds` dentro de `utils` encontraras la función asíncrona `lanzar semilla` que inserta datos en la colección "team"
```javascript
const lanzarSemilla = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    await Team.collection.drop()
    console.log('Equipos eliminados')

    await Team.collection.insertMany(teams)
    console.log('Equipos incluidos')

    await mongoose.disconnect()
    console.log('Desconectado de la BBDD')
  } catch (error) {
    console.log('Error al plantar la semilla 🪴❌')
  }
}
```

## Relación entre modelos
> 1. El modelo player esta relacinado en su `key` `team` con el modelo team
> 2. El modelo user esta relacionado en su `key` `team` con el modelo team

## CRUD de player

#### GET
Consulta todos los jugadores en la BBDD y _"expande"_ la información de su clave `team`
```javascript
const getPlayers = async (req, res, next) => {
  try {
    const players = await Player.find().populate('team')
    return res.status(200).json(players)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

#### GET
Consulta un jugador por su ID en la BBDD y _"expande"_ la información de su clave `team`
```javascript
const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params
    const player = await Player.findById(id).populate('team')
    return res.status(200).json(player)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

#### GET
Consulta un jugador por el ID de su team en la BBDD y _"expande"_ la información de su clave `team`
```javascript
const getPlayersByTeamId = async (req, res, next) => {
  try {
    const { id } = req.params
    const players = await Player.find({ team: id }).populate('team')
    return res.status(200).json(players)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

#### POST
Publica una nuevo jugador obteniendo los datos mediante el `body` de la `req`
```javascript
const addPlayer = async (req, res, next) => {
  try {
    const newPlayer = new Player(req.body)
    const playerSaved = await newPlayer.save()
    return res.status(201).json(playerSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```


#### PUT (Update)
Actualiza un jugador (recogido mediante el `id` por los `params`)
```javascript
const updatePlayer = async (req, res, next) => {
  try {
    const { id } = req.params
    const newPlayer = new Player(req.body)
    newPlayer._id = id

    const playerUpdated = await Player.findByIdAndUpdate(id, newPlayer, {
      new: true
    })

    return res.status(200).json(playerUpdated)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

#### DELETE
Elimina un jugador recogido por el `id` en los `params`
```javascript
const deletePlayer = async (req, res, next) => {
  try {
    const { id } = req.params
    const playerDeleted = await Player.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'Jugador eliminado',
      elemento: playerDeleted
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}
```




## CRUD de team

### GET
Consulta todos los equipos en la BBDD
```javascript
const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
    return res.status(200).json(teams)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

### GET
Consulta un equipo por su ID en la BBDD
```javascript
const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params
    const team = await Team.findById(id)
    return res.status(200).json(team)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```
### POST
Publica un nuevo equipo obteniendo los datos mediante el `body` de la `req`
```javascript
const addTeam = async (req, res, next) => {
  try {
    const newTeam = new Team(req.body)
    const teamSaved = await newTeam.save()
    return res.status(201).json(teamSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

### PUT (Update)
Actualiza un equipo (recogido mediante el `id` por los `params`)
> Los datos actualizados son recogidos en el `body` de la `req`
```javascript
const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const newTeam = new Team(req.body)
    newTeam._id = id

    const teamUpdated = await Team.findByIdAndUpdate(id, newTeam, { new: true })

    return res.status(200).json(teamUpdated)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```
### DELETE
Elimina un equipo recogido por el `id` en los `params`
```javascript
const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const teamDeleted = await Team.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'Equipo eliminado',
      elemento: teamDeleted
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}
```


## CRUD de user

### GET
Consulta todos los users en la BBDD
```javascript
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

### POST / REGISTER
Registra un nuevo usuario
> **Siempre especifica su rol "user" ya que solo se pueden registrar con este rol**
> Verifica si el email está duplicado

```javascript
const register = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    })

    const emailDuplicated = await User.findOne({ email: req.body.email })

    if (emailDuplicated) {
      return res
        .status(400)
        .json('El email que has indicado ya está registrado')
    }

    const userSaved = await newUser.save()

    return res.status(201).json(userSaved)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```
### POST / LOGIN
> Busca en la BBDD si existe un usuario con ese email
> Si existe, encripta el password para compararlo con el de la BBDD utilizando la librería `bcrypt`
> Genera un token utilizando la librería `jsonwebtoken` y muestra el usuario logueado + token
```javascript
const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //! lo que pasa cuando te logueas con jsonwebtoken
        const token = generateSign(user._id)

        return res.status(200).json({ user, token })
      } else {
        return res.status(400).json('El email o el password son incorrectos')
      }
    } else {
      return res.status(400).json('El email o el password son incorrectos')
    }
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

### PUT (Update)
Actualiza el rol de un usuario (recogido mediante el `id` por los `params`)
> Los datos actualizados son recogidos en el `body` de la `req`
> Utiliza el `runValidators: true` para que solo pueda escoger entre "admin" y "user" establecido previamente en el modelo user
```javascript
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const newRole = req.body
    const userUpdated = await User.findByIdAndUpdate(id, newRole, {
      new: true,
      runValidators: true
    })
    return res.status(200).json(userUpdated)
  } catch (error) {
    return res.status(400).json(error)
  }
}
```
### DELETE
Elimina un usuario recogido por el `id` en los `params`
```javascript
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userDeleted = await User.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Usuario eliminado',
      userDeleted
    })
  } catch (error) {
    return res.status(400).json(error)
  }
}
```

## ROUTES
Utilizamos mediante express las siguientes rutas
### player
```javascript
app.use('/api/v1/players', playersRouter)  // en el index.js

const playersRouter = require('express').Router()

playersRouter.get('/', getPlayers)
playersRouter.get('/:id', getPlayerById)
playersRouter.get('/byteam/:id', getPlayersByTeamId)
playersRouter.post('/', addPlayer)
playersRouter.put('/:id', updatePlayer)
playersRouter.delete('/:id', deletePlayer)
```
### team
```javascript
app.use('/api/v1/teams', teamsRouter) // en el index.js

const teamsRouter = require('express').Router()

teamsRouter.get('/', getTeams)
teamsRouter.get('/:id', getTeamById)
teamsRouter.post('/', addTeam)
teamsRouter.put('/:id', updateTeam)
teamsRouter.delete('/:id', deleteTeam)
```

### user
 _Se explican los middlewares a continuación_
> Para visualizar los usuarios es necesario que estés logueado
>> **Para eliminar un usuario hay 2 opciones: eliminar tu mismo usuario o tener el rol "admin"**
>>> **Para actualizar el rol de otro usuario debes tener el rol "admin"**

```javascript
app.use('/api/v1/users', userRoutes) // en el index.js

const userRoutes = require('express').Router()

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/', [isAuth], getUsers)
userRoutes.delete('/:id', [sameUser], [isAdmin], deleteUser)
userRoutes.put('/:id', [isAdmin], updateUser)
```

## MIDDLEWARES
### isAuth
Comprueba que el token que se aporta en la petición `req.headers.authorization` coincide con un token generado previamente por nuestro "password `JWT_SECRET`" que se puede encontrar en el `.env`
```javascript
const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('No estás autorizado rey')
    }

    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)

    user.password = null
    req.user = user
    next()
  } catch (error) {
    return res.status(400).json('No estás autorizado rey')
  }
}
```

### sameUser
Comprueba que el token que se aporta en la petición `req.headers.authorization` coincide con un token generado previamente por nuestro "password `JWT_SECRET`" que se puede encontrar en el `.env`
> Adicionalmente, compara que el usuario que esta enviando la petición sea el mismo al que se le quiere aplicar una función
> Lo compara destructurando el `id` en el token y comparandolo con el de params (elemento afectado)
>>> **Si son iguales, la función llama directamente al controlador `deleteUser` ya que un usuario se puede eliminar a si mismo**


```javascript
const sameUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('No hay token')
    }

    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)

    if (id === req.params.id) {
      user.password = null
      req.user = user
      return deleteUser(req, res, next)
    } else {
      next()
    }
  } catch (error) {
    return res.status(400).json('No estás autorizado rey')
  }
}
```

### isAdmin
Comprueba que el token que se aporta en la petición `req.headers.authorization` coincide con un token generado previamente por nuestro "password `JWT_SECRET`" que se puede encontrar en el `.env`
> Adicionalmente, comprueba que el usuario que genera la petición tenga el rol de "admin" para continuar con el controlador
```javascript
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('No hay token')
    }

    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)

    if (user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res
        .status(400)
        .json(
          'No estás autorizado para realizar estos cambios. Contacta con tu administrador.'
        )
    }
  } catch (error) {
    return res.status(400).json('No estás autorizado rey')
  }
}
```


## CONFIG
Utilizado en el controlador `login` de user. Mediante la librería `jsonwebtoken` generamos el token enviándole el id del usuario, el password JWT_SECRET y el tiempo en que expirará el token, en este caso 30 días.
```javascript
const generateSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}
```
Utilizado en los middlewares `isAuth` `sameUser` e `isAdmin` para verificar la autenticidad de los usuarios que realizan peticiones.
Verificamos que el token suministrado por el usuario es auténtico y fue generado utilizando nuestro JWT_SECRET
```javascript
const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
```
