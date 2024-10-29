window.onload = () => {
    const searchBox = document.querySelector('#search');
    
    // Using form submission to trigger the search
    const form = document.querySelector('#form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        formSubmit();
    });
};

const formSubmit = () => {
    const searchBox = document.querySelector('#search');
    if (searchBox.value !== "") {
        getUser(searchBox.value);
        searchBox.value = ""; // Clear the input field after submission
    }
    return false;
};

const getUser = async (username) => {
    const API_URL = "https://api.github.com/users";
    const main = document.querySelector('#main'); // Updated to match HTML

    try {
        const response = await fetch(`${API_URL}/${username}`);
        if (!response.ok) {  // Check if the response is not okay
            throw new Error('User not found');
        }
        
        const data = await response.json();

        const card = `
        <div class="card">
            <div>
                <img class="avatar" src="${data.avatar_url || 'default-avatar.png'}" alt="${data.login}'s profile picture">
            </div>    
            <div class="user">
                <h2>${data.name || 'No Name'}</h2>  
                <p>${data.login}</p>
                <ul>
                    <li>${data.following} <strong>following</strong></li>
                    <li>${data.followers} <strong>followers</strong></li>
                    <li>${data.public_repos} <strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
        `;

        main.innerHTML = card; // Display the user card
        await getRepos(username); // Fetch repositories after displaying user info

    } catch (error) {
        main.innerHTML = `<p>Error: ${error.message}</p>`; // Display error message
    }
};
 
const getRepos = async (username) => {
    const repos = document.querySelector('#repos');
    repos.innerHTML = ''; // Clear previous repositories

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) { // Handle any errors in fetching repos
            throw new Error('Unable to fetch repositories');
        }
        const data = await response.json();

        data.forEach(repo => {
            const element = document.createElement('a');
            element.classList.add('repo');
            element.href = repo.html_url;
            element.innerText = repo.name;
            element.target = "_blank";
            repos.appendChild(element);
        });
        
    } catch (error) {
        repos.innerHTML = `<p>Error: ${error.message}</p>`; // Display error message
    }
};
