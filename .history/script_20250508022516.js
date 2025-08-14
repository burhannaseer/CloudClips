// --- Sign Up ---
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.email === email)) {
      alert('Email already exists. Please sign in.');
      return;
    }

    const user = { firstName, lastName, email, phone, password };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully!');
    window.location.href = 'signin.html';
  });
}

// --- Sign In ---
const signinForm = document.getElementById('signinForm');
if (signinForm) {
  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('emailSignIn').value.trim();
    const password = document.getElementById('passwordSignIn').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
      alert('Incorrect email or password.');
      return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));

    const signInHistory = JSON.parse(localStorage.getItem('signInHistory')) || {};
    if (!signInHistory[user.email]) {
      signInHistory[user.email] = [];
    }
    signInHistory[user.email].push(new Date().toISOString());
    localStorage.setItem('signInHistory', JSON.stringify(signInHistory));

    alert('Sign In successful!');
    window.location.href = 'index.html';
  });
}

// --- Upload Post ---
const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('titleInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
    const fileInput = document.getElementById('mediaInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Max 2MB allowed.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const post = {
        title,
        media: reader.result,
        type: file.type,
        description,
        likes: 0,
        userEmail: JSON.parse(localStorage.getItem('loggedInUser')).email // Save user email for filtering posts later
      };

      try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.unshift(post); // Insert post at the beginning
        localStorage.setItem('posts', JSON.stringify(posts));
        alert('Post uploaded!');
        window.location.href = 'index.html';
      } catch (err) {
        alert('Upload failed: ' + err.message);
      }
    };

    reader.readAsDataURL(file);
  });
}

// --- Render Posts ---
function renderPosts(containerId, onlyUserPosts = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  const filteredPosts = onlyUserPosts && user
    ? posts.filter(post => post.userEmail === user.email)
    : posts;

  container.innerHTML = '';

  filteredPosts.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';

    const mediaTag = post.type.startsWith('video') ?
      `<video controls width="100%"><source src="${post.media}" type="${post.type}"></video>` :
      `<img src="${post.media}" alt="">`;

    div.innerHTML = `
      <h3>${post.title || 'Untitled'}</h3>
      ${mediaTag}
      <p>${post.description}</p>
      <div class="actions">
        <span onclick="likePost(${index})">❤️ ${post.likes}</span>
        <span title="Share">🔗</span>
        <span title="Save">💾</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// --- Like Post ---
function likePost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts[index].likes++;
  localStorage.setItem('posts', JSON.stringify(posts));
  location.reload();
}

// --- Display Username & Email on Profile ---
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (loggedInUser) {
  const usernameEl = document.getElementById('usernameDisplay');
  const emailEl = document.getElementById('emailDisplay');
  if (usernameEl) usernameEl.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
  if (emailEl) emailEl.textContent = loggedInUser.email;
}

// --- Display Sign-In History ---
function displaySignInHistory() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) return;

  const signInHistory = JSON.parse(localStorage.getItem('signInHistory')) || {};
  const historyContainer = document.getElementById('signInHistory');
  
  if (signInHistory[user.email]) {
    signInHistory[user.email].forEach(signInTime => {
      const div = document.createElement('div');
      div.className = 'history-entry';
      div.textContent = `Signed in at: ${new Date(signInTime).toLocaleString()}`;
      historyContainer.appendChild(div);
    });
  } else {
    historyContainer.innerHTML = '<p>No sign-in history found.</p>';
  }
}

// --- Dashboard ---
function renderDashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    document.getElementById('profileName').textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
    document.getElementById('profileEmail').textContent = loggedInUser.email;
    displaySignInHistory();
    renderPosts('myPosts', true); // Render only the logged-in user's posts
  } else {
    alert('Please sign in to access the dashboard.');
    window.location.href = 'signin.html';
  }
}

// Call renderDashboard when the dashboard page loads
if (document.getElementById('dashboardPage')) {
  renderDashboard();
}

// --- Home Page: Display All Posts ---
if (document.getElementById('homePage')) {
  renderPosts('homePosts', false); // Display all posts on the home page
}
