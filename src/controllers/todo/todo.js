const { TodoDB } = require("../../models/todo");

// CURD for todo (adminDashboard)
// create task
exports.createTask = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }

  const role = req.cookies.privilege;
  const uname = req.cookies.username;

  const userid = req.body.userid;

  if (role == "admin") {
    // new user
    const newTask = new TodoDB({
      userid: userid,
      title: req.body.title,
      discription: req.body.discription,
      priority: req.body.priority,
      status: req.body.status,
    });

    // save user in the database
    newTask
      .save()
      .then((data) => {
        res.redirect("/allTodos");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occured while creating a create operation",
        });
      });
  } else {
    // new user
    const newTask = new TodoDB({
      userid: uname,
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
        res.redirect("/userDashboard");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occured while creating a create operation",
        });
      });
  }
};

//get all tasks
exports.getAllTasks = (req, res) => {
  const role = req.cookies.privilege;
  const uname = req.cookies.username;
  const lastlogin = req.cookies.lastlogin;
  console.log(lastlogin);

  if (role == "admin") {
    TodoDB.find()
      .then((tasks) => {
        // console.log(tasks);
        res.render("allTodos", { tasks }); // Render the EJS file with the users data
      })
      .catch((error) => {
        res.status(500).send("Error retrieving tasks"); // Handle the error appropriately
      });
  } else {
    TodoDB.find({ userid: uname })
      .then((tasks) => {
        res.render("userDashboard", { tasks, uname, lastlogin }); // Render the EJS file with the users data
      })
      .catch((error) => {
        res.status(500).send("Error retrieving tasks"); // Handle the error appropriately
      });
  }
};

// edit task
exports.editTask = (req, res) => {
  const id = req.params.id;
  // console.log(id);
  TodoDB.findById(id)
    .then((updatedTask) => {
      res.render("updateTodo", { updatedTask });
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      res.redirect("/");
    });
};

//update tasks
exports.updateTask = (req, res) => {
  const { id } = req.body;
  const { userid, title, discription, priority, status } = req.body;
  // console.log(id);
  TodoDB.findByIdAndUpdate(
    id,
    { userid, title, discription, priority, status },
    { new: true }
  )
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).send("Task not found");
      }
      res.redirect("/allTodos");
    })
    .catch((error) => {
      res.status(500).send("Error updating Task");
    });
};

// delete  task
exports.deleteTask = (req, res) => {
  const { id } = req.params;

  TodoDB.findByIdAndDelete(id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).send("Task not found");
      }
      res.redirect("/allTodos");
    })
    .catch((error) => {
      res.status(500).send("Error deleting task");
    });
};
