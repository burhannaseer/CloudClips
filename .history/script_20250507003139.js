// Handle upload form
const form = document.getElementById('uploadForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('titleInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
    const fileInput = document.getElementById('mediaInput');
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select an image or video file.");
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

      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.unshift(post);
      localStorage.setItem('posts', JSON.stringify(posts));

      alert("Post uploaded!");
      window.location.href = 'index.html';
    };

    reader.readAsDataURL(file);
  });
}
