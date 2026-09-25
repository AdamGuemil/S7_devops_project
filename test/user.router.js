const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')

chai.use(chaiHttp)

describe('User REST API', () => {
  
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })
  
  after(() => {
    app.close()
    db.quit()
  })

  describe('POST /user', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201)
          chai.expect(res.body.status).to.equal('success')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
    
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
  })

  describe('GET /user/:username', () => {
    
    it('successfully get a user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      
      // 1. On crée l'utilisateur via l'API POST pour être sûr qu'il existe
      chai.request(app)
        .post('/user')
        .send(user)
        .then(() => {
          
          // 2. On tente de le récupérer via l'API GET
          chai.request(app)
            .get(`/user/${user.username}`)
            .then((res) => {
              chai.expect(res).to.have.status(200)
              chai.expect(res.body.status).to.equal('success')
              chai.expect(res).to.be.json
              // On vérifie le contenu de la réponse (ajustez "res.body.msg" selon le format de votre routeur)
              chai.expect(res.body.msg.firstname).to.equal('Sergei')
              chai.expect(res.body.msg.lastname).to.equal('Kudinov')
              done()
            })
            .catch((err) => {
               throw err
            })
        })
        .catch((err) => {
           throw err
        })
    })
    
    it('cannot get a user when it does not exist', (done) => {
      chai.request(app)
        .get('/user/invalid_username')
        .then((res) => {
          // Si l'utilisateur n'existe pas, l'API devrait retourner une erreur (400 ou 404 selon votre implémentation)
          chai.expect(res).to.have.status(400) 
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })

  })
})