const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username) {
      return callback(new Error("Wrong user parameters"), null)
    }

    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }

    // Check if user already exists
    db.exists(user.username, (err, exists) => {
      if (err) return callback(err, null)
      
      if (exists === 1) { // Redis renvoie 1 si la clé existe, 0 sinon
        return callback(new Error("User already exists"), null)
      }

      // Save to DB
      db.hmset(user.username, userObj, (err, res) => {
        if (err) return callback(err, null)
        callback(null, res) // Return callback
      })
    })
  },
  
  get: (username, callback) => {
    if (!username) {
      return callback(new Error("Wrong user parameters"), null)
    }

    // Retrieve user data from DB
    db.hgetall(username, (err, res) => {
      if (err) return callback(err, null)
      
      // hgetall renvoie null (ou un objet vide selon la version du client) si l'utilisateur n'existe pas
      if (!res || Object.keys(res).length === 0) {
        return callback(new Error("User does not exist"), null)
      }

      callback(null, res)
    })
  }
}