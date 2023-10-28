const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport');
const connectDb = require('../db')
const { ObjectId } = require('mongodb');
router.get('/',(req,res) => {
    
    if (req.isAuthenticated()) {
        // User is authenticated, render the index template
        const { firstname, lastname } = req.user;
        return res.render('index', { firstname, lastname });
    } else {
        // User is not authenticated, redirect them to the login page
        return res.redirect('/login');
    } 
    // const {firstname,lastname} = {firstname: "asd",lastname: "asd"}
    // return res.render('index',{ firstname, lastname });

})



router.get('/login',(req,res) => {
    
    const successMessage = req.flash('success') || 'Welcome!'; // Default message if no flash message
    const errorMessage = req.flash('error') || 'Something went wrong!'; // Default message if no flash message
    console.log('Success Message:', successMessage);
    console.log('Error Message:', errorMessage);
    res.render('login', { messages: {success: successMessage , error: errorMessage } })
})


router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

//register

router.get('/register',(req,res) => {
    res.render('register')
})

router.post('/register',async(req,res) => {
    try {
        const users = 'users'
        const db = await connectDb()

        const { email, password, confirmpassword } = req.body;
        const userExist = await db.collection(users).findOne({ email: email });
            if (userExist) {
                // User with this email already exists
                req.flash('error', 'Email already exists');
                return res.redirect('/register')
            }else if (password !== confirmpassword ) {
                req.flash('error', 'Password Do not match');
                return res.redirect('/register')
            }
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        await db.collection(users).insertOne({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password:hashedPassword
        })
        req.flash('success', 'You can now login');
        res.redirect('/login')
    }
    catch(error){
        req.flash('error','Error Registering User')
    }
})  

router.get('/logout',(req,res) => {
    req.logout((err) => {
        if (err) {
            // Handle error if there's any issue during logout
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        req.flash("success","Logout Successfully")
        res.redirect('/login'); // Redirect the user to the login page after logout
    });
})
// todo

router.get('/todo',async (req,res) => {
    if (req.isAuthenticated()) {
        // user: req.user ,
    try {
        const db = await connectDb();
        const todos = await db.collection('todos').find({ user: req.user , isDeleted: false ,isDone: false }).toArray();
        
        res.render('todo', { todos: todos });
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
} 

    else {
       
        return res.redirect('/login');
    } 
})

router.get("/deleted", async (req,res) => {
    if (req.isAuthenticated()) {
      
        try {
            const db = await connectDb();
            const todos = await db.collection('todos').find({ user: req.user , isDeleted: true }).toArray();
           
            res.render('deleted', { todos: todos });
        } catch (error) {
            // Handle errors appropriately
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    } 
    
        else {
           
            return res.redirect('/login');
        } 
})


router.get('/completed',async (req,res) => {
    if (req.isAuthenticated()) {
      
        try {
            const db = await connectDb();
            const todos = await db.collection('todos').find({ user: req.user , isDone: true }).toArray();
           
            res.render('completed', { todos: todos });
        } catch (error) {
            // Handle errors appropriately
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    } 
        else {
            return res.redirect('/login');
        } 
})

router.post('/createTodo',async (req,res) => {
    try {
        const todos = "todos"
        const db = await connectDb();

        const {  todoTitle } = req.body;
        const userId = req.user
        console.log(userId)
        const todoData = {
            user: userId,
            todoTitle: todoTitle,
            isDone: false,
            isDeleted: false
        };

        await db.collection(todos).insertOne(todoData);

        // Respond with success message or the created todo object if needed
        req.flash("success","Todo List Added")
        res.redirect("/todo")
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.patch('/delete/:id', async (req, res) => {
    const todoId = req.params.id;
    const db = await connectDb();

    try {
        const collection = db.collection('todos'); // Assuming your collection name is 'todos'
        const result = await collection.updateOne(
            { _id: new ObjectId(todoId) },
            { $set: { isDeleted: true } }
        );

        console.log(result);

        // Handle the result and send appropriate response to the client
        req.flash('success','Todo Successfully Deleted')

        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
    }
});


router.patch('/restore/:id', async (req, res) => {
    const todoId = req.params.id;
    const db = await connectDb();

    try {
        const collection = db.collection('todos'); // Assuming your collection name is 'todos'
        const result = await collection.updateOne(
            { _id: new ObjectId(todoId) },
            { $set: { isDeleted: false } }
        );

        console.log(result);

        // Handle the result and send appropriate response to the client
        req.flash('success','Todo Has Been Restored')
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
    }
});

router.delete('/forceDelete/:id', async (req, res) => {
    const todoId = req.params.id;
    const db = await connectDb();

    try {
        const collection = db.collection('todos'); // Assuming your collection name is 'todos'
        const result = await collection.deleteOne(
            { _id: new ObjectId(todoId) },
        );

        console.log(result);

        // Handle the result and send appropriate response to the client
        req.flash('success','Todo Force Delete Successfull')
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
    }
});


router.patch('/completed/:id', async (req, res) => {
    const todoId = req.params.id;
    const db = await connectDb();

    try {
        const collection = db.collection('todos'); // Assuming your collection name is 'todos'
        const result = await collection.updateOne(
            { _id: new ObjectId(todoId) },
            { $set: { isDone: true } }
        );

        console.log(result);

        // Handle the result and send appropriate response to the client
        req.flash('success', 'Todo Mark as Completed')
        res.status(200).json({ message: 'Todo Mark as Completed' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
    }
});


router.patch('/editTodo/:id',async(req,res) => {
   const {newVal} = req.body
   const todoId = req.params.id;
console.log('this',todoId)
   const db = await connectDb();

   try {
       const collection = db.collection('todos'); // Assuming your collection name is 'todos'
       const result = await collection.updateOne(
           { _id: new ObjectId(todoId) },
           { $set: { todoTitle: newVal } }
       );

       console.log(result);

       // Handle the result and send appropriate response to the client
       req.flash('success', 'Todo updated successfully');
       res.status(200).json({ message: 'Todo updated successfully' });
   } catch (error) {
       console.error('Error updating todo:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   } finally {
   }
})
// mongo passa  = b72BRGr1n2ZCBTlJ
module.exports = router

