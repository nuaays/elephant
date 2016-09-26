'use strict'
/* global describe it before */

const app = require('../server')
const request = require('supertest-as-promised').agent(app.listen())
const user = require('../lib/user')
const co = require('co')
const expect = require('unexpected')
const config = require('../config')

// make sure this user is in the htpasswd file
const testUser = {name: 'test', password: 'test'}

function bearer (token) {
  return function (request) {
    request.set('Authorization', `Bearer ${token}`)
  }
}

['fs', 's3'].forEach(storage => {
  describe(storage, () => {
    before(() => {
      let Storage = require('../lib/storage/' + storage)
      config.storage = new Storage()
    })
    describe('user', () => {
      let token

      describe('/-/whoami (whoami)', () => {
        describe('logged in', () => {
          before(co.wrap(function * () {
            token = yield user.authenticate(testUser)
          }))

          it('returns the username', () => {
            return request.get('/-/whoami')
              .use(bearer(token))
              .accept('json')
              .expect(200)
              .then((res) => expect(res.body.username, 'to equal', 'test'))
          })
        })
        describe('anonymous', () => {
          it('returns 401', () => {
            return request.get('/-/whoami')
              .accept('json')
              .expect(401)
          })
        })
      })

      describe('/-/user/:user (login)', () => {
        describe('valid credentials', () => {
          it('gets the token', () => {
            return request.put('/-/user/test')
              .send({name: 'test', password: 'test'})
              .accept('json')
              .expect(201)
              .then((res) => expect(res.body, 'to have property', 'token'))
          })
        })
        describe('invalid credentials', () => {
          it('returns 401', () => {
            return request.put('/-/user/test')
              .send({name: 'test', password: 'invalid'})
              .accept('json')
              .expect(401)
          })
        })
      })
    })
  })
})
