document.addEventListener("DOMContentLoaded", () => {
    // ✅ Navbar Toggle
    document.querySelector(".menu").onclick = function () {
        document.getElementById("navbar").classList.toggle("open");
    };
    document.querySelector(".close").onclick = function () {
        document.getElementById("navbar").classList.remove("open");
    };

    // ✅ Dark Mode Functionality
    const darkModeButtons = document.querySelectorAll(".dark"); // Variable rename kiya
    const body = document.body;

    // ✅ Check saved dark mode preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        darkModeButtons.forEach(button => {
            const darkModeText = button.querySelector('span');
            if (darkModeText) darkModeText.textContent = 'light_mode';
        });
    }

    darkModeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            if (body.classList.contains('dark-mode')) {
                // ✅ Disable Dark Mode
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');

                darkModeButtons.forEach(btn => {
                    const darkModeText = btn.querySelector('span');
                    if (darkModeText) darkModeText.textContent = 'dark_mode';
                });
            } else {
                // ✅ Enable Dark Mode
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');

                darkModeButtons.forEach(btn => {
                    const darkModeText = btn.querySelector('span');
                    if (darkModeText) darkModeText.textContent = 'light_mode';
                });
            }
        });
    });
});

// -----------------SEARCHING WORD-----------------
function handleSearch() {
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    if (!searchValue) {
        alert("❌ Please enter a search term");
        return;
    }
    removeHighlight(); // Remove previous highlights

    let found = false;
    let firstMatch = null;
    const bodyText = document.body;

    function highlightText(node) {
        if (node.nodeType === 3) { // Text Node
            const index = node.nodeValue.toLowerCase().indexOf(searchValue);
            if (index !== -1) {
                found = true;
                const range = document.createRange();
                range.setStart(node, index);
                range.setEnd(node, index + searchValue.length);

                // ✅ Create highlight element
                const highlight = document.createElement('span');
                highlight.className = 'highlight';
                highlight.textContent = node.nodeValue.substring(index, index + searchValue.length);

                // ✅ Replace the matched text with highlighted span
                const afterText = node.splitText(index);
                afterText.nodeValue = afterText.nodeValue.substring(searchValue.length);
                afterText.parentNode.insertBefore(highlight, afterText);
            } 
        } else if (node.nodeType === 1 && node.childNodes) { // Element Node
            node.childNodes.forEach(child => highlightText(child));
        }
    }
    highlightText(bodyText);
   
    if (!found) {
        alert("❌ No match found");
    }
}

function removeHighlight() {
    document.querySelectorAll('.highlight').forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
    });
}
document.getElementById('search-button').addEventListener('click', handleSearch);

// --------------------
// -----------------User Log-----------------
window.onload = function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userType"); // check spelling of key in localStorage
  
    const loginSection = document.querySelector(".userLogin");
    const userProfileSection = document.querySelector(".userProfile");
  
    console.log("Token:", token);
    console.log("Role:", role);
    console.log("Login Section:", loginSection);
    console.log("User Profile Section:", userProfileSection);
  
    if (token && (role === "student" || role === "teacher" || role === "admin")) {
      userProfileSection.style.display = "flex";
      loginSection.style.display = "none";
      console.log("✅ Authenticated user - showing profile");
    } else {
      userProfileSection.style.display = "none";
      loginSection.style.display = "flex";
      console.log("🔒 Guest user - showing login");
    }
  };
