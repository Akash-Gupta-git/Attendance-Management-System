
document.addEventListener('DOMContentLoaded', function() {
    const captchaCode = document.getElementById('captchaCode');
    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const captcha = document.getElementById('captcha');
    const userType = document.getElementById('userType');
    const refreshCaptchaButton = document.querySelector('.refreshCaptcha');
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname; // Get current page URL
    
    function isTokenExpired(token) {
        try {
            if (!token) return true;
            const payload = JSON.parse(atob(token.split(".")[1])); 
            return payload.exp * 1000 < Date.now(); // Check if expired
        } catch (error) {
            return true; // Assume expired if decoding fails
        }
    }
    
    function getUserFromToken() {
        try {
            if (!token) return null;
            return JSON.parse(atob(token.split(".")[1])); // Decode JWT
        } catch (error) {
            console.error("❌ Error decoding token:", error);
            return null;
        }
    }
    
    // 🔹 If token is missing or expired, redirect to signin page (unless already there)
    if (!token || isTokenExpired(token)) {
        console.log("❌...");
        localStorage.removeItem("token");
    
        if (!currentPage.includes("signin.html")) {
            console.warn("🔄 Redirecting to signin...");
            alert("🔄 Redirecting to signin...");
            window.location.href = "signin.html";
        }
    } else {
        // ✅ If token exists and is valid, redirect to profile (only if not already there)
        const user = getUserFromToken();
    
        if (user && !currentPage.includes("profile.html")) {
            console.warn("✅ Redirecting to profile...");
            alert("🔄 Allready logged. Redirecting to Profile...");
            if (user.userType === "admin") {
                setTimeout(() => {
                    window.location.href = `/Public/Admin/profile.html?admin=${encodeURIComponent(user.username)}&Vid=${encodeURIComponent(user.Vid)}`;
                }, 2000);  
            } else if (user.userType === "teacher" || user.userType === "student") {
                setTimeout(() => {
                   
                    // window.location.href = `/profile?username=${username}`;  // ✅ Corrected Redirect
                    window.location.href = `/Public/Student/profile.html?username=${encodeURIComponent(user.username)}&Vid=${encodeURIComponent(user.Vid)}`;
                }, 2000);  // 4 seconds delay
            }
            // setTimeout(() => {
            //     console.log("✅ Token found:", user);
            //     window.location.href = `/Public/Student/profile.html?username=${encodeURIComponent(user.username)}&Vid=${encodeURIComponent(user.Vid)}`;
            // }, 2000);
        }
    }
    
    // Function to generate random captcha code
    function generateCaptcha() {
        const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * charsArray.length);
            captcha += charsArray[index];
        }
        return captcha;
    }

    // Function to update captcha
    function updateCaptcha() {
        const generatedCaptcha = generateCaptcha();
        captchaCode.textContent = generatedCaptcha;
        return generatedCaptcha;
    }
    let generatedCaptcha = updateCaptcha();

    refreshCaptchaButton.addEventListener('click', function() {
        generatedCaptcha = updateCaptcha();
    });
    // Handling form submission
    function validateCaptcha(input, generatedCaptcha) {
        return input === generatedCaptcha;
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        
        const userData = {
            identifier: username.value.trim(),
            password: password.value.trim(),
            userType: userType.value.trim()
        };

        try {
            const response = await fetch("http://localhost:3000/api/auth/signin", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            }); 
            const result = await response.json();
            // console.log("token dekho",result,result.token);
            
            // ✅ Input validation
            // if (!userData.identifier || !userData.password || !userData.userType) {
            //     // alert("❌ All fields are required!");
            //     showNotification(result.message, 'error');
            //     return;
            // // }
            let isValid = true;
            if (!userData.identifier) {
                document.querySelector('.nameError').textContent = 'Incorrect'
                document.querySelector('#username').style.border ='1px solid red'
                showNotification(result.message, 'error')
                isValid = false;
            } else {
                document.querySelector('.nameError').textContent = '';
                 document.querySelector('#username').style.border =''
            }
            if (!userData.password) {
                showNotification(result.message, 'error')
                document.querySelector('.pswdError').textContent = 'Incorrect Password'
                document.querySelector('#password').style.border ='1px solid red'
                isValid = false;
            } else {
                document.querySelector('.pswdError').textContent = '';
                document.querySelector('#password').style.border =''
            } 
            if (captcha.value !== generatedCaptcha) {
                showNotification("❌ Invalid Captcha. Please try again.", "error");
                isValid = false;
            }
            if(!isValid) return;
            

            // ✅ Captcha validation
            if (!validateCaptcha(captcha.value, generatedCaptcha)) {
                // alert('❌ Invalid Captcha. Please try again.');
                showNotification(result.message, 'error')
                return;
            }
           
        
         

            // ✅ Check if response is empty (status 204)
            if (response.status === 204 || response.headers.get("content-length") === "0") {
                throw new Error("❌ Empty response from server!");
            }

            // ✅ Handle different error statuses
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(result.message || "❌ Missing required fields!");
                } else if (response.status === 401) {
                    document.querySelector('#password').style.border ='1px solid red'
                    throw new Error(result.error || "❌ Invalid password!");
                } else if (response.status === 404) {
                    throw new Error(result.error || "❌ User not found!");
                } else if (response.status === 500) {
                    throw new Error(result.error || "❌ Internal server error!");
                } else {
                    throw new Error(result.error || "❌ Unknown error occurred!");
                }
                
            }
        
            if (result.status === "success") {
              
                console.log("✅ Login successful!");
                showNotification(result.message, "success");
                localStorage.setItem("token", result.token); 
                localStorage.setItem("userType", userData.userType);
            
        
                if (!result?.user || !result?.user?.username) {
                    console.error("❌ Error: User data is missing!", result.user);
                    showNotification("❌ Error fetching user data", "error");
                    return;
                }

                const userType = userData.userType.toLowerCase();
                const Vid = encodeURIComponent(result.user.Vid || "XXXXX");
                const userName = encodeURIComponent(result.user.username);
            
                if (userType === "admin") {
                    setTimeout(() => {
                        window.location.href = `/Public/Admin/profile.html?admin=${userName}&Vid=${Vid}`;
                    }, 4000);  
                } else if (userType === "teacher" || userType === "student") {
                    setTimeout(() => {
                       
                        // window.location.href = `/profile?username=${username}`;  // ✅ Corrected Redirect
                        window.location.href = `/Public/Student/profile.html?username=${result.user?.username}&Vid=${Vid}`
                    }, 4000);  // 4 seconds delay
                } else {
                    showNotification("❌ Unknown user type!", "error");
                }
            }
            
            
        } catch (error) {
            // console.error("❌ Login Error:", error.message);
            showNotification(error.message, 'error');
            
        }
    });
});



