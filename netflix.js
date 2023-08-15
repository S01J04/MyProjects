//consts

const APIkey = "526f8fb0c234201767562cdfc8b50101"
const APIEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original"
const APIPaths = {
    fetchAllCategories: `${APIEndpoint}/genre/movie/list?api_key=${APIkey} `,
    fetchtrending: `${APIEndpoint}/trending/all/day?api_key=${APIkey} `,
    fetchlatest: `${APIEndpoint}/movie/latest?api_key=${APIkey} `,
    fetchNetflixOrignals: `${APIEndpoint}/movie/latest?api_key=${APIkey} `,
    fetchtoprated: `${APIEndpoint}/movie/top_rated?api_key=${APIkey} `,
    fetchpopular: `${APIEndpoint}/movie/popular?api_key=${APIkey} `,
    fetchSimilarMovies: (id) => `${APIEndpoint}/movie/${id}/similar?api_key=${APIkey}`,
    fetchMoviesList: (id) => `${APIEndpoint}/discover/movie?api_key=${APIkey}&with_genres=${id}`

}

function init() {
    fetchbanner();
    fetchtrendingmovies();
    fetchtopratedmovies();
    fetchpopularmovies();
    fetchandbuildallsections();


}

function fetchtopratedmovies() {
    fetch(APIPaths.fetchtoprated).then(res => {

        return res.json();
    }).then(res => {
        // console.log(res.results)
        let trend = res.results;
        if (Array.isArray(trend) && trend) {
            buildMovieSection(trend, category={"name":"TopRated"});
        }
    })
}

function fetchpopularmovies() {
    fetch(APIPaths.fetchpopular).then(res => {

        return res.json();
    }).then(res => {
        // console.log(res.results)
        let trend = res.results;
        if (Array.isArray(trend) && trend) {
            buildMovieSection(trend, category={"name":"Popular"});
        }
    })
}




function fetchandbuildallsections() {
    fetch(APIPaths.fetchAllCategories)
        .then(res => {

            return res.json()
        })
        .then(res => {
            // console.log(res)
            const categories = res.genres
            // console.log(categories)
            if (Array.isArray(categories) && categories) {
                categories.forEach(categories => {
                    // console.log(APIPaths.fetchMoviesList(categories.id),categories)
                    fetchandbuildMovieSection(APIPaths.fetchMoviesList(categories.id), categories)
                })
            }

        })
        .catch(err => console.error(err))
}

function fetchbanner() {
    fetch(APIPaths.fetchtrending)
        .then(res => res.json())
        .then(res => {
            // console.log(res);
            let trend = res.results;
            if (Array.isArray(trend) && trend) {
                return trend;
            }
        })
        .then(movies => {
            // console.log(movies);
            let random = Math.floor(Math.random() * movies.length);
            let randommovie = movies[random]
            const bannersection = document.getElementById('banner-section');
            bannersection.style.background = `rgba(0, 0, 0, 0.4) url(${imgPath}${randommovie.backdrop_path}) center/cover`;

            const div = document.createElement('div');
            div.innerHTML = `
            <h2 class="banner-title">${randommovie.title}</h2> <!-- Change to movies[0] -->
            <p class="banner-info">#10 in TV Shows Today</p>
            <p class="banner-overview">${randommovie.overview && randommovie.overview.length>200 ? randommovie.overview.slice(0,200).trim()+"...":randommovie.overview }</p> <!-- Change to movies[0] -->
            <div class="v">
                <button class="action-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; PLAY</button>
                <button class="action-btn info"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="CircleI" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>&nbsp;&nbsp; More Info</button>
            </div>
        `;
            div.className = "banner-content container";
            bannersection.append(div);
        });
}


function fetchandbuildMovieSection(fetchurl, categories) {
    fetch(fetchurl).then(res => {

            return res.json()
        })
        .then((data) => {
            // console.log((data.results),categories)
            // console.log(data.results)
            const movies = data.results;
            if (Array.isArray(movies) && movies.length) {
                buildMovieSection(movies, categories)
            }
        })
        .catch(err => console.error(err))
}

