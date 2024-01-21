let currentPage = 1;
 
function setUserName() {
    const username = document.getElementById('username').value;
    window.location.href = `listing.html?username=${username}`;
    
};


function loaddata () {
    searchRepositories(1,10)
    setTimeout(()=>{addPaginationControls(localStorage.getItem("repocnt"),10)},1000)
    
}

 async function getRepolang(reponame) {
    const username= new URLSearchParams(window.location.search).get("username");
    let response = await fetch(`https://api.github.com/repos/${username}/${reponame}/languages`,{
        headers: {
          'Authorization': `Bearer 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`,
        },
      })
     return await response.json()
}

function searchRepositories(currentPage,perPage) {
    displayLoading()
   const username= new URLSearchParams(window.location.search).get("username")
    

    const apiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`;

    fetch(`https://api.github.com/users/${username}`,{
        headers: {
          'Authorization': `Bearer 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`,
        },
      })
    .then(response => response.json())
    .then(data => { hideLoading();localStorage.setItem("repocnt", data.public_repos);displayProfile(data)})
    .catch(error => console.error('Error:', error));

    fetch(apiUrl,{
        headers: {
          'Authorization': `Bearer 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`,
        },
      })
        .then(response => response.json())
        .then(data => displayRepositories(data))
        .catch(error => console.error('Error:', error));
}

function displayProfile(profile) {
    
    const profileContainer = document.getElementById('profile');
    profileContainer.innerHTML = '';

    const profileElement = document.createElement('div');
    profileElement.innerHTML = `
    <img src="${profile.avatar_url}" class="border   border-info p-1 " alt="Avatar">
    <h3>${profile.name}</h3>
    <h5 style="color:rgb(127, 125, 125)" >${profile.login}</h5>
    <p id="repocnt">Repositores: ${profile.public_repos}</p>
    <p>Location:${profile.location}</p>
    <p>Followers: ${profile.followers}</p>
    <p>Following: ${profile.following}</p>
    <a href="${profile.html_url}" target="_blank">View on GitHub</a>
`;
profileContainer.appendChild(profileElement);

}

function displayRepositories(repositories) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    repositories.forEach(repo => {

        getRepolang(repo.name).then((data)=>{
            Object.keys(data).map((l)=>{
                var langelement = document.createElement('div')
                langelement.classList.add('badge','bg-secondary',"mx-1")
                langelement.innerHTML=`${l}`;
                 document.getElementById(`lang${repo.id}`).appendChild(langelement)
            })
        })
          
        const repoElement = document.createElement('div');
        repoElement.classList.add('repository', 'grid-item','card');
        repoElement.innerHTML = ` <div class="">
        <h4 class="card-title">${repo.name}</h4>
        <p class="card-text">${repo.description || "NA"}</p>
        <div style="display: flex; justify-content: space-between;">
          <div id=lang${repo.id} ></div> 
          <a href="${repo.html_url}" style="text-decoration: none;" class="card-lin">View on GitHub</a>
        </div>
        </div>
        `;
        resultsContainer.appendChild(repoElement);   
    });
}

// ///pagination

function addPaginationControls(totalRepositories,itemsPerPage) {
    const totalPages = Math.ceil(totalRepositories / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (currentPage > 1) {
        const prevButton = createPaginationButton('Prev', currentPage - 1,itemsPerPage);
        paginationContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        
        const pageItem = document.createElement('button');
    pageItem.textContent = i;
    if(pageItem.textContent == currentPage){
        console.log("pii",pageItem.textContent)
        pageItem.classList.add('current');
    }
   
    pageItem.addEventListener('click', function () {
        console.log("vvvi",this.innerText)
        currentPage =this.innerText
        searchRepositories(currentPage,itemsPerPage)
        setTimeout(()=>{addPaginationControls(localStorage.getItem("repocnt"),itemsPerPage)},1000)
    });
    paginationContainer.appendChild(pageItem);
    }

    // "Next" button
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('Next', currentPage + 1,itemsPerPage);
        paginationContainer.appendChild(nextButton);
    }
}

function createPaginationButton(text, page,itemPpage) {
    // console.log("inside cre page",text,page,itemPpage)
    const pageItemB = document.createElement('button');
    pageItemB.classList.add("pitm")
    pageItemB.textContent = text;
    searchRepositories(currentPage,itemPpage)
    pageItemB.addEventListener('click', function () {
        currentPage =page
        setTimeout(()=>{addPaginationControls(localStorage.getItem("repocnt"),itemPpage)},1000)
    });
   
    return pageItemB;
}
// ///perpage
document.getElementById('recordsPerPage').addEventListener('change', function () {
    const selectedValue = this.value;
    console.log(`User selected ${selectedValue} records per page.`);
    searchRepositories(1,selectedValue)
    setTimeout(()=>{addPaginationControls(localStorage.getItem("repocnt"),selectedValue)},1000)
});


// ///loader
const loader = document.querySelector("#loading");
function displayLoading() {
   
    loader.classList.add("display");
}

function hideLoading() {
    loader.classList.remove("display");
}