"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
let episodesExist = false;



const buttons = document.querySelector(".container")
buttons.addEventListener('click', function(e){
  let targets = e.target
  if(targets.classList.contains('Show-getEpisodes')){
    const showId = targets.closest('.Show');
    const Ids = showId.dataset.showids;
    getEpisodesOfShow(Ids);
  }
})





/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(qSearch) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res =  await axios.get('http://api.tvmaze.com/search/shows', {params: {q: qSearch}})
  const shows = res.data;
  return shows;


}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  
    $showsList.empty();
  for (let show of shows) {
   let showurl = ""
   try {
      showurl =  show.show.image.original;
   } catch (error) {
    showurl ="https://tinyurl.com/tv-missing"
    
   }
   
   const $show = $(

      `<div data-showids="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${showurl}"
              alt="${show.show.name} show"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
             Episodes
           </button>
         </div>
       </div>
     </div>
    `);
          
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.show();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) { 
  const res =  await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  populateEpisodes(res.data)

 }

/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) { 
  
  checkEpisode();
  const uL = document.querySelector('#episodesList')
  for(let ep of episodes){
  let newUl = document.createElement('li')
  newUl.innerText = `${ep.name},    Season:${ep.season},     Number${ep.number}`  
  uL.appendChild(newUl);
  }
}

function checkEpisode(){//removes episodes if they are displayed from anther show if the episode button is clicked again
    if(episodesExist === true){
    let uL = document.querySelector('#episodesList')
    uL.remove()
    const newUl = document.querySelector('#episodesArea')
    let neww = document.createElement('ul')
    neww.setAttribute('id', 'episodesList')
    newUl.append(neww)
  } else{ episodesExist = true;  }
  
  
}
