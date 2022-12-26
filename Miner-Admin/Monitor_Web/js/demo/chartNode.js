// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

NORMAL_ALERT = '#00c0ef'
RED_ALERT = '#e60707'
ALERT_CPU = 90

// used for example purposes
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDateNow() {
    var utcTime = new Date();
    var m = new Date(utcTime.toLocaleString())
    var dateString =
        m.getFullYear() + "/" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getDate()).slice(-2) + " " +
        ("0" + m.getHours()).slice(-2) + ":" +
        ("0" + m.getMinutes()).slice(-2) + ":" +
        ("0" + m.getSeconds()).slice(-2);
    return dateString;
}
// create initial empty chart
// CHART CPU
var ctx_live = document.getElementById("chartCPU");
var chartCPU = new Chart(ctx_live, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderWidth: 1,
            borderColor: [],
            label: 'CPU used',
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: "Biểu đồ CPU",
        },
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 100
                }
            }]
        },
        gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItems, data) {
                    return data.datasets[tooltipItems.datasetIndex].label +': ' + tooltipItems.yLabel + '%';
                }
            }
        }
    }
});

// CHART RAM
var ctx_live = document.getElementById("chartRAM");
var chartRAM = new Chart(ctx_live, {
    type: "pie",
    data: {
        labels: [
            "Used",
            "Free",
        ],
        datasets: [
            {
                data: [40, 60],
                backgroundColor: [
                    "#03dbfc",
                    "#809396",
                ],
            }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: "Biểu đồ RAM",
        },
        legend: {
            display: true,
            position: "bottom"
        }
    }
});

// CHART DISK
var ctx_live = document.getElementById("chartDISK");
var chartDISK = new Chart(ctx_live, {
    type: "pie",
    data: {
        labels: [
            "Used",
            "Free",
        ],
        datasets: [
            {
                data: [40, 60],
                backgroundColor: [
                    "#03dbfc",
                    "#809396",
                ],
            }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: "Biểu đồ DISK",
        },
        legend: {
            display: true,
            position: "bottom"
        }
    }
});

var postId = 1;
// logic to get new data
var getData = function () {
    var url = `${HOST}/block/get/${$("#publicKeys").val()}?page=1&limit=1&reversed=1`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                console.log(result);
                data = result.data.data[0];
                // console.log(data)
                if (data._id.$oid == $("#idSeed").val()) {
                    console.log("Last seed");
                } else {
                    $("#idSeed").val(data._id.$oid);
                    if (chartCPU.data.datasets[0].data.length > 30) {
                        chartCPU.data.datasets[0].data.shift();
                        chartCPU.data.labels.shift();
                        chartCPU.data.datasets[0].borderColor.shift();
                    }
                    var dateString = unixTime(data.input.timestamp)
                    var cpu = data.output.cpu 
                    chartCPU.data.labels.push(dateString);
                    chartCPU.data.datasets[0].data.push(cpu);
                    chartCPU.data.datasets[0].borderColor.push(cpu > ALERT_CPU ? RED_ALERT : NORMAL_ALERT);
                    
                    // Update data RAM
                    var ram = data.output.ram
                    chartRAM.data.datasets[0].data = [ram, 100-ram]
                    document.getElementById("lastUpdateRAM").textContent = dateString;
                    
                    // Update data DISK
                    var disk = data.output.disk
                    chartDISK.data.datasets[0].data = [disk, 100-disk]
                    document.getElementById("lastUpdateDISK").textContent = dateString;
                    // re-render the chart
                    chartCPU.update();
                    chartRAM.update();
                    chartDISK.update();
                }   
            })
            .catch(error => {
                console.log('error', error)
            })

    // $.ajax({
    //     url: 'https://jsonplaceholder.typicode.com/posts/' + postId + '/comments',
    //     success: function (data) {
    //         // process your data to pull out what you plan to use to update the chart
    //         // e.g. new label and a new data point

    //         // add new label and data point to chart's underlying data structures
    //         // Update data CPU
    //         var dateString = getDateNow()
    //         randCPU = getRandomIntInclusive(1, 100)
            
    //         if (chartCPU.data.datasets[0].data.length > 30) {
    //             chartCPU.data.datasets[0].data.shift();
    //             chartCPU.data.labels.shift();
    //             chartCPU.data.datasets[0].borderColor.shift();
    //         }
    //         chartCPU.data.labels.push(dateString);
    //         chartCPU.data.datasets[0].data.push(randCPU);
    //         chartCPU.data.datasets[0].borderColor.push(randCPU > ALERT_CPU ? RED_ALERT : NORMAL_ALERT);
            
    //         // Update data RAM
    //         randRAMused = getRandomIntInclusive(1, 100)
    //         chartRAM.data.datasets[0].data = [randRAMused, 100-randRAMused]
    //         document.getElementById("lastUpdateRAM").textContent = dateString;

    //         // Update data DISK
    //         randDISKused = getRandomIntInclusive(1, 100)
    //         chartDISK.data.datasets[0].data = [randDISKused, 100-randDISKused]
    //         document.getElementById("lastUpdateDISK").textContent = dateString;
    //         // re-render the chart
    //         chartCPU.update();
    //         chartRAM.update();
    //         chartDISK.update();
        // }
    // });
};

function clearAllChart() {
    chartCPU.data.datasets[0].data = []
    chartCPU.data.labels = []
    chartCPU.data.datasets[0].borderColor = [];
    chartCPU.update();
    chartRAM.update();
    chartDISK.update();
}

function convertTimestampToDate(timestamp) {
    var utcTime = new Date(timestamp);
    var m = new Date(utcTime.toLocaleString())
    var dateString =
        m.getFullYear() + "/" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getDate()).slice(-2) + " " +
        ("0" + m.getHours()).slice(-2) + ":" +
        ("0" + m.getMinutes()).slice(-2) + ":" +
        ("0" + m.getSeconds()).slice(-2);
    return dateString;
}
function unixTime(timestamp) {
    var u = new Date(timestamp);
    return u.toLocaleString();
};
// get new data every 3 seconds
setInterval(getData, 3000);