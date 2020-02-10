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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
})

app.post('/api/persons', (request, response) => {
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


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})