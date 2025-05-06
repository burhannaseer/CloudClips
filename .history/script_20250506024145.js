const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation checks
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Create user object
    const user = {
      firstName,
      lastName,
      email,
      phone,
      password,
    };

    // Save to localStorage (for demonstration, in a real app use a backend)
    localStorage.setItem('user', JSON.stringify(user));

    alert('Account created successfully!');
    window.location.href = 'signin.html'; // Redirect to sign in page
  });
}
