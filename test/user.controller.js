const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')

describe('User', () => {
  
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })

  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      // On crée l'utilisateur une première fois
      userController.create(user, () => {
        // On tente de le recréer et on vérifie que cela renvoie une erreur
        userController.create(user, (err, result) => {
          expect(err).to.not.be.equal(null)
          expect(result).to.be.equal(null)
          done()
        })
      })
    })
  })

  describe('Get', () => {
      
    it('get a user by username', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      
      // 1. On crée d'abord l'utilisateur pour être sûr qu'il existe
      userController.create(user, () => {
        // 2. Ensuite, on le récupère via son username
        userController.get(user.username, (err, result) => {
          expect(err).to.be.equal(null)
          // On vérifie que les données récupérées correspondent bien
          expect(result.firstname).to.be.equal('Sergei')
          expect(result.lastname).to.be.equal('Kudinov')
          done()
        })
      })
    })
  
    it('cannot get a user when it does not exist', (done) => {
      // On cherche un utilisateur qui n'a pas été créé
      userController.get('invalid_username', (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })
  
  })
})