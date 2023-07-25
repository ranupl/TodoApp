
 function validateForm() {
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var message = document.getElementById("msg");

  if(username.trim() == "")
  {
    message.textContent = "Username Required";
    return false;
  }

 }  
