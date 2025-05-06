const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('titleInput').value;
    const fileInput = document.getElementById('mediaInput');
    const description = document.getElementById('descriptionInput').value;
    const file = fileInput.files[0];

    // Debugging log
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('File:', file);

    if (!file) {
      alert('Please select an image or video to upload.');
      return;
    }

    if (!title || !description) {
      alert('Please fill in all fields.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function() {
      const post = {
        title,
        media: reader.result,
        type: file.type,
        description,
        likes: 0
      };

      // Debugging log
      console.log('Post data:', post);

      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.unshift(post); // Add the new post to the beginning of the array
      localStorage.setItem('posts', JSON.stringify(posts));
      
      alert('Post uploaded!');
      window.location.href = 'index.html';  // Redirect to home page after upload
    };

    reader.onerror = function() {
      alert('Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
  });
}

function renderPosts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.forEach((post, index) => {
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

function likePost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts[index].likes++;
  localStorage.setItem('posts', JSON.stringify(posts));
  location.reload();
}

renderPosts('feed');
renderPosts('myPosts');
