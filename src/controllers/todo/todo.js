const { UserDB } = require("../../models/user");
const { TodoDB } = require("../../models/todo");
// const { application } = require("express");
var itemsPerPage = 5;
var totalPages;
var page;

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
        // console.log(data);
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
exports.getAllTasks = async (req, res) => {
  const role = req.session.privilege;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;

  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();

  // pagging + get all tasks
  if (role == "admin") {
    page = parseInt(req.query.page) || 1;

    try {
      const totalItems = await TodoDB.countDocuments({});
      totalPages = Math.ceil(totalItems / itemsPerPage);

      const tasks = await TodoDB.find({})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();

      res.render("allTodos", {
        tasks,
        page,
        totalPages,
        uname,
        users,
        adminUser,
        lastlogin,
        limit: itemsPerPage,
      });
    } catch (err) {
      res.status(500).send("Error retrieving items");
    }
  } else {
    page = parseInt(req.query.page) || 1;

    try {
      const totalItems = await TodoDB.countDocuments({});
      totalPages = Math.ceil(totalItems / itemsPerPage);

      const tasks = await TodoDB.find({ userid: uname })
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();
      res.render("userDashboard", {
        tasks,
        page,
        totalPages,
        uname,
        lastlogin,
        limit: itemsPerPage,
      });
    } catch (err) {
      res.status(500).send("Error retrieving items");
    }
  }
};

// edit task
exports.editTask = (req, res) => {
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const id = req.params.id;

  TodoDB.findById(id)
    .then((tasks) => {
      console.log(tasks);
      res.render("todoEditModel", { tasks, uname, lastlogin });
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      res.redirect("/");
    });
};

//update tasks
exports.updateTask = (req, res) => {
  const { id } = req.params;
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

// Search route
exports.searching = async (req, res) => {
  const searchText = req.query.searchText;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const role = req.session.privilege;
  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();

  if (role == "user") {
    TodoDB.find({ title: { $regex: searchText, $options: "i" } })
      .then((tasks) => {
        res.render("userDashboard", {
          tasks,
          uname,
          lastlogin,
          totalPages,
          page,
          limit: "",
        });
      })
      .catch((err) => console.error("Error searching in MongoDB:", err));
  } else {
    TodoDB.find({ userid: { $regex: searchText, $options: "i" } })
      .then((tasks) => {
        res.render("allTodos", {
          tasks,
          uname,
          lastlogin,
          users,
          adminUser,
          totalPages,
          page,
          limit: "",
        });
      })
      .catch((err) => console.error("Error searching in MongoDB:", err));
  }
};

// get task limit
exports.limitedData = async (req, res) => {
  const searchText = req.query.searchText;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const role = req.session.privilege;
  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();
  const limit = req.body.limit;

  if (role == "admin") {
    try {
      const tasks = await TodoDB.find().limit(limit);
      res.render("allTodos", {
        tasks,
        totalPages,
        page,
        uname,
        adminUser,
        lastlogin,
        users,
        limit,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  } else {
    try {
      const tasks = await TodoDB.find({ userid: uname }).limit(limit);
      res.render("userDashboard", {
        tasks,
        totalPages,
        page,
        uname,
        lastlogin,
        limit,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
};

// filter data by priority
exports.filterByPriority = async (req, res) => {
  const searchText = req.query.searchText;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const role = req.session.privilege;
  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();
  const priority = req.body.priority;
  const status = req.body.status;
  const limit = req.body.limit || 10;
  const skip = (req.body.page - 1) * limit || 0;

  if (role == "admin") {
    try {
      const tasks = await TodoDB.find({ priority })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
      const totalCount = await TodoDB.countDocuments({ status });
      const totalPages = Math.ceil(totalCount / limit);
      res.render("allTodos", {
        tasks,
        totalPages,
        page,
        uname,
        adminUser,
        lastlogin,
        limit,
        users,
        priority,
        status,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  } else {
    try {
      const tasks = await TodoDB.find({ priority, userid: uname })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
      const totalCount = await TodoDB.countDocuments({ status });
      const totalPages = Math.ceil(totalCount / limit);
      res.render("userDashboard", {
        tasks,
        totalPages,
        page,
        uname,
        lastlogin,
        limit,
        priority,
        status,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
};

// filter data by status
exports.filterByStatus = async (req, res) => {
  const searchText = req.query.searchText;
  const uname = req.session.username;
  const lastlogin = req.session.lastlogin;
  const role = req.session.privilege;
  const adminUser = req.session.username;
  const users = await UserDB.find().lean().exec();
  // const limit = req.body.limit;
  const priority = req.body.priority;
  const status = req.body.status;

  const limit = req.body.limit || 10;
  const skip = (req.body.page - 1) * limit || 0;

  if (role == "admin") {
    try {
      const tasks = await TodoDB.find({ status })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
      const totalCount = await TodoDB.countDocuments({ status });
      const totalPages = Math.ceil(totalCount / limit);
      res.render("allTodos", {
        tasks,
        totalPages,
        page,
        uname,
        adminUser,
        lastlogin,
        limit,
        users,
        priority,
        status,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  } else {
    try {
      const tasks = await TodoDB.find({ status, userid: uname })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
      const totalCount = await TodoDB.countDocuments({ status });
      const totalPages = Math.ceil(totalCount / limit);
      res.render("userDashboard", {
        tasks,
        totalPages,
        page,
        uname,
        lastlogin,
        limit,
        status,
        priority,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
};
