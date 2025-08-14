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

    const user = { firstName, lastName, email, phone, password };
    localStorage.setItem('user', JSON.stringify(user));
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

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('No account found. Please sign up first.');
      return;
    }

    if (user.email === email && user.password === password) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      alert('Sign In successful!');
      window.location.href = 'new.html';
    } else {
      alert('Incorrect email or password.');
    }
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
        likes: 0
      };

      try {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        alert('Post uploaded!');
        window.location.href = 'new.html';
      } catch (err) {
        alert('Upload failed: ' + err.message);
      }
    };

    reader.readAsDataURL(file);
  });
}

// --- Render Posts ---
function renderPosts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  container.innerHTML = '';

  posts.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';

    const mediaTag = post.type.startsWith('video')
      ? `<video controls width="100%"><source src="${post.media}" type="${post.type}"></video>`
      : `<img src="${post.media}" alt="Post Image" />`;

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

// --- Run post renderers ---
renderPosts('feed');
renderPosts('myPosts');
