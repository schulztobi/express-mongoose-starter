import express, { response } from 'express'
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const server = express()
server.use(express.json())

const Student = mongoose.model('Student', { name: String, age: Number, City: String, graduated: Boolean });


server.get('/students', (req,res)=>{
    Student.find().then((students => res.json(students)))
});

server.get('/students/:studentName',(req,res)=>{
    const { studentName} = req.params;
    Student.find({ name:studentName}).then(student => res.json(student));
});

server.post('/students/:studentName', (req,res) =>{
    const { studentName } = req.params;
    const student = new Student({ name: studentName });
    student.save().then(() => res.json(student))
});

server.patch('/students/:studentName', (req,res) => {
    const { studentName } = req.params;
    const updatedStudent = req.body;
    Student.findOneAndUpdate({ name: studentName},updatedStudent,{ new:true })
    .then(myNewData => res.json(myNewData))
    .catch(error => {
        console.error(error);
        res.json({error: 'an unexpected error occured'})
    })
})

server.delete('/students/:studentName', (req,res) => {
    const { studentName} = req.params
    Student.deleteOne({ name: studentName}).then(updatedStudent => res.json(updatedStudent))
})

const port = 4000

server.listen(port,()=>{
    console.log(`Server is running at http://localhost${port}`)
})