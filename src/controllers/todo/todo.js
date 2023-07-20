const { UserDB } = require("../../models/user");
const { TodoDB } = require("../../models/todo");

// CURD for todo (adminDashboard)
// create task
exports.createTask = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }

  const role = req.session.privilege;
  const uname = req.session.username;
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
exports.getAllTasks = async(req, res) => {
  const role = req.session.privilege;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  
  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();
  
  if (role == "admin") {
    TodoDB.find()
      .then((tasks) => {
        res.render("allTodos", { tasks, users, adminUser }); 
      })
      .catch((error) => {
        res.status(500).send("Error retrieving tasks"); 
      });
  } else {
    TodoDB.find({ userid: uname })
      .then((tasks) => {
        res.render("userDashboard", { tasks, uname, lastlogin }); 
      })
      .catch((error) => {
        res.status(500).send("Error retrieving tasks");
      });
  }
};

// edit task
exports.editTask = (req, res) => {
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const id = req.params.id;

  TodoDB.findById(id)
    .then((updatedTask) => {
      res.render("updateTodo", { updatedTask, uname, lastlogin });
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
