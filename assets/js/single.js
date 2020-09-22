var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function(){
    //grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if(repoName){
        //display repo name on the page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    }
    else {
        //if no repo was given, redirect to the homepage. 
        document.location.replace("./index.html");
    }
};

var getRepoIssues = function(repo){
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiURL).then(function(response){
        //request was successfull
        if (response.ok){
            response.json().then(function(data){
                // pass response data to DOM function
                displayIssues(data);

                // check if API has paginated issues. 
                if (response.headers.get("Link")){
                    displayWarning(repo);
                }

            })
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });

};

var displayIssues = function(issues){

    if (issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for(var i = 0; i < issues.length; i++){
        //create link element to take user to issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issue or pull request
        if (issues[i].pull_request){
            typeEl.textContent = "(Pull Request)";
        }
        else {
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEl.appendChild(typeEl);

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        issueContainerEl.appendChild(issueEl);
    };
};

var displayWarning = function(repo){
    
    var linkEl = document.createElement("a");
    linkEl.textContent = "See more Issues on Github.com";
    linkEl.setAttribute('href', 'https://github.com/' + repo + "/issues");
    linkEl.setAttribute('target', '_blank');

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();