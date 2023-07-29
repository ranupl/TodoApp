// form validation
 $(document).ready(function () {
// password validator
$.validator.addMethod("hasSpecialCharacter", function(value, element) {
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);
}, "Must contain at least one special character.");

$.validator.addMethod("hasNumericValue", function(value, element) {
  return /\d/.test(value);
}, "Must contain at least one numeric value.");

$.validator.addMethod("hasLowerCaseLetter", function(value, element) {
  return /[a-z]/.test(value);
}, "Must contain at least one lowercase letter.");

$.validator.addMethod("hasUpperCaseLetter", function(value, element) {
  return /[A-Z]/.test(value);
}, "Must contain at least one uppercase letter.");


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
          maxlength: 20, // Maximum 20 characters for username
          pattern: /^[a-z0-9]+$/
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6, // Minimum 6 characters for password
          hasSpecialCharacter: true,
          hasNumericValue:true,
          hasLowerCaseLetter: true,
          hasUpperCaseLetter:true
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
          maxlength: 'Username cannot exceed 20 characters.',
          pattern: 'Contain only lowercase letters and numeric digits.'
        },
        email: {
          required: 'Please enter an email address.',
          email: 'Please enter a valid email address.'
        },
        password: {
          required: 'Please enter a password.',
          minlength: 'Password must be at least 6 characters long.',
          hasSpecialCharacter: 'Contain atleat one special character',
          hasNumericValue: 'Contain atleat one numeric value',
          hasLowerCaseLetter: 'Contain atleat one lowercase character',
          hasUpperCaseLetter: 'Contain atleat one uppercase character'
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
