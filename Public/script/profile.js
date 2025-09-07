document.addEventListener("DOMContentLoaded", async () => {
   
    try {
        const urlParams = new URLSearchParams(window.location.search );
        const username = urlParams.get("username");
        const Vid = urlParams.get("Vid");

        const token = localStorage.getItem("token");
        const currentPage = window.location.pathname;
      
        if (!token) {
            if (!currentPage.includes("signin.html")) {
                console.warn("🔄 Redirecting to signin...");
                alert("🔄 Redirecting to signin...");
                window.location.href = "../Login/signin.html";
            }
            throw new Error("❌ Authentication token is missing!");
        }
       
        let apiUrl = "http://localhost:3000/profile";

        // ✅ Add query parameters if available
        if (username && Vid) {
            apiUrl += `?username=${encodeURIComponent(username)}&Vid=${encodeURIComponent(Vid)}`;
        }

        // ✅ Fetch user data from backend
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            }
        });
        const data = await response.json();        
 
      
        
        if (!response.ok) {
            // throw new Error(`❌ HTTP Error! Status: ${response.status}`);
            if (response.status === 400) {
                throw new Error(data.error || "❌ Missing required fields!");
            } else if (response.status === 401) {
                throw new Error(data.error || "❌ Invalid password!");
            } else if (response.status === 404) {
                throw new Error(data.error || "❌ User not found!");
            } else if (response.status === 500) {
                throw new Error(data.error || "❌ Internal server error!");
            } else {
                throw new Error(data.error || "❌ Unknown error occurred!");
            }
        }

      
        const userType = data.userType
        

        if (data.status === "success" && data.user) {
            // localStorage.setItem("userType", data.role); // Store role in localStorage
            updateUI();
            if (userType !== "admin" && window.location.pathname.includes("/admin")) {
                alert("Access Denied! Redirecting to home...");
                window.location.href = "/home"; // Redirect to home page
            }
            updateProfile(data.user);
            document.getElementById("username").textContent = data.user.username;
            document.getElementById("user_photo").src = data.user.profile_image || "../Assets/user_img.webp";
            // document.getElementById("loginBtn").style.display = "none"; // Hide login button
            document.querySelector(".userProfile img").src = data.user.profile_image || "/Public/Assets/user_img.webp";
            const type = data.role 
            ? data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase() 
            : "User"; // Default value to prevent errors
        
        document.querySelectorAll(".user-role").forEach(summary => {
            summary.textContent = summary.textContent.replace("Student", type);
        });
        
            
        } else {
            console.warn("⚠️ No user data found.");
            showNA();
        }
    } catch (error) {
        console.error("❌ Error fetchingasdf user data:", error);
        showNA();
    }
});
// ---------------user- role text-------------


function updateProfile(user) {
    if (!user) return;

    const elements = {
        username: document.getElementById("username"),
        full_name: document.getElementById("full_name"),
        father_name: document.getElementById("fName"),
        email: document.getElementById("email"),
        mobile_no: document.getElementById("mobile_no"),
        address: document.getElementById("address"),
        course_selected: document.getElementById("course"),
        enroll_no: document.getElementById("enroll_no"),
        grade12: document.getElementById("grade12"),
        grade10: document.getElementById("grade10"),
        Vid: document.getElementById("Vid"),
        user_photo: document.getElementById("user_photo"),
    };

    // Update text content only if elements exist
    if (elements.username) elements.username.textContent = user.username || "N/A";
    if (elements.full_name) elements.full_name.textContent = user.full_name || "N/A";
    if (elements.father_name) elements.father_name.textContent = user.father_name || "N/A";
    if (elements.email) elements.email.textContent = user.email || "N/A";
    if (elements.mobile_no) elements.mobile_no.textContent = user.mobile_no || "N/A";
    if (elements.address) elements.address.textContent = user.address || "N/A";
    if (elements.course_selected) elements.course_selected.textContent = user.course_selected || "N/A";
    if (elements.enroll_no) elements.enroll_no.textContent = user.enroll_no || "N/A";
    if (elements.grade12) elements.grade12.textContent = user.grade_12 || "N/A";
    if (elements.grade10) elements.grade10.textContent = user.grade_10 || "N/A";
    if (elements.Vid) {
        elements.Vid.textContent = user.student_id ? user.student_id : user.teacher_id ? user.teacher_id : "N/A";
    }
    

    // ✅ Handle user photo
    // if (elements.user_photo && user.user_photo) {
    //     elements.user_photo.src = `/Asseis/user_img.webp,${user.user_photo}`;
    //     elements.user_photo.style.display = "block";
    // }
}
// if (user.user_photo) {
//     elements.user_photo.src = `/Asseis/user_img.webp,${user.user_photo}`;
//     elements.user_photo.style.display = "block";
// }


function showNA() {
    const elements = {
        username: document.getElementById("username"),
        full_name: document.getElementById("full_name"),
        father_name: document.getElementById("fname"),
        email: document.getElementById("email"),
        mobile_no: document.getElementById("mobile_no"),
        address: document.getElementById("address"),
        course_selected: document.getElementById("course_selected"),
        enroll_no: document.getElementById("enroll_no"),
        grade12: document.getElementById("grade12"),
        grade10: document.getElementById("grade10"),
    };

    for (const key in elements) {
        if (elements[key]) elements[key].textContent = "N/A";
    }
}

// Function to add Teacher Features
// function teacher-only() {
//     const navbar = document.getElementById("navbar");
//     navbar.innerHTML += `
//         <a href="#"><li><span class="material-symbols-outlined">assignment</span>Attendance Page</li></a>
//         <a href="#"><li><span class="material-symbols-outlined">analytics</span>Performance Reports</li></a>
//     `;
// }



let currentCardIndex = 0; // Start with the first card
const cards = document.querySelectorAll('#card-container .card');
const totalCards = cards.length;

// Function to show the current card
function showCard(index) {
    cards.forEach((card, i) => {
        card.classList.remove('active', 'next', 'prev');
        if (i === index) {
            card.classList.add('active'); // Show current card
        } else if (i === (index + 1) % totalCards) {
            card.classList.add('next'); // Prepare next card
        } else if (i === (index - 1 + totalCards) % totalCards) {
            card.classList.add('prev'); // Prepare previous card
        }
    });
}

// Function to change to the next card
function changeCard() {
    currentCardIndex = (currentCardIndex + 1) % totalCards; // Loop back to the first card
    showCard(currentCardIndex);
}

// Show the first card initially
showCard(currentCardIndex);

// Change card every 3 seconds (3000 milliseconds)
setInterval(changeCard, 3000);


//   --------------userMenu-------
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
