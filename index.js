require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


morgan.token('person', (req) => {
    if (req.method == 'POST') {
        const data = {name: req.body.name, number: req.body.number}
        return JSON.stringify(data)
    }
  })

app.use(express.json()) 
app.use(express.static('build'))
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
    ]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.reduce((acc, person) => acc + 1, 0)} people</p>
                 <p>${new Date()}</p>`)
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person.toJSON())
          } else {
            response.status(404).end() 
          }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
})

app.post('/api/persons', (request, response, next) => {
    if (!request.body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    } 
    if (!request.body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    } 
    
    const person = new Person({
            name: request.body.name,
            number: request.body.number
          })
          person.save().then(savedPerson => {
            response.json(savedPerson.toJSON())
          })
    })


const errorHandler = (error, request, response, next) => {
    console.error(error.message)  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    }   
    next(error)
}
    
    app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})