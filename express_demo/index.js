// utility of mongodb
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to the Mongodb...'))
    .catch(err => console.error('Can not connect to the Mongodb...'))


// create schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

// create class
const Course = mongoose.model('Course', courseSchema);

// create object
async function createCourse()
{
    // Object
    const course = new Course({
        name: 'course',
        author: 'Yuqing Shou',
        tags: ['node', 'backend'],
        isPublished: true
    });
    const result = await course.save();
    console.log(result);
}

createCourse();


/*
console.log("Start...");
// Pormise
const p = new Promise((resolve, reject) =>{
    setTimeout(() => {
        resolve({
            name:"Yuqing Shou",
            age: 12
        });
    }, 2000);
})
console.log("End...");

p.then((a) =>{
    console.log(a);
    return a;
})
.then((a) =>{
    console.log(a);
});
*/
