const Users = require('../users/users-model.js');
const db = require('../database/dbConfig.js');
const Auth = require('../auth/auth-router.js');
const request = require('supertest');
const server = require('../api/server.js');

describe('Auth Router', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })


    it('Should set testing environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });

    //Model testing ----------------------------------------------------------
    describe('Register', () => {
        it('Should add a user to the databas with add()', async () => {

            // Check that the table is empty
            const records = await db('users');
            expect(records).toHaveLength(0);

            //Insert one user
            await Users.add({ username: 'Bobby', password: "B" });

            //Check we now have one record in the table
            const users = await db('users');
            expect(users).toHaveLength(1);


        });
    });

    it('Should add the provided user object to the user DB', async () => {
        let user = await Users.add({ username: 'Benny', password: "ringading" });
        expect(user.username).toBe('Benny');

        user = await Users.add({ username: 'Tyla', password: 'test' });
        expect(user.username).toBe('Tyla');        // Verifying it adds the right name


        const users = await db('users');
        expect(users).toHaveLength(2);

    });

    // Endpoint testing ------------------------------------------------------
    it('Should return json when registering', async () => {
        await request(server)
            .post('/api/auth/register')
            .send({ username: 'Benny', password: "ringading" })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
    });

    it('Should return 201 Status code when registering', async () => {
        await request(server)
            .post('/api/auth/register')
            .send({ username: 'Benny', password: "ringading" })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201);
    });




    // Endpoint testing ------------------------------------------------------
    describe('/Login', () => {

        it('Should return json and HTTP 200 OK status code when logging in', async () => {


            await request(server)
                .post('/api/auth/register')
                .send({ username: 'Benny', password: "ringading" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)


            await request(server)
                .post('/api/auth/login')
                .send({ username: "Benny", password: "ringading" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)  //Should be json
                .expect(200);   //Expect 200 after login


        });

        it('Should welcome the right user when logging in', async () => {


            await request(server)  //Register Benny
                .post('/api/auth/register')
                .send({ username: 'Benny', password: "ringading" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)

            await request(server)
                .post('/api/auth/login')
                .send({ username: "Benny", password: "ringading" })
                .set('Accept', 'application/json')
                .then(res =>{
                    expect(res.body.message).toEqual("Welcome Benny!")   //Correct welcome message on login
                })
        });
    });

});