const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('titleInput').value;
    const imageInput = document.getElementById('imageInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function() {
      const post = {
        title,
        image: reader.result,
        description: descriptionInput.value,
        likes: 0
      };
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      posts.unshift(post);
      localStorage.setItem('posts', JSON.stringify(posts));
      alert('Post uploaded!');
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
    div.innerHTML = `
      <h3>${post.title || 'Untitled'}</h3>
      <img src="${post.image}" alt="">
      <p>${post.description}</p>
      <div class="actions">
        <span onclick="likePost(${index})">❤️ ${post.likes}</span>
        <span>🔗</span>
        <span>💾</span>
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