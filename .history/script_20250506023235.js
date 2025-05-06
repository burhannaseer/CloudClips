const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('titleInput').value;
    const fileInput = document.getElementById('mediaInput');
    const description = document.getElementById('descriptionInput').value;
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function() {
      const post = {
        title,
        media: reader.result,
        type: file.type,
        description,
        likes: 0
      };
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.unshift(post);
      localStorage.setItem('posts', JSON.stringify(posts));
      alert('Post uploaded!');
      window.location.href = 'index.html';
    };

    if (file) {
      reader.readAsDataURL(file);
    }
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
