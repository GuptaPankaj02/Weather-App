const usertab = document.querySelector("[data-userWeather]");
const searchtab = document.querySelector("[data-searchWeather]");
const usercontainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const loadScreenContainer = document.querySelector(".loading-container");
const searchContainer = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".user-info-container");


// initial value
let presentTab = usertab;
presentTab.classList.add("current-tab");

getSecssionStorage();

function switchtab(clickedtab) {
    
    if (clickedtab != presentTab) {
        presentTab.classList.remove("current-tab");
        presentTab = clickedtab;
        presentTab.classList.add("current-tab")

        if (!searchContainer.classList.contains("active")) {
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchContainer.classList.add("active");
        }
        else {
            searchContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getSecssionStorage();
        }
    }
}

usertab.addEventListener("click", () => {
    switchtab(usertab);
});

searchtab.addEventListener("click", () => {
    switchtab(searchtab);
});

// store cordinates in secssionstorage
function getSecssionStorage() {
    console.log("checking for internal storage");
    const LocalCordinate = sessionStorage.getItem("User-Cordinates");
    if (!LocalCordinate) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const Cordinates = JSON.parse(LocalCordinate);
        fetchWeatherInfo(Cordinates);
    }
}

async function fetchWeatherInfo(Cordinates) {
    console.log("user location fetch started");
    const { lat, lon } = Cordinates;
    console.log(lat, lon);
    // remove the grantAcesscontainer
    grantAccessContainer.classList.remove("active");


    loadScreenContainer.classList.add("active");

    // Calling API
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9942760aa8edb91452522bdc972f1aa1&units=metric`);
        const data = await response.json();
        console.log(data);
        loadScreenContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherdata(data);
    } catch (error) {
        loadScreenContainer.classList.remove("active");
    }
}



function renderWeatherdata(weatherinfo) {
    // fetch element
    const cityname = document.querySelector("[data-cityName]");
    const countryFlage = document.querySelector("[data-countryIcon]");
    const disc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temprature = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    // value in fetched element
    cityname.innerText = weatherinfo?.name;
    countryFlage.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    disc.innerText = weatherinfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temprature.innerText = `${weatherinfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherinfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity} %`;
    clouds.innerText = `${weatherinfo?.clouds?.all}%`;

}

const grantAccessbutton = document.querySelector("[data-grantAccess]");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(ShowPosition);
    } else {
        console.log("No geolocation support in your system");
    }
}

function ShowPosition(position) {
    const userCordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    console.log("caugth location");
    sessionStorage.setItem("User-Cordinates", JSON.stringify(userCordinates));
    fetchWeatherInfo(userCordinates);
}

grantAccessbutton.addEventListener("click", getLocation);

const searchForm = document.querySelector("[data-searchInp]");

searchContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    let city = searchForm.value;
    if (city === "") return;
    else {
        fetchSearchWeather(city);
    }
})


async function fetchSearchWeather(city) {
    loadScreenContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    // APi Call for cityname
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9942760aa8edb91452522bdc972f1aa1&units=metric`);
        const data = await response.json();
        console.log(data);
        loadScreenContainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherdata(data);
    } catch (err) {
        loadScreenContainer.classList.remove("active");
    }
}