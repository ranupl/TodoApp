// function validateForm() {
//   var username = document.getElementById("username").value;
//   var emailAdd = document.getElementById("emailAdd").value;
//   var password = document.getElementById("password").value;
//   var fname = document.getElementById("fname").value;
//   var lname = document.getElementById("lname").value;
//   var fnameError = document.getElementById("fnameError");
//   var lnameError = document.getElementById("lnameError");
//   var message = document.getElementById("msg");
//   var passMsg = document.getElementById("passMsg");
//   var emailMsg = document.getElementById("emailMsg");

//   // firstname validation
//   if (fname.trim() == "") {
//     fnameError.textContent = "please enter your name";
//     return false;
//   }
//   if (fname.length < 2) {
//     fnameError.textContent =
//       "name should contain two or more than two character";
//     return false;
//   }

//   // lastname validation
//   if (lname.trim() == "") {
//     lnameError.textContent = "please enter yout last name";
//     return false;
//   }
//   if (lname.length < 2) {
//     lnameError.textContent =
//       "lastname should contain two or more than two character";
//     return false;
//   }
  
//   // email validation
//   let checkEmail = 
//     emailAdd.match(
//       /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
//   if (checkEmail == null) {
//     emailMsg.textContent = "invalid email address";
//     return false;
//   }else{
//     emailMsg.textContent =""
//   }

//   // username validation
//   if (username.trim() == "") {
//     message.textContent = "username Required";
//     return false;
//   } else if (username.search(/[0-9]/) == -1) {
//     message.textContent = "username must contain atleast one numeric value";
//     return false;
//   } else if (username.search(/[!\@\#\$\%\^\&\*\(\)\_\+\?\<\>\,]/) !== -1) {
//     message.textContent = "username should not container any special character";
//     return false;
//   } else if (username.search(/[A-Z]/) !== -1) {
//     message.textContent = "username should contain only small letters";
//     return false;
//   } else {
//     message.textContent = "";
//   }

//   // password validation
//   if (password == "") {
//     passMsg.textContent = "**please fill password";
//     return false;
//   } else if (password.length < 5) {
//     passMsg.textContent = "password should be more than 5 characters";
//     return false;
//   } else if (password.length > 20) {
//     passMsg.textContent = "password should be less than 20 characters";
//     return false;
//   } else if (password.search(/[0-9]/) == -1) {
//     passMsg.textContent = "password should container atleast one numeric value";
//     return false;
//   } else if (password.search(/[A-Z]/) == -1) {
//     passMsg.textContent =
//       "password should container atleast one capital alphabate";
//     return false;
//   } else if (password.search(/[a-z]/) == -1) {
//     passMsg.textContent =
//       "password should container atleast one small alphabate";
//     return false;
//   } else if (password.search(/[!\@\#\$\%\^\&\*\(\)\_\+\?\<\>\,]/) == -1) {
//     passMsg.textContent =
//       "password should container atleast one special character";
//     return false;
//   } else {
//     passMsg.textContent = "";
//   }
// }


// login forgot password
//your javascript goes here
  $(document).ready(function () {
    $('#myform').validate({
      rules: {
        firstname: {
          required: true,
          minlength: 2, // Minimum 2 characters for first name
          maxlength: 50 // Maximum 50 characters for first name
        },
        lastname: {
          required: true,
          minlength: 2, // Minimum 2 characters for last name
          maxlength: 50 // Maximum 50 characters for last name
        },
        username: {
          required: true,
          minlength: 4, // Minimum 4 characters for username
          maxlength: 20 // Maximum 20 characters for username
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6 // Minimum 6 characters for password
        }
      },
      messages: {
        firstname: {
          required: 'Please enter your first name.',
          minlength: 'First name must be at least 2 characters long.',
          maxlength: 'First name cannot exceed 50 characters.'
        },
        lastname: {
          required: 'Please enter your last name.',
          minlength: 'Last name must be at least 2 characters long.',
          maxlength: 'Last name cannot exceed 50 characters.'
        },
        username: {
          required: 'Please enter a username.',
          minlength: 'Username must be at least 4 characters long.',
          maxlength: 'Username cannot exceed 20 characters.'
        },
        email: {
          required: 'Please enter an email address.',
          email: 'Please enter a valid email address.'
        },
        password: {
          required: 'Please enter a password.',
          minlength: 'Password must be at least 6 characters long.'
        }
      },
      submitHandler: function (form) {
        // Form submission logic goes here
        alert('Form submitted successfully!');
        // Uncomment the line below to submit the form to the server
        form.submit();
      }
    });
  });
