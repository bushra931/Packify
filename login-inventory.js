document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    console.log("Logging in with:", email, password);

    // ✅ Redirect after login
    window.location.href = "dashboard1.html";
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    console.log("Signing up with:", name, email, password);

    // ✅ Redirect after signup
    window.location.href = "dashboard1.html";
  });
});
