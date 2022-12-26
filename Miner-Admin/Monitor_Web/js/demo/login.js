const EMAIL = "admin";
const PASSWORD = "admin";
function login() {
    let email = $("#email").val();
    let pwd = $("#password").val();
    if (email == EMAIL && pwd == PASSWORD) {
        console.log("Login successfull!");
        console.log(window.location.href.split('goto='))
        if (window.location.href.includes("?goto=")) {
            window.location.replace(window.location.href.split('goto=')[1]);
        } else {
            window.location.replace("/index.html")
        }
        save_data(email, pwd);
    } else {
        alert("Email or Password Error!");
    }
}

function router_login() {
    console.log("Router!");
    let email = localStorage.getItem("email");
    let pwd = localStorage.getItem("password");

    if (window.location.href.includes("login.html")) {
        if (email == EMAIL && pwd == PASSWORD) {
            if (window.location.href.includes("?goto=")) {
                window.location.replace(window.location.href.split('goto=')[1]);
            } else {
                window.location.replace("/index.html")
            }
            // window.location.replace("/index.html")
        }
    } else {
        if (email == null || pwd == null) {
            window.location.replace(`/login.html?goto=${window.location.href}`);
        }
    }
}



function save_data(email, pwd) {
    localStorage.setItem("email", email);
    localStorage.setItem("password", pwd);
}

function clear_data() {
    localStorage.clear();
    window.location.replace(`/login.html`);
}

router_login();