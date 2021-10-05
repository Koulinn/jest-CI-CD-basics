import express from "express"
import ProductModel from "./model.js"

const productsRouter = express.Router()

productsRouter.post('/', async (req, res) => {
    // create a new product.
    try {
        const newProduct = new ProductModel(req.body)
        await newProduct.save()
        res.status(201).send(newProduct)
    } catch (error) {
        res.status(400).send(error)
    }
})

productsRouter.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if(product){

            res.status(200).send(product)
        } else {
            res.status(404).send({success: false, msg: `Prod with Id ${req.params.id} not found`})
        }

    } catch (error) {
        res.status(404).send(error)
    }
})

productsRouter.delete('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if(product){
            product.remove()
            res.status(204).send()
        } else {
            res.status(404).send({success: false, msg: `Prod with Id ${req.params.id} not found`})
        }

    } catch (error) {
        res.status(404).send(error)
    }
})

export default productsRouter