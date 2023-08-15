document.getElementById('forgotPasswordLink').addEventListener('click', () => {
  document.getElementById('forgotPasswordModal').style.display = 'block';
});

document.getElementById('emailForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new URLSearchParams(new FormData(event.target));

  fetch('/adminEmailForm', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "failed") {
        $('#forgot-error').empty().html(data.message)
      } else {
        $('#otp-email').val($('#forgot-email').val());
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('otpModal').style.display = 'block';
      }
    })
    .catch((error) => {
      $('#forgot-error').empty().html('Something went wrong!')
    });
});

document.getElementById('otpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new URLSearchParams(new FormData(event.target));
  fetch('/adminOtpForm', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success") {
        $('#password-email').val($('#otp-email').val());
        document.getElementById('otpModal').style.display = 'none';
        document.getElementById('passwordModal').style.display = 'block';
      } else {
        $('#otp-error').empty().html(data.message)
      }
    })
    .catch((error) => $('#otp-error').empty().html('Something went wrong!'));
});

document.getElementById('passwordForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new URLSearchParams(new FormData(event.target));
  fetch('/adminPasswordEdit', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "failed") {
        $('#password-error').empty().html(data.message)
      } else {
        alert(data.message)
        document.getElementById('passwordModal').style.display = 'none';
      }
    })
    .catch((error) => $('#password-error').empty().html('Something went wrong!'));
});