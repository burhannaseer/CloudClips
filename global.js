
function likePost(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].likes++;
    localStorage.setItem('posts', JSON.stringify(posts));
    if (typeof renderPosts === 'function') {
        if (document.getElementById('feed')) renderPosts('feed', false);
        if (document.getElementById('myPosts')) renderPosts('myPosts', true);
        if (document.getElementById('homePosts')) renderPosts('homePosts', false);
    }
}
