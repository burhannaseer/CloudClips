// --- Display User Info ---
function displayUserInfo() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      // Display user profile info
      const usernameEl = document.getElementById('usernameDisplay');
      const emailEl = document.getElementById('emailDisplay');
      if (usernameEl) usernameEl.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
      if (emailEl) emailEl.textContent = loggedInUser.email;
  
      // Display user sign-in history
      displaySignInHistory();
      
      // Display user posts
      renderPosts('myPosts', true);
    } else {
      alert('Please sign in to view your dashboard.');
      window.location.href = 'signin.html';
    }
  }
  
  // --- Edit Profile ---
  function showEditForm() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      document.getElementById('profile-info').style.display = 'none';
      document.getElementById('edit-profile').style.display = 'block';
  
      // Prefill edit form with current profile data
      document.getElementById('editFirstName').value = loggedInUser.firstName;
      document.getElementById('editLastName').value = loggedInUser.lastName;
      document.getElementById('editPhone').value = loggedInUser.phone;
    }
  }
  
  // Cancel Edit Form
  function cancelEdit() {
    document.getElementById('edit-profile').style.display = 'none';
    document.getElementById('profile-info').style.display = 'block';
  }
  
  // Save Edited Profile Info
  const editProfileForm = document.getElementById('editProfileForm');
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const firstName = document.getElementById('editFirstName').value.trim();
      const lastName = document.getElementById('editLastName').value.trim();
      const phone = document.getElementById('editPhone').value.trim();
  
      // Update the logged-in user's profile in localStorage
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      loggedInUser.firstName = firstName;
      loggedInUser.lastName = lastName;
      loggedInUser.phone = phone;
  
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      alert('Profile updated successfully!');
  
      // Refresh user info
      displayUserInfo();
    });
  }
  
  // --- Display Sign-in History ---
  function displaySignInHistory() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const signInHistory = JSON.parse(localStorage.getItem('signInHistory')) || {};
  
    if (loggedInUser && signInHistory[loggedInUser.email]) {
      const history = signInHistory[loggedInUser.email];
  
      const signInHistoryContainer = document.getElementById('signInHistory');
      if (signInHistoryContainer) {
        signInHistoryContainer.innerHTML = '<h3>Sign In History</h3>';
        history.forEach(time => {
          const div = document.createElement('div');
          div.className = 'sign-in-record';
          div.innerHTML = `<p>Signed in at: ${new Date(time).toLocaleString()}</p>`;
          signInHistoryContainer.appendChild(div);
        });
      }
    }
  }
 // --- Render Posts ---
function renderPosts(containerId, onlyUserPosts = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = JSON.parse(localStorage.getItem('posts')) || []; // Retrieve posts from localStorage
  const user = JSON.parse(localStorage.getItem('loggedInUser'));  // Get logged-in user (if needed)

  // If `onlyUserPosts` is true, filter to show only the logged-in user's posts
  const filteredPosts = onlyUserPosts && user
    ? posts.filter(post => post.userEmail === user.email)
    : posts;

  // If no posts found, show a message
  if (filteredPosts.length === 0) {
    container.innerHTML = '<p>No posts to display.</p>';
    return;
  }

  // Clear previous content before rendering new posts
  container.innerHTML = '';

  filteredPosts.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';

    // Display video or image based on the post type
    const mediaTag = post.type.startsWith('video') ?
      `<video controls width="100%"><source src="${post.media}" type="${post.type}"></video>` :
      `<img src="${post.media}" alt="Post Media">`;

    // Create HTML structure for each post
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

    // Append post to container
    container.appendChild(div);
  });
}

// --- Home Page: Display All Posts ---
if (document.getElementById('feed')) {
  renderPosts('feed', false); // Show all posts on the home page
}

  
  // --- Render User Posts ---
  function renderPosts(containerId, onlyUserPosts = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
  
    const filteredPosts = onlyUserPosts && user
      ? posts.filter(post => post.userEmail === user.email)
      : posts;
  
    container.innerHTML = '';
  
    filteredPosts.forEach(post => {
      const div = document.createElement('div');
      div.className = 'post';
  
      const mediaTag = post.type.startsWith('video') ?
        `<video controls width="100%"><source src="${post.media}" type="${post.type}"></video>` :
        `<img src="${post.media}" alt="">`;
  
      div.innerHTML = `
        <h3>${post.title || 'Untitled'}</h3>
        ${mediaTag}
        <p>${post.description}</p>
      `;
      container.appendChild(div);
    });
  }
  
  // --- Run display user info on page load ---
  displayUserInfo();
  