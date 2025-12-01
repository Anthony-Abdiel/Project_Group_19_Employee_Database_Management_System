import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "iManagerDb",
    password: "password",
    port: 5432,
});

db.connect();


//server file

import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import {fileURLToPath } from "url";
import {dirname} from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//creating the express app
const app = express();
const PORT = 3000;

//Setting up middleware --------------------------------------------------------


//using JSON format for react compatability
app.use(express.json());

//using express sessions for session management
app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, //CHANGING TO TRUE FOR PRODUCTION CODE
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// custom session verification middleware
function requireLogin(req, res, next) {
    if(!req.session.user) {
        return res.status(401).send("Not Authenticated!");
    }

    next();
}

function requireAdmin(req, res, next) {
    if(!req.session.user || req.session.user.role !== "admin" ) {
        res.status(401).json({error: "Admin Privilleges Required"});
    }

    next();
}

//routes -----------------------------------------------------------------------

//GET - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
app.get("/employees", async (req, res)=>{
    console.log("Recieved Request for Employees List.");

    try {
        //query the database for the employees
        const result = await db.query(`
            SELECT employee_id AS id, name, phone_number, email, salary FROM employees
            `);
        
        console.log(result.rows);
        
        //send the response as JSON data
        res.json(result.rows);

    //catching any errors
    } catch(err) {

        //log the error and send the status code
        console.error(err);
        res.status(500).send("Error Retrieving Employees");

    }
});

//route for user info (Lets the front end know if the user is logged in, and 
// with what privilleges)
app.get("/me", requireLogin, async(req, res)=>{
    //return the username and role
    res.json({
        name: req.session.user.name,
        role: req.session.user.role
    })
});


//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

//PUT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -                                               
// NOTE: AUTH NOT YET IMPLEMENTED
app.put("/employee/:id", async (req, res)=>{
    
    // save the data from the put request into variables
    const employee_id = Number(req.params.id);
    const {name, phone, email, salary} = req.body;

    try {
        //TODO: querying the database for the specified employee

        //TODO: verify that the current employee ID matches the one they're trying to edit OR is admin

        //if verified, continue with the update query
        const result = await db.query(`
            UPDATE employees
            SET name = $1, phone_number = $2, email = $3, salary = $4
            WHERE employee_id = $5
            RETURNING *
            `, [name, phone, email, salary, employee_id]);

        //checking to make sure the employee was found
        if(result.rows.length === 0) {
            return res.status(404).send("Employee not found");
        }

        //log the successful update and send the response as json
        console.log("Employee Updated");
        res.json({success:true, employee: result.rows[0] });

    //catch any errors
    } catch(err) {
        //log the error and send the status code
        console.error(err);
        res.status(500).send("Error Updating Employee");
    }
});
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

//POST- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.post("/employees", async (req, res)=>{

    //save the employee information as variables
    const { name, phone, email, salary} = req.body;

    try {
        //add the new employee to the database
        const result = await db.query(`
            INSERT INTO employees (name, phone_number, email, salary)
            VALUES ($1, $2, $3, $4) RETURNING *`, [name, phone, email, salary]
        );

        //saving the newly created employee to return 
        const newEmployee = result.rows[0];

        //log and and return insert success
        console.log("New Employee Created!");
        res.status(201).json({ success: true, employee: newEmployee});
    
    //catch any errors
    } catch(err) {
        //log the error and send the status code
        console.error(err);
        res.status(500).send("Error Creating Employee");
    }

});

//TODO: New User Post Req
app.post("/signup", async (req, res)=>{



});


//TODO: Login POST route
app.post("/login", async (req, res)=>{

    //extract user_id and password
    const {user_id, password} = req.body;

    //query for the user
    result = db.query(
        "SELECT * FROM users WHERE user_id = $1",
        [user_id]
    );

    const user = result.rows[0];

    //if the user isn't found, either invalid creds or not in DB, send status
    if(!user){
        return res.status(401).json({error: "Invalid Credentials!"});
    }

    //if user is found, attempt a match with the db password
    const match = await bcrypt.compare(password, user.password_hash);

    if(!match) {
        //sending error status if the passwords don't match
        return res.status(401).json({error: "Invalid Credentials!"});
    }

    //save user info on the session: Name, Role, email
    req.session.user = {
        name: user.username,
        role: user.role,
    };

    //return success:true json
    res.json({success: true});
});

//TODO: Logout POST route
app.post("/logout", async (req, res)=>{

    req.session.destroy(err => {
        if(err) {
            console.error("Error Destroying Session: ", err);
            return res.status(500).json({message: "Logout Failed."});
        }
        res.clearCookie("connect.sid");
        res.json({message: "Logged out successfully."});
    });
});

//DELETE- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// NOTE: AUTH NOT YET IMPLEMENTED
app.delete("/employee/:id", async (req, res)=>{

    //saving the specified id as a number, log the deleting request
    const employee_id = Number(req.params.id);
    console.log("DELETING: " + employee_id);

    try {
        //TODO: verify that the deleting user is an admin

        //query the database for the deletion
        const result = await db.query(`
            DELETE FROM employees WHERE employee_id = $1 RETURNING *`,
        [employee_id]
        );

        //verify the user was found and deleted
        if(result.rows.length === 0) {
            return res.status(404).send("Employee not found");
        }

        //log and return successful deletion as json
        console.log("Employee Deleted!");
        res.json({ success: true });

    //catching any errors
    } catch(err) {
        //log the error and send the status code
        console.error(err);
        res.status(500).send("Error Deleting Employee");

    }

});
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.listen( PORT, ()=>{console.log("listening on Port: " + PORT)} );