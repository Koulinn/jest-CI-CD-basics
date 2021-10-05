import supertest from "supertest"
import app from "../server.js"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const request = supertest(app)

describe("Testing the testing environment", () => {
    it("should test that true is true", () => {
        expect(true).toBe(true);
    })
})

// Create another test suite
// perform some TDD

describe("Testing the server", () => {
    // make sure there is an endpoint that is a /test endpoint which will return 200 and a JSON object like the following:
    // { message: "Test success" }
    // console.log(process.env.MONGO_PROD_URL, 'PROD URL')

    beforeAll(done => {
        mongoose.connect(process.env.MONGO_PROD_URL)
            .then(() => {
                console.log("Connected to Atlas")
                done()
            }).catch(err=>console.log(err))
    })

    afterAll(done => {
        mongoose.connection.dropDatabase().then(() => {
            console.log("DB dropped")

            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    // function checkResponse(body) {
    //     const expectation = {
    //         message: "Test success",
    //         name: "Name",
    //         age: 50
    //     }

    //     Object.entries(expectation).forEach(([key, value]) => {
    //         expect(body[key]).toBe(value);
    //     })
    // }

    test("should test that the /test endpoint is OK", async () => {
        const response = await request.get('/test')

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Test success")
    })

    it("should test that a /nonexistnt endpoint is returning 404", async () => {
        const response = await request.get('/not-existing')

        expect(response.status).toBe(404)
    })

    const validProduct = {
        name: 'iPhone',
        price: 900
    }

    it("should test that a POST /products is returning us a valid product", async () => {
        const response = await request.post('/products').send(validProduct)

        expect(response.status).toBe(201)
        expect(response.body._id).toBeDefined()

    })

    const invalidProduct = {
        price: 900
    }

    it("should test that a POST /products is returning us an error with an invalid body", async () => {
        const response = await request.post('/products').send(invalidProduct)

        expect(response.status).toBe(400)
        expect(response.body._id).not.toBeDefined()

    })

    it("should test that GET /products endpoint is returning a valid product", async () => {
        const response = await request.post('/products').send(validProduct)

        expect(response.status).toBe(201)
        expect(response.body._id).toBeDefined()

        const idResponse = await request.get('/products/' + response.body._id)
        expect(idResponse.body.name).toEqual(validProduct.name)

        const nonExistingId = '615c536157e11585247c4425'
        const getByIdResponse = await request.get('/products/' + nonExistingId)
        expect(getByIdResponse.status).toBe(404)
    })

    it("should test that DELETE endpoint is returning the right status code", async () => {
       const dummyProd = {
           _id:'615c66eed6d574ead8a13958',
           name: "testProd",
           price: 50
       }
       const response = await request.post('/products').send(dummyProd)

        const getByIdResponse = await request.delete('/products/' + dummyProd._id)
        expect(getByIdResponse.status).toBe(204)
    })

    




})