function fetchtrendingmovies() {
    fetch(APIPaths.fetchtrending).then(res => {

        return res.json();
    }).then(res => {
        // console.log((res))
       
        let trend = res.results;
        //  console.log((trend))
        if (Array.isArray(trend) && trend) {
            category={"name":"Trending"}
            // console.log(category.name)
            buildMovieSection(trend,category );
        }
    })
}

function buildMovieSection(list, category) {
    // console.log(category.name)
    // console.log(typeof(list[3].title))
    const moviecont = document.getElementById('movies_cont');
    const movieslisthtml = list.map(item => {
        // console.log(typeof(item.title))
        const sanitizedTitle = JSON.stringify(item.title);
        // console.log(typeof(sanitizedTitle));
        const sanitizedBackdropPath = JSON.stringify(item.backdrop_path);
        const sanitizedOverview = JSON.stringify(item.overview);
        const sanitizedposterpath = JSON.stringify(item.poster_path);
        const sanitizedvoteavg = JSON.stringify(item.vote_average);
        const sanitizedid = JSON.stringify(item.id);

        return `
            <img class="movie_item" id="movie_item" src="${imgPath}${item.backdrop_path}" alt="${item.title}"
                data-movie='{"title": ${sanitizedTitle},"id": ${sanitizedid},"vote_average": ${sanitizedvoteavg},"poster_path":${sanitizedposterpath}, "backdrop_path": ${sanitizedBackdropPath}, "overview": ${sanitizedOverview}}'>
        `;
    }).join(" ");
   
    const moviessectionhtml = `
        <h2 class="movie-section-heading">${category.name}&nbsp;&nbsp;<span class="explore">Explore</span></h2>
        <div class="movies-row">
            ${movieslisthtml}
        </div>  
    `;
    const div = document.createElement("div");
    div.className = "movies-section";
    div.innerHTML = moviessectionhtml;
    moviecont.append(div);

    const movieImages = document.querySelectorAll("#movie_item");
    movieImages.forEach(image => {
        image.removeEventListener("click", imageClickHandler); // Remove the existing event listener
        image.addEventListener("click", imageClickHandler); // Add a new event listener
    });
}

function imageClickHandler(e) {
    const movieData = JSON.parse(e.currentTarget.getAttribute('data-movie'));
    const category = e.currentTarget.closest(".movies-section").querySelector(".movie-section-heading").textContent;
    // console.log(movieData, category);
    showMovieDetailsBox(movieData);
}

