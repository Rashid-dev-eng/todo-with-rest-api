const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");


// =========================================
// CHECK EXISTING LOGIN
// =========================================

const existingToken = localStorage.getItem("token");


if (
    existingToken &&
    (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname.endsWith("signup.html") ||
        window.location.pathname.endsWith("/")
    )
) {

    window.location.href = "dashboard.html";

}


// =========================================
// LOGIN
// =========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const username =
                document.getElementById("username").value.trim();

            const password =
                document.getElementById("password").value;


            message.textContent = "Logging in...";


            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/api/login/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    window.location.href =
                        "dashboard.html";

                } else {

                    message.textContent =
                        data.error || "Login failed.";

                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

}


// =========================================
// SIGNUP
// =========================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const username =
                document.getElementById("username").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;


            // Check password confirmation
            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;

            }


            message.textContent =
                "Creating your account...";


            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/api/register/",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    message.textContent =
                        "Account created successfully. Redirecting to login...";


                    signupForm.reset();


                    setTimeout(
                        function() {

                            window.location.href =
                                "index.html";

                        },
                        1500
                    );

                } else {

                    console.log(data);


                    if (data.username) {

                        message.textContent =
                            data.username[0];

                    } else if (data.email) {

                        message.textContent =
                            data.email[0];

                    } else if (data.password) {

                        message.textContent =
                            data.password[0];

                    } else {

                        message.textContent =
                            "Registration failed.";

                    }

                }

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

}