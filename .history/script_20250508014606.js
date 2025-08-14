// Handle Sign Up
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

// Handle Sign In
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
      alert('Sign In successful!');
      window.location.href = 'index.html';
    } else {
      alert('Incorrect email or password. Please try again.');
    }
  });
}

// Handle Post Upload
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', function (e) {
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
      alert('File too large! Please upload a file under 2MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const post = {
        title,
        description,
        media: reader.result,
        type: file.type,
        likes: 0
      };

      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.unshift(post);
      try {
        localStorage.setItem('posts', JSON.stringify(posts));
        alert('Post uploaded!');
        window.location.href = 'index.html';
      } catch (e) {
        alert('Failed to upload. Storage limit exceeded.');
      }
    };

    reader.readAsDataURL(file);
  });
}

// Render Posts
function renderPosts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';

    const mediaTag = post.type.startsWith('video') ?
      `<video controls width="100%"><source src="${post.media}" type="${post.type}"></video>` :
      `<img src="${post.media}" alt="Post image">`;

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

// Handle Likes
function likePost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts[index].likes++;
  localStorage.setItem('posts', JSON.stringify(posts));
  location.reload();
}

renderPosts('feed');
