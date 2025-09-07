document.addEventListener("DOMContentLoaded", function() {
  
        const logoutLinks =[
            ...document.querySelectorAll(".logout-btn"),
            ...document.querySelectorAll("a[href='/logout']")
        ];
    
        if (logoutLinks.length > 0) {
            logoutLinks.forEach(link => {
                link.addEventListener("click", function (event) {
                    event.preventDefault(); // Prevent default navigation
                    logoutUser();   
                });
            });
        } 
    
    // ✅ Global Logout Function
    function logoutUser() {
        console.log("🔄 Logging out...");
    
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("🔐 No token found, redirecting...");
            window.location.href = "../Login/signin.html";
            return;
        }
    
        fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(() => {
            // Remove all authentication-related data
            localStorage.removeItem("token");
            localStorage.removeItem("userType");
            localStorage.removeItem("Vid");
            localStorage.removeItem("username");
            localStorage.clear()
    
            console.log("✅ User logged out successfully.");
            window.location.href = "../Login/signin.html"; // Redirect to login page
        })
        .catch(error => console.error("❌ Logout Error:", error));
    }
    
    const toggleBtn = document.getElementById("themeToggle");
    const body = document.body;

    // Check previous theme from localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.setAttribute("data-theme", "dark");
    } else {
        body.setAttribute("data-theme", "light");
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            let currentTheme = body.getAttribute("data-theme");

            if (currentTheme === "dark") {
                body.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
            } else {
                body.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
            }
        });
    }
});


// -------------------Global Authentication Check-------------------
// ✅ Check if user is authenticated
const token = localStorage.getItem("token");

    const currentPage = window.location.pathname;
    if (!token) {
        if (!currentPage.includes("signin.html") && !currentPage.includes("index.html")) {
            console.warn("🔄 Redirecting to signin...")
            alert("🔄 Redirecting to signin...");
            window.location.href = "../Login/signin.html";
        }

    if(token){
        fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(user => {
            // ✅ Save user info to localStorage
            localStorage.setItem("userType", user.userType);
        console.log("🔄 already you login ...")
        alert("🔄 Allready logged. Redirecting to Profile...");
         setTimeout(() => {
            if (user.userType === "admin") {
                window.location.href = `/Public/Admin/profile.html?admin=${encodeURIComponent(user.username)}&Vid=${encodeURIComponent(user.Vid)}`;
            } else if (user.userType === "teacher" || user.userType === "student") {
                window.location.href = `/Public/Student/profile.html?username=${encodeURIComponent(user.username)}&Vid=${encodeURIComponent(user.Vid)}`;
            }
        }, 2000);
    })
    }
    
        // throw new Error("❌ Authentication token is missing!");
    }
    // ✅ Fetch user data from backend
// -------------------dark----------------

const darkModeLinks = document.querySelectorAll(".dark"); // ✅ Saare .dark elements ko select karo
const body = document.body;
const darkModeText = document.querySelector('.dark span'); // ✅ Text ko target karo

// ✅ Dark mode preference ko check karo
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    darkModeText.textContent = 'light_mode';
} 

// ✅ Har ek `.dark` element ke liye loop lagao
darkModeLinks.forEach(darkModeLink => {
    darkModeLink.addEventListener('click', (event) => {
        event.preventDefault();

        if (body.classList.contains('dark-mode')) {
            // ✅ Dark mode ko disable karo
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            darkModeText.textContent = 'dark_mode';

            // ✅ Saare `.dark` ke andar ke text ko update karo
            darkModeLinks.forEach(link => {
                const listItem = link.querySelector('li:nth-child(6)');
                if (listItem) listItem.textContent = "Dark mode";
            });
        } else {
            // ✅ Dark mode enable karo
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            darkModeText.textContent = 'light_mode';

            darkModeLinks.forEach(link => {
                const listItem = link.querySelector('li:nth-child(6)');
                if (listItem) listItem.textContent = "Light mode";
            });
        }
    });
});
// --------------Navbar-tonggle--------------

document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector(".menu");
    const close = document.querySelector(".close");
    const navbar = document.getElementById("navbar");

    if (menu && close && navbar) {
        menu.onclick = function () {
            navbar.classList.toggle("open");
        };
        close.onclick = function () {
            navbar.classList.remove("open");
        };
    } else {
        console.error("Navbar is not available");
    }
});


// ---------------Error/Success Message-------------------

function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');

    // Create notification div
    const notification = document.createElement('div');
    notification.classList.add('notification', type);

    // Get current time
    const time = new Date().toLocaleTimeString();

    // Icons for each type
    const icons = {
        success: '✔️',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    notification.innerHTML = `
        <i>${icons[type]}</i> 
        <span>${message}</span>
        <span class="timestamp">${time}</span>
        <span class="close-btn" onclick="dismissNotification(this.parentElement)">✖</span>
        <div class="progress-bar"></div>
    `;

    notificationContainer.appendChild(notification);

    // Play sound based on type
    playSound(type);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
        dismissNotification(notification);
    }, 3000);
}

function dismissNotification(notification) {
    notification.style.animation = "slideOut 0.5s ease-in-out";
    setTimeout(() => notification.remove(), 500);
}

function playSound(type) {
    const sounds = {
        success: document.getElementById('success-sound'),
        error: document.getElementById('error-sound'),
        warning: document.getElementById('warning-sound'),
        info: document.getElementById('info-sound')
    };
    if (sounds[type]) {
        sounds[type].play();
    }
}

//--------------Redirect--------------------------
const profileLinks = document.querySelectorAll(".goProfileLink");
const userType = localStorage.getItem("userType");

const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname === "/index.html";

// Set base path according to current page
let profilePath = "#";

if (userType === "admin") {
    profilePath = isIndexPage ? "./Admin/profile.html" : "../Admin/profile.html";
} else if (userType === "student" || userType === "teacher") {
    profilePath = isIndexPage ? "./Student/profile.html" : "../Student/profile.html";
}

// Assign profile link dynamically
profileLinks.forEach(link => {
    link.href = profilePath;
    link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = profilePath;
    });
});
// ----------admin teacher student ----------------------

function updateUI() {
    const userType = localStorage.getItem("userType");
    const teacherElements = document.querySelectorAll(".teacher-only"); // Select teacher features
    const studentElements = document.querySelectorAll(".student-only"); // Select student features
    const adminElements = document.querySelectorAll(".admin-only");

    if (userType === "teacher") {
        teacherElements.forEach(el => el.style.display = "block"); // Show teacher elements
        adminElements.forEach(el => el.style.display = "none"); 
        studentElements.forEach(el => el.style.display = "none"); // Hide student-only elements

    }
    if (userType === "admin") {
        teacherElements.forEach(el => el.style.display = "none"); // Show teacher elements
        adminElements.forEach(el => el.style.display = "block"); 
        studentElements.forEach(el => el.style.display = "none"); // Hide student-only elements

    }
    if (userType === "student") {
        teacherElements.forEach(el => el.style.display = "none"); // Show teacher elements
        adminElements.forEach(el => el.style.display = "none"); 
        studentElements.forEach(el => el.style.display = "block"); // Hide student-only elements

    }
    
}
// Call this function when the page loads
updateUI();

function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}


// ---------------------MATCH THE USER DATA ----------------------------

