const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "UTF-8");

const replace = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempMin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempMax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);

    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=686c7ea2a08920a82b4eb0e2194fc57d")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) =>
                    replace(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
    else {
        res.end("File Not Found!");
    }
});

server.listen(8000, "127.0.0.1")