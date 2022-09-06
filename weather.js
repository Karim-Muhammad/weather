const config = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(express.static(__dirname + "/testAPI"));
app.use(express.json());
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/weather.html");
});
app.get("/weather.css", (req, res) => {
    res.sendFile(__dirname + "/weather.css");
});

app.post("/", (req, res) => {
    let country = req.body.country;
    let units = req.body.unit;

    https.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${config.apiKey}&units=${units}`,
        (response) => {
            response.on("data", (returnData) => {
                let data = JSON.parse(returnData);
                if (data.cod === 200) {
                    let temp = data.main.temp;
                    let weatherDesc = data.weather[0].description;
                    let icon = data.weather[0].icon;
                    let imgURL = "http://openweathermap.org/img/wn/";
                    res.write(
                        `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8" />
                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                <title>Weather App</title>
                                <link rel="stylesheet" href="weather.css" type="text/css" />
                            </head>
                            <body>
                                <div class="header">
                                    <h1>Weather APP</h1>
                                </div>
                                <h2>Enter Your Queries</h2>
                                <div class="form">
                                    <form action="/" method="post">
                                        <label for="countries">country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            id="countries"
                                            placeholder="Palestine"
                                        />
                        
                                        <label for="unit">unit</label>
                                        <select name="unit" id="unit">
                                            <option value="metric">Celcius</option>
                                            <option value="imperial">Fahrenheit</option>
                                            <option value="standard">Kelven</option>
                                        </select>
                                        <input type="submit" id="submit" value="fetch" />
                                    </form>
                        
                                    <div class="result">
                                        <h3>${country}</h3>
                                        <p>Temprature: ${temp}${
                            units === "imperial"
                                ? "F"
                                : units === "metric"
                                ? "o"
                                : "K"
                        }</p>
                                        <img src="${imgURL}/${icon}@2x.png" alt="weather img" />
                                        <p>${weatherDesc}</p>
                                    </div>
                                </div>
                            </body>
                        </html>
                        `
                    );
                } else {
                    let errImg =
                        "https://media.istockphoto.com/vectors/concept-404-error-page-flat-cartoon-style-vector-illustration-vector-id1149316411?k=20&m=1149316411&s=612x612&w=0&h=wzSCBQVVh76LWzeEQP01DDEhpm983Y6_tsqlZ46goZ0=";
                    res.write(
                        `<!DOCTYPE html>
                        <html lang="en">
                            <head charset="UTF-8" >
                                <meta charset="UTF-8" />
                                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                <title>Weather App</title>
                                <link rel="stylesheet" href="weather.css" type="text/css" />
                            </head>
                            <body>
                                <div class="header">
                                    <h1>Weather APP</h1>
                                </div>
                                <h2>Enter Your Queries</h2>
                                <div class="form">
                                    <form action="/" method="post">
                                        <label for="countries">country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            id="countries"
                                            placeholder="Palestine"
                                        />
                        
                                        <label for="unit">unit</label>
                                        <select name="unit" id="unit">
                                            <option value="metric">Celcius</option>
                                            <option value="imperial">Fahrenheit</option>
                                            <option value="standard">Kelven</option>
                                        </select>
                                        <input type="submit" id="submit" value="fetch" />
                                    </form>
                        
                                    <div class="result">
                                        <h3>${country} not found</h3>
                                        <img id="err-img" src="${errImg}"
                                        alt="Error Request" />
                                        <p>Might you entered wrong country</p>
                                    </div>
                                </div>
                            </body>
                        </html>
                        `
                    );
                }
                res.send();
            });
        }
    );
});

// app.get("/get_info", (req, res) => {});
app.listen(3000, () => {
    console.log("the server is running...");
});
