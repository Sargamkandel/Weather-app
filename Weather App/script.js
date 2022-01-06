const container = document.querySelector('.container'),
    inputArea = container.querySelector('.input-area'),
    info_txt = inputArea.querySelector('.info'),
    inputBox = inputArea.querySelector('input'),
    btn_location = inputArea.querySelector('button'),
    images = document.querySelector('.weather-part img'),
    backBtn = document.querySelector('header i');
let api;

inputBox.addEventListener('keyup', e => {
    if (e.key == "Enter" && inputBox.value != "") {
        console.log("Enter Pressed");
        requestApi(inputBox.value);
    }
});

function worked(posiiton) {
    const { latitude, longitude } = posiiton.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${'3f44fd9ace167f1814628a9a826e9ce7'}`;
    fetchData();
}

function failed(fail) {
    info_txt.innerText = fail.message;
    info_txt.classList.add('err');
    setTimeout(function(){
        info_txt.innerText=""
        info_txt.classList.remove('err')
    },2000)

}
function fetchData() {
    info_txt.innerText = "Preparing weather details...";
    info_txt.classList.add('pending');
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function requestApi(city) {
    console.log(city);
    if(city=="bhandara"){
        city="bhandara"+','+"np";
    }
    if(city=="bharatpur"){
        city="bharatpur"+','+"np";
    }
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${'3f44fd9ace167f1814628a9a826e9ce7'}`;
    fetchData();
}

function weatherDetails(info) {
    info_txt.classList.replace('pending', 'err')
    if (info.cod == "404") {
        info_txt.innerText = `There is no city with name ${inputBox.value}`
        setTimeout(function(){
            inputBox.value=""
            info_txt.innerText=""
            info_txt.classList.remove('err')
        },2000)
    }
    else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            images.src = "images/clear.png";
        }
        if (id == 200 && id <= 232) {
            images.src = "images/strom.png";
        }
        if (id >= 600 && id <= 622) {
            images.src = "images/snow.png";
        }
        if (id >= 701 && id <= 781) {
            images.src = "images/haze.png";
        }
        if (id >= 801 && id <= 804) {
            images.src = "images/cloud.png";
        }
        if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            images.src = "images/rain.png";
        }

        container.querySelector('.num').innerText = temp;
        container.querySelector('.weather').innerText = description;
        container.querySelector('.location .place').innerText = `${city},${country}`;
        container.querySelector('.num-2').innerText = feels_like;
        container.querySelector('.humidity span').innerText = humidity + "%"

        info_txt.classList.replace('err', 'pending');
        console.log(info);
        container.classList.add('active');
    }
}


btn_location.addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(worked, failed);
    }
    else {
        alert('The browser you are using donot support geolocation')
    }
});


backBtn.addEventListener('click',function(){
    container.classList.remove('active');
    inputBox.value="";
    info_txt.innerText=""
    info_txt.classList.remove('pending')
    inputArea.style.marginTop=5+"px"
})
