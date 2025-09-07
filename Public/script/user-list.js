let students = [];
localStorage.setItem("userType", "admin"); // Set default user type for testing

// ✅ Fetch Students Data from Backend
async function loadStudents() {
    try {
        const response = await fetch("http://localhost:3000/api/fetch/admin/user-list"); // ✅ API Endpoint
        students = await response.json();
        // console.log("✅ Students Data in Frontend:", students); // Debugging ke liye
        renderStudents(students);
    } catch (error) {
        console.error("Error loading students:", error);
    }
}

// ✅ Render Students in Grid
function renderStudents(studentData) {
    const container = document.getElementById("studentsContainer");
    container.innerHTML = ""; // Clear existing data

    studentData.forEach((student) => {
        const role = student.role || "Student"; // ✅ Default role
        const std_ID = student.student_id ? student.student_id : "N/A"; // ✅ Null handle
        const fullName = student.full_name ? student.full_name : "Unknown"; // ✅ Null handle
        const username = student.username ? student.username : "Unknown2"
        const course = student.course_selected ? student.course_selected : "Unknown2"
        // localStorage.setItem("userType", student.role);
        // console.log("User Typejjj:", student); // Debugging ke liye
        
        const studentCard = document.createElement("div");
        studentCard.classList.add("student-card");
        studentCard.innerHTML = `
        <p><strong>${role}</strong></p>
             <p><strong></strong> ${username}</p>
              <p><strong></strong> ${course}</p>
             <p><strong>ID:</strong> ${std_ID.slice(-4)}</p>
            <a href="../Student/profile.html?username=${username}&Vid=${std_ID}" target="_blank">View Profile</a>
             <a href="edit-user.html?username=${username}&Vid=${std_ID}" target="_blank">Edit</a>
        `;
        container.appendChild(studentCard);
    });
}

// ✅ Filter Students (Search + Course Filter)
function filterStudents() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const courseValue = document.getElementById("courseFilter").value;

    const filteredStudents = students.filter((student) => {
        const enrollNo = student.enroll_no ? student.enroll_no.toString() : ""; // ✅ Null check added
        const studentName = student.username ? student.username.toLowerCase() : ""; // ✅ Null check

        return (
            (enrollNo.includes(searchValue) || studentName.includes(searchValue)) &&
            (courseValue === "" || student.course_selected === courseValue) // ✅ Corrected course field
        );
    });

    renderStudents(filteredStudents);
}

// ✅ Load Students on Page Load
window.onload = loadStudents;