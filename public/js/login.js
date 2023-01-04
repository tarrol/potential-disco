const loginFormHandler = async function(event) {
    event.preventDefault();

    // * query Selector for password/username ID name
    const usernameEl = document.querySelector('#username-login');
    const passwordEl = document.querySelector('#password-login');

    const response =  await fetch ('/api/user', {
        method: 'POST',
        body: JSON.stringify({
            username: usernameEl.value,
            password: passwordEl.value,
        }),
        // ? 
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert('Failed to login');
    }
};