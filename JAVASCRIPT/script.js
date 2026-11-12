
// Get registered users
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

// Display inline error
function showError(id, message) {
    const error = document.getElementById(id);
    if (error) error.textContent = message;
}

// Update input color
function setInputState(input, valid) {
    input.classList.toggle("is-valid", valid);
    input.classList.toggle("is-invalid", !valid);
}

// Email validation
function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password validation
function validPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/.test(password);
}


// SHOW / HIDE PASSWORD

document.querySelectorAll(".toggle-btn").forEach(button => {
    button.addEventListener("click", function () {
        const field = document.getElementById(
            this.getAttribute("data-target")
        );

        if (field.type === "password") {
            field.type = "text";
            this.textContent = "Hide";
            this.setAttribute("aria-label", "Hide password");
        } else {
            field.type = "password";
            this.textContent = "Show";
            this.setAttribute("aria-label", "Show password");
        }
    });
});


// SIGNUP FORM

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    const name = document.getElementById("fullname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const city = document.getElementById("city");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    function validateName() {
        const valid = /^[A-Za-z ]+$/.test(name.value.trim());
        showError("nameError",
            valid ? "" : "Please enter a valid full name using alphabets.");
        setInputState(name, valid);
        return valid;
    }

    function validateEmail() {
        const valid = validEmail(email.value.trim());
        showError("emailError",
            valid ? "" : "Please enter a valid email address.");
        setInputState(email, valid);
        return valid;
    }

    function validatePhone() {
        const valid = /^[0-9]{10}$/.test(phone.value.trim());
        showError("phoneError",
            valid ? "" : "Phone number must contain exactly 10 digits.");
        setInputState(phone, valid);
        return valid;
    }

    function validateCity() {
        const valid = /^[A-Za-z ]+$/.test(city.value.trim());
        showError("cityError",
            valid ? "" : "City must contain only alphabets.");
        setInputState(city, valid);
        return valid;
    }

    function validatePassword() {
        const valid = validPassword(password.value);
        showError("passwordError",
            valid ? "" : "Password must have 8 characters, letters and numbers.");
        setInputState(password, valid);

        if (confirmPassword.value.length > 0) {
            validateConfirm();
        }

        return valid;
    }

    function validateConfirm() {
        const valid = confirmPassword.value !== "" &&
            confirmPassword.value === password.value;

        showError("confirmError",
            valid ? "" : "Passwords do not match.");
        setInputState(confirmPassword, valid);
        return valid;
    }

    // Real-time validation
    name.addEventListener("input", validateName);
    email.addEventListener("input", validateEmail);
    phone.addEventListener("input", validatePhone);
    city.addEventListener("input", validateCity);
    password.addEventListener("input", validatePassword);
    confirmPassword.addEventListener("input", validateConfirm);

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const valid =
            validateName() &
            validateEmail() &
            validatePhone() &
            validateCity() &
            validatePassword() &
            validateConfirm();

        const message = document.getElementById("signupMessage");

        if (!valid) {
            message.textContent = "Please correct the errors above.";
            message.className = "message failure";
            return;
        }

        const users = getUsers();

        // Check duplicate email
        const existingUser = users.find(
            user => user.email.toLowerCase() === email.value.trim().toLowerCase()
        );

        if (existingUser) {
            showError("emailError", "This email is already registered.");
            setInputState(email, false);
            message.textContent = "Please use another email address.";
            message.className = "message failure";
            return;
        }

        // Create new user
        const newUser = {
            fullname: name.value.trim(),
            email: email.value.trim().toLowerCase(),
            phone: phone.value.trim(),
            city: city.value.trim(),
            password: password.value
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        message.textContent = "Registration successful! Redirecting...";
        message.className = "message success";

        signupForm.reset();

        setTimeout(() => {
            window.location.href = "signin.html";
        }, 1200);
    });
}

// SIGNIN FORM

const signinForm = document.getElementById("signinForm");

if (signinForm) {

    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    function validateLoginEmail() {
        const valid = validEmail(loginEmail.value.trim());

        showError("loginEmailError",
            valid ? "" : "Please enter a valid email address.");

        setInputState(loginEmail, valid);
        return valid;
    }

    function validateLoginPassword() {
        const valid = loginPassword.value.trim() !== "";

        showError("loginPasswordError",
            valid ? "" : "Password is required.");

        setInputState(loginPassword, valid);
        return valid;
    }

    loginEmail.addEventListener("input", validateLoginEmail);
    loginPassword.addEventListener("input", validateLoginPassword);

    signinForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = document.getElementById("signinMessage");

        const emailValid = validateLoginEmail();
        const passwordValid = validateLoginPassword();

        if (!emailValid || !passwordValid) {
            message.textContent = "Please enter valid login details.";
            message.className = "message failure";
            return;
        }

        const users = getUsers();

        // Find registered user
        const registeredUser = users.find(
            user => user.email === loginEmail.value.trim().toLowerCase()
        );

        if (!registeredUser) {
            message.textContent = "Email is not registered. Please sign up first.";
            message.className = "message failure";
            return;
        }

        // Check password
        if (registeredUser.password !== loginPassword.value) {
            message.textContent = "Incorrect password. Please try again.";
            message.className = "message failure";
            return;
        }

        // Successful authentication
        sessionStorage.setItem("loggedInUser", registeredUser.email);

        message.textContent = "Login successful! Redirecting...";
        message.className = "message success";

        setTimeout(() => {
            window.location.href = "tourist.html";
        }, 1000);
    });
}


// TOURIST PAGE ACCESS PROTECTION

if (window.location.pathname.endsWith("tourist.html")) {

    const loggedInEmail = sessionStorage.getItem("loggedInUser");

    const users = getUsers();

    const currentUser = users.find(
        user => user.email === loggedInEmail
    );

    if (!currentUser) {
        window.location.replace("signin.html");
    } else {
        const welcome = document.getElementById("welcomeMessage");

        if (welcome) {
            welcome.textContent =
                "Welcome, " + currentUser.fullname +
                "! Your next adventure starts here.";
        }
    }
}

// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem("loggedInUser");

        window.location.replace("signin.html");
    });
}
