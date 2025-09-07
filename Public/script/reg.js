

window.onload = function() {
    captchaFunc();
    // loadStudents;
  };
  

  document.querySelector('.regenerateCaptchaBtn').addEventListener('click', () => {
    captchaFunc();
    });
  
    let captchaNum; // ✅ Global variable for captcha

    function captchaFunc() {
        captchaNum = Math.floor(Math.random() * (999999 - 99999 + 1));
        document.querySelector(".captchaaa").innerHTML = captchaNum;
    }
    
//   --------------userMenu-------
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}


// ----------------------

// async function loadStudents() {
//     // console.log("loadStudents")

// }

const newRegistration = document.getElementById('new-account')

newRegistration.addEventListener('submit', async function(event) {
    
    // async function SubmitionNewAccount(event) {
        // console.log("submitonNew clicked")
        event.preventDefault();
        const formData = {
            username: document.getElementById('username').value,
            fullName: document.getElementById('full-name').value,
            mobileNumber: document.getElementById('mobile-number').value,
            confirmMobileNumber: document.getElementById('confirm-mobile-number').value,
            email: document.getElementById('email').value,
            confirmEmail: document.getElementById('confirm-email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value,
            course: document.getElementById('course').value,
            userType: document.getElementById('userType').value,
        };

        
        let isValid = true; // ✅ Validity check

        // 🟢 Username Validation
        if (!formData.username) {
            document.querySelector('.nameError').innerHTML = "❌ Please enter your name!!";
            isValid = false;
        } else if (formData.fullName.length < 3 || formData.fullName.length > 20) {
            showNotification("❌ Fill Unique name with at least 3 characters!!", 'error')
            document.querySelector('.nameError').innerHTML = "❌ Fill your  Username with at least 3 characters!!";
            isValid = false;
        } else {
            document.querySelector('.nameError').innerHTML = ""; // ✅ Clear error
        }
    
        if (!formData.course || formData.course === "Select Course") {
            alert("❌ Please select a valid course");
            showNotification("❌ Please select a valid user type", 'error');
            isValid = false;
        }
        
        if (!formData.userType || formData.userType === "Select Course") {
            showNotification("❌ Please select a valid user type", 'error');
            isValid = false;
        }
        
        // 🟢 Mobile Number Validation
        const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobileNumber)) {
            document.querySelector('.mobileNoError').innerHTML = "❌ Invalid mobile number format !!";
            showNotification("❌ Invalid mobile number format !!", 'error');
            isValid = false;
        } else if (formData.mobileNumber !== formData.confirmMobileNumber) {
           document.querySelector('.mobileNoError').innerHTML = "Mobile numbers do not match" 
           showNotification("Mobile numbers do not match", 'error');
           isValid = false;
        } else {
            document.querySelector('.mobileNoError').innerHTML = ""; // ✅ Clear error
        }       
    
        // 🟢 Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            document.querySelector('.mailError').innerHTML = "❌ Invalid email format!";
            showNotification("❌ Invalid email format!", 'error');
            isValid = false;
        } else if (formData.email !== formData.confirmEmail) {
            document.querySelector('.mailError').innerHTML = "❌ Emails do not match!";
            showNotification("❌ Emails do not match!", 'error');
            isValid = false;
        } else {
            document.querySelector('.mailError').innerHTML = ""; // ✅ Clear error
        }  
    
        // 🟢 Password Validation
        if (formData.password.length < 4 || formData.password.length > 16) {
            document.querySelector('.pswdError').innerHTML = "❌ Password should be between 4 to 16 characters!!";
            showNotification("Password must be match", 'error');
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            document.querySelector('.pswdError').innerHTML = "❌ Passwords do not match!";
            showNotification("Password must be match", 'error');
            isValid = false;
        }else {
            document.querySelector('.pswdError').innerHTML = ""; // ✅ Clear error
        }
        
    
        if (document.querySelector('#captcha').value !== String(captchaNum)) {
            showNotification("❌ Invalid Captcha. Please try again.", 'error');
            isValid = false;
        }
            
        if (
            !formData.username || !formData.fullName || !formData.mobileNumber || !formData.confirmMobileNumber ||
            !formData.email || !formData.confirmEmail || !formData.password || !formData.confirmPassword ||
            !formData.course || !formData.userType
        ) {
            // alert("❌ All ke all fields are required!");
            showNotification("❌ All fields are required!", 'error'); 
            return;
        }
        
       
    

        if (!isValid) return; // 🛑 Stop if validation fails

        try {
            const response = await fetch('http://localhost:3000/api/auth/admin/new-registration', {
                
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            console.log(response);
            console.log(formData);
            console.log(formData); // Agar ye undefined hai to error aayega
            console.log('my email :',formData.email); // Undefined dikha sakta hai

            const result = await response.json(); // ✅ JSON Response Parse
            console.log("result sahi format mein hai ya nhi ", result);
            


            if (!response.ok) {
                console.log("error aya kuch", 'error')
                showNotification(result.message, 'error');
                if (response.status === 409) {
                    showNotification(result.message ||"❌ Username or Email already exists");
                  


                    // window.location.href = `/result?status=error&message=${encodeURIComponent(result.message)}`;
                } else if (response.status === 400) {
                    showNotification(result.message , 'error');
                } else if (response.status === 403) {
                    showNotificatio(result.message, 'error');
                } else if (response.status === 500) {
                    showNotification(result.message , 'error');
                } else if (response.status === 408) {
                    alert(result.message || "❌ Lock wait timeout exceeded");
                    showNotification(result.message, 'error');
                } else {
                    alert(`❌ Unexpected error: ${response.status} - ${response.statusText}`);
                }
                return;
            }
            
         
            if (result.status === 'success') {
                // Redirect to result page with success status and message
                // window.location.href = `/result?status=success&message=${encodeURIComponent(result.message)}`;
                showNotification(result.message, 'success'); 
            
                setTimeout(() => {
                    window.location.href = '/portal'; // ✅ Redirect to portal after 5 seconds
                }, 5000);
            
            } else {
                // Redirect to result page with error status and message
                // window.location.href = `/result?status=error&message=${encodeURIComponent(result.message)}`;
                showNotification(result.message, 'error');
                setTimeout(() => {
                    window.location.href = '/admin/new-registration'; // ✅ Redirect to registration after 5 seconds
                }, 5000);
            }

            
        } catch (error) {
            console.error("❌ Registration Error aa rha hai kya ho gya:", error);
            alert("❌ Registration failed regi.js. Please try again.", error);
            showNotification("Registration failed. Please try again.", 'error');
        }
    });

  
    