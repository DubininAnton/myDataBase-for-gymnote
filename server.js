const express = require('express');
const mongoose = require("mongoose");
const Exercise = require('./models/exercise');
const corsMiddleware = require('./middlewares/cors-middleware');
const { ObjectId } = require('mongodb');

const PORT = 5100;
const URL = 'mongodb://localhost:27017/gymNoteExercise';

const appDb = express();
appDb.use(corsMiddleware)
appDb.use(express.json());


mongoose
    .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
    })
    .then(()=> console.log('Connected to MongoDb'))
    .catch((e)=>console.log(`DataBase connection error ${e}`))

appDb.listen(PORT, (error)=> {
    error ? console.log(`Error ${error}`) : console.log(`Listen port ${PORT}`);
})


const handleError =(res, error) => {
    res.status(500).json({error});
}

appDb.post('/exercise', (req, res) => {
    const exercise = new Exercise(req.body);

    exercise
        .save()
        .then((result)=> {
            res
                .status(201)
                .json(result)
        })
        .catch(()=>handleError(res, "Something goes wrong..."))
})

/* Записываю новые параметры упражнения в базу данных */
appDb.put('/addNewExercise', (req, res)=> {

    const email= req.body.data.email
    const date = req.body.data.date
    const exercise = req.body.data.exercise
    const weight = req.body.data.weight
    const repetitions = req.body.data.repetitions
    Exercise.findOneAndUpdate(
        {email: email},
        {$push:{data:{date: date, exercise: exercise, weight: weight, repetitions: repetitions}}})
            .then((result)=> {
                res 
                    .status(200)
                    .json(result)
            })
            .catch(()=>handleError(res, "Something goes wrong..."))
})

appDb.post('/getExercises', (req, res) => {
    const email = req.body.email
    Exercise.findOne({email: email})
        .then((result)=> {
                res 
                    .status(200)
                    .json(result.data)
                
            })
        .catch(()=>handleError(res, "Something goes wrong..."))
        
})
    
/* Удаляю упражнение из базы данных используя email для поиска объекта и потом _id объекта с упражнением которое необходимо удалить*/
appDb.put("/deleteExercise", (req, res) => {
        Exercise.updateOne({email:req.body.email},
            {$pull:{data:{_id:req.body.idExercise}}})
                .then((result)=> {
                    res 
                        .status(200)
                        .json(result.data) 
                })
            .catch(()=>handleError(res, "Something goes wrong..."))
    })
        
    

