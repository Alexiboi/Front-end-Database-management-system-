// Define the behavior when the login buttons are clicked
document.getElementById("employee-login").addEventListener("click", () => {
    // Simulate saving the role to sessionStorage
    sessionStorage.setItem("userRole", "employee");
    sessionStorage.setItem("userId", "1"); // Hardcoded employee ID for now
    alert("Logged in as Employee!");
    // Redirect to the employee directory
    window.location.href = "/workshop/employee_view/employee_directory.html";
  });
  
  document.getElementById("manager-login").addEventListener("click", () => {
    // Simulate saving the role to sessionStorage
    sessionStorage.setItem("userRole", "manager");
    sessionStorage.setItem("userId", "2"); // Hardcoded manager ID for now
    alert("Logged in as Manager!");
    // Redirect to the manager's leave request page
    window.location.href = "/workshop/manager_view/manager_directory.html";
  });
  