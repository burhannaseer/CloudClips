const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  const usernameEl = document.getElementById('usernameDisplay');
  const emailEl = document.getElementById('emailDisplay');
  if (usernameEl) usernameEl.textContent = `${user.firstName} ${user.lastName}`;
  if (emailEl) emailEl.textContent = user.email;
}
