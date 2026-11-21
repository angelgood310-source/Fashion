// user-page.js - Login, Sign Up & Profile display
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = document.getElementById("loginInput").value.trim();
    localStorage.setItem("userName", val || "Member");
    window.location.href = "user-page.html";
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    localStorage.setItem("userName", name || "New Member");
    localStorage.setItem("userEmail", email || "member@example.com");
    window.location.href = "user-page.html";
  });
}

const profileName = document.getElementById("profileName");
if (profileName) {
  profileName.textContent = localStorage.getItem("userName") || "Guest User";
}

const profileEmail = document.getElementById("profileEmail");
if (profileEmail) {
  profileEmail.textContent = localStorage.getItem("userEmail") || "guest@example.com";
}