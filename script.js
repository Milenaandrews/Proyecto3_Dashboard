// import moment from "./node_modules/moment/dist/moment.js";
import { fetchApi, fetchApiGrafico } from "./fetch.js";

const searchbox = document.getElementById("inputCity");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.querySelector(".weather-icon");


async function checkWeather() {
    const data = await fetchApi(`https://api.openweathermap.org/data/2.5/weather?q=${searchbox.value}&appid=871ab96fd19c640630eb0d3315da8daa&units=metric&lang=es`);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".country").innerHTML = data.sys.country;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    weatherIcon.src = `./assets/images/${data.weather[0].main}.png`

    document.querySelector(".weather").style.display = "block";
    // document.querySelector(".graphic").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

searchBtn.addEventListener("click", (e) => {
    e.preventDefault()
    checkWeather()
    mostrarGrafico()
    mostrarGrafico2()
})


async function mostrarGrafico() {

    const dataGrafico = await fetchApiGrafico(`https://api.openweathermap.org/data/2.5/forecast?q=${searchbox.value}&appid=871ab96fd19c640630eb0d3315da8daa&units=metric&lang=es`);

    const dataGraficoArray = []

    dataGraficoArray.push(dataGrafico)

    
    const datos = dataGraficoArray.map((dato) => dato.list)
    const fechas = datos[0].map((fecha) => formatDate(fecha.dt_txt))
    const temperaturas = datos[0].map(temparatura => temparatura.main.temp)
    const humedades = datos[0].map(humedad => humedad.main.humidity)
    const nombreCiudad = dataGrafico.city.name
    
    const contenedorGrafico1 = document.getElementById("grafico1")

    contenedorGrafico1.classList.remove("hidden")


    let existingChart = Chart.getChart("myChart"); 
    if (existingChart) {
        existingChart.destroy(); 
    }

    let ctx = document.getElementById("myChart").getContext("2d");

    Chart.defaults.color = '#fff';


    new Chart(ctx, {
        data: {
            labels: fechas,
            datasets: [ {
                type: 'line',
                label: 'Temperatura',
                data: temperaturas,
                fill: true,
                borderColor: 'rgb(66, 54, 235)'
            },
        {
                type: 'bar',
                label: 'Humedad',
                data: humedades,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.8)'
            }
        ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                
                title: {
                    display: true,
                    text: `Temperatura y Humedad de ${nombreCiudad} en 5 días`,
                    padding: {
                        top: 20,
                        bottom: 30
                    }
                },
                
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + '°';
                            }
                            return label;
                        }
                    }
                }
            },
        }

    });

}

async function mostrarGrafico2() {

    const dataGrafico = await fetchApiGrafico(`https://api.openweathermap.org/data/2.5/forecast?q=${searchbox.value}&appid=871ab96fd19c640630eb0d3315da8daa&units=metric&lang=es`);

    const dataGraficoArray = []

    dataGraficoArray.push(dataGrafico)

    
    const datos = dataGraficoArray.map((dato) => dato.list)
    
    const fechas = datos[0].map((fecha) => formatDate(fecha.dt_txt))    
    const tempMaximas = datos[0].map(tempMaxima =>tempMaxima.main.temp_max)
    const tempMinimas = datos[0].map(tempMinima =>tempMinima.main.temp_min)
    const nombreCiudad = dataGrafico.city.name

        
    const contenedorGrafico2 = document.getElementById("grafico2")

    contenedorGrafico2.classList.remove("hidden")



    let existingChart2 = Chart.getChart("myChart2"); 
    if (existingChart2) {
        existingChart2.destroy(); 
    }
    
    let ctx2 = document.getElementById("myChart2").getContext("2d");

    Chart.defaults.color = '#fff';


    new Chart(ctx2, {
        data: {
            labels: fechas,
            datasets: [ {
                type: 'bar',
                label: 'Temperatura Máxima',
                data: tempMaximas,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(66, 54, 235, 0.8)'
            },
        {
                type: 'bar',
                label: 'Temperatura Mínima',
                data: tempMinimas,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.8)'
            }
        ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                
                title: {
                    display: true,
                    text: `Temperatura Máxima y Mínima de ${nombreCiudad} en 5 días`,
                    padding: {
                        top: 20,
                        bottom: 30
                    }
                },
                
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + '°';
                            }
                            return label;
                        }
                    }
                }
            },
        }

    });

}


// !Funcion para arreglar las fechas

function formatDate (fecha) {
    const anio = fecha.slice(0,4)
    const mesesCortos = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"]
    const mes = fecha.slice(5,7)
    const dias = fecha.slice(8,10)
    const hora = fecha.slice(11,16)
    const mesPosition = parseInt(mes)-1
    
    const tradicional = `${dias} ${mesesCortos[mesPosition]} ${hora}`
    
    return tradicional

}





