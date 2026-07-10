console.log("lets write javascript");
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = " "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li><img class="invert" src="img/music.svg" alt="" srcset="">
                      <div class="info">
                          <div>${song.replaceAll("%20", " ")}</div>
                          <div>Jitesh</div>
                      </div>
                      <div class="playnow">
<span>Play Now</span>
                          <img class="invert" src="img/play.svg" alt="" srcset="">
                      </div>
                      </li>`;
    }
    //attach an event listener to each songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            playMusic(song[0])
        })

    })
return songs
}
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/${track.trim()}`;
    if (!pause) {

        currentSong.play()

        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    Array.from(anchors).forEach(async e => {
        if (e.href.includes("/songs") &&
            e.href.endsWith("/") &&
            !e.href.endsWith("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]


            //get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <img src="/songs/${folder}/cover.jpeg" alt="" srcset="">
                        <div class="logo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="black">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <h4>${response.title}</h4>
                        <p style="font-size:12" ;>${response.description}</p>
                    </div>`
            //load the playlist whenever card was clicked

            Array.from(document.getElementsByClassName("card")).forEach(e => {
                e.addEventListener("click", async item => {

                    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                    playMusic(songs[0])

                })
            })


        }
    })
}

async function main() {

    //get the list of all the songs 
    await getsongs("songs/ncs")
    playMusic(songs[0], true)
    //display all the albums on the page
    displayAlbums();



    //attach an evemt listener to play,next and previous
    let play = document.getElementById("play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg";
        }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} /
        ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })
    //add a event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //add a event listener to close button 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //add a event listener to previous 

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    //add a event listener to next

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg" , "img/volume.svg")
        }
    })

//add an event listener to mute the volume
 document.querySelector(".volume>img").addEventListener("click" , e=>{
    if(e.target.src.includes("img/volume.svg")){
       e.target.src = e.target.src.replace("img/volume.svg" , "img/mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src = e.target.src.replace("img/mute.svg" , "img/volume.svg")
        currentSong.volume= .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
 })
}

main() 
