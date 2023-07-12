const { TodoDB } = require("../../models/todo");

// CURD for todo 
// create task
exports.createTask = (req, res) => {
    // validate request
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty" });
      return;
    }
  
    // new user
    const newTask = new TodoDB({
      title: req.body.title,
      discription: req.body.discription,
      priority: req.body.priority,
      status: req.body.status,
    });
  
    // save user in the database
    newTask
      .save()
      .then((data) => {
        // res.send(data);
        // localStorage.setItem("user", data);
        res.redirect("/userDashboard");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occured while creating a create operation",
        });
      });
  };

//get all tasks
exports.getAllTasks = (req, res) => {
  TodoDB.find()
    .then((tasks) => {
      res.render("userDashboard", { tasks }); // Render the EJS file with the users data
    })
    .catch((error) => {
      res.status(500).send("Error retrieving tasks"); // Handle the error appropriately
    });
};

// get task by id
exports.getTaskById = (req, res) => {
  TodoDB.findById()
    .then((tasks) => {
      // console.log(tasks);
      res.render("userDashboard", { tasks }); // Render the EJS file with the users data
    })
    .catch((error) => {
      res.status(500).send("Error retrieving tasks"); // Handle the error appropriately
    });
};

// edit task
exports.editTask = (req, res) => {
  const id = req.params.id;
  // console.log(id);
  TodoDB.findById(id)
    .then(updatedTask => {
      res.render('updateTodo', { updatedTask });
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      res.redirect('/');
    });
};

//update tasks
exports.updateTask =  (req, res) => {
  const { id } = req.body;
  const { title, discription, priority, status} = req.body;
  // console.log(id);
  TodoDB.findByIdAndUpdate(id, {title, discription, priority, status}, { new: true })
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).send('Task not found');
      }
      res.redirect("/userDashboard");
    })
    .catch((error) => {
      res.status(500).send('Error updating Task');
    });
};

// delete  task
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  TodoDB.findByIdAndDelete(id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).send('Task not found');
      }

      res.redirect("/userDashboard");
    })
    .catch((error) => {
      res.status(500).send('Error deleting task');
    });
};