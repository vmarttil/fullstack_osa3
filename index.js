const express = require('express')
const app = express()

const persons = [
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})



const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)