async function showMovieDetailsBox(movieData, category) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
    // console.log(movieData.id)

    const moviebox = document.createElement("div");
    moviebox.className = "movie-box";
    moviebox.innerHTML = `
    <div class="movie-details-content">
    <svg class="close-button" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="X" aria-labelledby="preview-modal-81092192" data-uia="previewModal-closebtn" role="button" aria-label="close" tabindex="0"><title id="preview-modal-81092192">close</title><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z" fill="currentColor"></path></svg>
        
            <img class="img" src="${imgPath}${movieData.backdrop_path}" alt="${movieData.title}" >
            <div class="buttonControls--container" data-uia="mini-modal-controls"><a tabindex="0" toolkitsize="small" listid="NES_C0F01B37DF1E315FC55ABEE0B50945-AE852D192D0194-19651FE810_p_1691866395172" ranknum="3" requestid="e803027f-6f29-469b-8317-ab0cc3052729-308115668" rownum="1" uiplaycontexttag="detailsPagePlayButton" trackid="262837462" data-uia="play-button" role="link" aria-label="Resume" class="primary-button playLink isToolkit" href=""><button class="color-primary hasLabel hasIcon ltr-podnco" tabindex="-1" type="button"><div class="ltr-1st24vv"><div class="medium ltr-iyulz3" role="presentation"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg></div></div><div class="ltr-1npqywr" style="width: 1rem;"></div><span class="ltr-1vh9doa">Resume</span></button></a><div class="ltr-bjn8wh"><div class="ptrack-content" data-ui-tracking-context="%7B%22lolomo_id%22:%22NES_C0F01B37DF1E315FC55ABEE0B50945_p_1691866395172%22,%22list_id%22:%22NES_C0F01B37DF1E315FC55ABEE0B50945-AE852D192D0194-19651FE810_p_1691866395172%22,%22location%22:%22homeScreen%22,%22rank%22:3,%22request_id%22:%22e803027f-6f29-469b-8317-ab0cc3052729-308115668%22,%22row%22:1,%22track_id%22:263132375,%22video_id%22:81092192,%22supp_video_id%22:1,%22appView%22:%22addToMyListButton%22,%22usePresentedEvent%22:true%7D" data-tracking-uuid="d3bf4262-2c69-4534-b42d-3d25d3998378"><button aria-label="Add To My List" class="color-supplementary hasIcon round ltr-11vo9g5" data-uia="add-to-my-list" type="button"><div class="ltr-1st24vv"><div class="small ltr-iyulz3" role="presentation"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="Plus" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 11V2H13V11H22V13H13V22H11V13H2V11H11Z" fill="currentColor"></path></svg></div></div></button></div></div><div class="ltr-179t5g5"><button class="color-supplementary hasIcon round ltr-126oqy" data-uia="thumbs-rate-button" type="button" aria-haspopup="menu" aria-controls="#thumbs-selection-menu" aria-expanded="false"><div class="ltr-1st24vv"><div class="small ltr-iyulz3" role="presentation"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-0 e1mhci4z1" data-name="ThumbsUp" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z" fill="currentColor"></path></svg></div></div></button></div></div>
            <div class="btt"><h2 class="title" style="color: white">${movieData.title}</h2>
            <p class="overview" style="color: white">${movieData.overview}</p></div>
            </div>
            

        
        
    `;
    document.body.appendChild(moviebox);

    const closeButton = moviebox.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay); // Remove the overlay
        document.body.removeChild(moviebox);
    });

    try {
        const similarMoviesResponse = await fetch(APIPaths.fetchSimilarMovies(movieData.id));
        const similarMoviesData = await similarMoviesResponse.json();
        // console.log(similarMoviesData)

        if (Array.isArray(similarMoviesData.results) && similarMoviesData.results.length > 0) {
            const similarMovies = similarMoviesData.results;

            const similarMovieGroups = [];
            for (let i = 0; i < similarMovies.length; i += 3) {
                similarMovieGroups.push(similarMovies.slice(i, i + 3));
            }
            const similarMoviesHtml = similarMovieGroups
                .map(group => {
                    const groupHtml = group.map(movie => {
                        const sanitizedTitle = JSON.stringify(movie.title);
                        const sanitizedBackdropPath = JSON.stringify(movie.backdrop_path);
                        const sanitizedOverview = JSON.stringify(movie.overview);

                        return `
                     <div class="card">
                         <img class="similar-movie" src="${imgPath}${movie.backdrop_path}" alt="${movie.title}"
                             data-movie='{"title": ${sanitizedTitle}, "overview": ${sanitizedOverview}, "backdrop_path": ${sanitizedBackdropPath}}'>
                         <h3 class="padd">${movie.title&& movie.title.length> 50 ? movie.title.slice(0,50).trim()+"...":movie.title}</h3>
                         <p class="padd q">${movie.overview && movie.overview.length > 138 ? movie.overview.slice(0, 138).trim() + "..." : movie.overview}</p>
                     </div>
                 `;
                    }).join('');

                    return `<div class="similar-movies-row">${groupHtml}</div>`;
                })
                .join('');

            const similarMoviesSection = document.createElement("div");
            similarMoviesSection.className = "similar-movies-section";
            similarMoviesSection.innerHTML = `
         <h3 class="heading">Similar Movies</h3>
         ${similarMoviesHtml}
     `;
            const overviewElement = moviebox.querySelector('.overview');

            // Insert the similarMoviesSection after the overview element
            overviewElement.insertAdjacentElement('afterend', similarMoviesSection);

            const similarMovieImages = moviebox.querySelectorAll(".similar-movie");
            similarMovieImages.forEach(image => {
                image.addEventListener("click", imageClickHandler);
            });
        }
    } catch (error) {
        console.error("Error fetching similar movies:", error);
    }




}

window.addEventListener('load', function () {
    init()
})
const header = document.querySelector('#h');

// Define a variable to keep track of the scroll position
let prevScrollPos = window.pageYOffset;

// Function to handle scroll event


