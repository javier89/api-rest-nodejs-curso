const express = require('express');
const Joi =require('joi');

const inicioDebug = require ('debug')('app:inicio');
const dbDebug = require('debug')('app:db'); 

const morgan = require('morgan');
const config = require('config');
// const logger = require('./logger');
const app = express();

app.use(express.json()); //body

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// app.use(logger)

/* app.use(function(res, req, next){
  console.log("Autenticado..");
  next();
}); */

/* ----------------- CONFIG ------------------- */
console.log('Aplicacion' + config.get('name'));
console.log('DB server' + config.get('configDB.host'));

/* -------------------------------------------- */
/* uso de un middleware de terceros morgan */
if (app.get('env')=== 'development'){
  app.use(morgan('tiny'));
  // console.log('Morgan habilitado');
  inicioDebug('Morgan esta habilitado');
}

//Trabajos con la base de datos
dbDebug('Conectando con la base de datos');

const usuarios = [
  {id:1, nombre:'Jose'},
  {id:2, nombre:'Gonzalo'},
  {id:3, nombre: 'Ema'}
];

app.get('/', (req, res)=>{
  res.send('Hello World!')
}) //peticion

app.get('/api/usuarios/', (req, res)=>{
  res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u=>u.id === parseInt(req.params.id));
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

  const schema = Joi.object({
    nombre: Joi.string().min(3).required()
  });

  const {error, value } = schema.validate({ nombre: req.body.nombre });
  if(!error){

    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
  }
  else{
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }
  
}); //envío de datos

app.put('/api/usuarios/:id', (req, res) =>{
  
  //let usuario = usuarios.find(u=>u.id === parseInt(req.params.id));
  let usuario = existeUsuario(req.params.id); // pasamos la Funcion existeUsuario
  
  if(!usuario) 
  {
    res.status(400).send('El usuario no fue encontrado');
    return;
  }
  
  const {error, value} = validarUsuario(req.body.nombre); // pasamos la funcion validarUsuario
  
  if(error){
    const mensaje = eroor.details[0].menssage;
    resizeTo.status(400).send(mensaje);
    return;
  }
  usuario.nombre = value.nombre;
  res.send(usuario);
}) //actualizacion de datos

app.delete('/api/usuarios/:id', (req, res)=>{
  let usuario = existeUsuario(req.params.id);
  if(!usuario){
    res.status(400).send("El usuario no fue encontrado");
    return;
  }
   const index = usuarios.indexOf(usuario);
   usuarios.splice(index, 1);

   res.send(usuario);
}); // elliminacion de datos
//
const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log(`Example app listening on port ${port}`)
});

/* 
Funcion para hacer validaciones si existe el usuario
y no repetir el codigo en cada Middleware
*/
function existeUsuario(id) 
{
  return (usuarios.find(u => u.id === parseInt(id))); 
}

/* 
Funcion para hacer validaciones de usuario
y no repetir el codigo en cada Middleware
*/

function validarUsuario(name)
{
  const schema = Joi.object({
    nombre: Joi.string().min(3).required()
  });
  return (schema.validate({nombre: name}))
}