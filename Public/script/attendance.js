document.addEventListener("DOMContentLoaded", loadStudents);

let students = [];

// ✅ Fetch Students Data from Backend
async function loadStudents() {
    try {
        const response = await fetch("http://localhost:3000/api/attend/admin/attendance"); // ✅ Corrected API URL
        const data = await response.json();

        if (!Array.isArray(data)) throw new Error("Invalid data format"); // Ensure data is an array
        students = data;
        renderStudents(students);
    } catch (error) {
        console.error("❌ Error loading students:", error);
    }
}

// ✅ Render Students into Table
function renderStudents(studentData) {
    const tableBody = document.querySelector("#attendanceTable tbody");
    tableBody.innerHTML = "";

    studentData.forEach((student, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${student.enroll_no}</td>
                <td>${student.username}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td><input type="checkbox" data-id="${student.student_id}"></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ✅ Submit Attendance
document.getElementById("submitBtn").addEventListener("click", async function submitAttendance() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    let attendanceData = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            attendanceData.push({ student_id: checkbox.dataset.id, status: "Present" });
        }
    });

    if (attendanceData.length === 0) {
        alert("Please select at least one student.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(attendanceData)
        });

        if (!response.ok) throw new Error("Failed to submit attendance");
        alert("✅ Attendance submitted successfully!");
    } catch (error) {
        console.error("❌ Error submitting attendance:", error);
        alert("❌ Failed to submit attendance.");
    }
});
