//select elements
var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");


var formSubmitHandler = function(){
    event.preventDefault();
    var username = nameInputEl.value.trim();    

    // if there is a username, run the getUserFunction and then reset the nameInputEl to zero for another go. 
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    }
    // if there isn't anything in the spot, alert the user to enter something into the form. 
    else {
        alert('Please enter a Github username');
    }
};

var getUserRepos = function(user){
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl)

    // finds its destination URL and attempt to get the data in question, which would return the .then() method, or it fails and goes to .catch()
    .then(function(response){

        // request was successfull
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data, user);
            });
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        // Notice this .catch() getting chained onto the end of the .then()
        alert("Unable to connect to GitHub");
    });
};

var displayRepos = function(repos, searchTerm){

    // check if api has returned any repos
    if (repos.length === 0){
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++){
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold the repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if the current repo has issues or not
        if(repos[i].open_issues_count > 0){
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        // append to the DOM
        repoContainerEl.appendChild(repoEl);
    }

};

var getFeaturedRepos = function(language){
    // creates an API endpoint
    var apiURL = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    // makes a HTTP request to that endpoint. 
    fetch(apiURL).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                displayRepos(data.items, language);
            })
        }
        else {
            alert("Error: " + response.statusText);
        }
    });
};

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    if(language){
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }
    else {

    }
};


userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);