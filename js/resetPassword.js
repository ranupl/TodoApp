// <!-- public/js/resetPassword.js -->

// Show the "Forgot Password" modal when the link is clicked
document.getElementById('forgotPasswordLink').addEventListener('click', () => {
    document.getElementById('forgotPasswordModal').style.display = 'block';
  });
  
  // Handle the email form submission using AJAX
  document.getElementById('emailForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new URLSearchParams(new FormData(event.target));
    fetch('/emailForm', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.error) {
          // Display error message in the same modal
          document.getElementById('emailForm').insertAdjacentHTML('beforeend', `<p>${data.message}</p>`);
        } else {
          // Hide the email form modal and show the OTP form modal
          document.getElementById('forgotPasswordModal').style.display = 'none';
          document.getElementById('otpModal').style.display = 'block';
        }
      })
      .catch((error) => console.error('Error submitting email form:', error));
  });
  
  // Handle the OTP form submission using AJAX
  document.getElementById('otpForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new URLSearchParams(new FormData(event.target));
    fetch('/otpForm', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.error) {
          // Display error message in the same modal
          document.getElementById('otpForm').insertAdjacentHTML('beforeend', `<p>${data.message}</p>`);
        } else {
          // Hide the OTP form modal and show the password form modal
          document.getElementById('otpModal').style.display = 'none';
          document.getElementById('passwordModal').style.display = 'block';
        }
      })
      .catch((error) => console.error('Error submitting OTP form:', error));
  });
  
  // Handle the password form submission using AJAX
  document.getElementById('passwordForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new URLSearchParams(new FormData(event.target));
    fetch('/passwordEdit', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.error) {
          // Display error message in the same modal
          document.getElementById('passwordForm').insertAdjacentHTML('beforeend', `<p>${data.message}</p>`);
        } else {
          // Hide the password form modal and show the success message modal
          document.getElementById('passwordModal').style.display = 'none';
          document.getElementById('successModal').style.display = 'block';
        }
      })
      .catch((error) => console.error('Error submitting password form:', error));
  });
  
