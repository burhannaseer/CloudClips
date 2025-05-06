const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function() {
      const post = {
        image: reader.result,
        description: descriptionInput.value
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

const feed = document.getElementById('feed');
if (feed) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `<img src="${post.image}" alt=""><p>${post.description}</p>`;
    feed.appendChild(div);
  });
}
