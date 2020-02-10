const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

morgan.token('person', (req) => {
    if (req.method == 'POST') {
        const data = {name: req.body.name, number: req.body.number}
        return JSON.stringify(data)
    }
  })

app.use(express.json()) 
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
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

app.get('/api/persons', (request, response, next) => {
    response.json(persons)
})

app.post('/api/persons', (request, response, next) => {
    const person = request.body
    if (!person.name) {
        return response.status(400).json({ 
            error: 'name missing' 
          })
    } else if (!person.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
    } else if (persons.some(p => p.name === person.name)) {
        return response.status(400).json({ 
            error: 'name already in phonebook' 
          })
    } else {
        person.id = Math.round(Math.random() * 10000)
        persons.push(person)
        response.json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})