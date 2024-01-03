import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({city}) => {

    const apiKey = import.meta.env.VITE_API_KEY
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=' + apiKey + ''
    const [weather, setWeather] = useState([])

    useEffect(() => {
        axios.get(url).then(response => {
                setWeather(response.data)
            })
    }, [url])

    const temperature = weather?.main?.temp
    const feelsLike = weather?.main?.feels_like
    const wind = weather?.wind?.speed
    const humidity = weather?.main?.humidity
    const description = weather?.weather?.[0].description
    const icon = weather?.weather?.[0].icon

    return (
        <div>
            <h3> The weather in {city} right now:  {description} </h3>
            
            {icon !== undefined && <img
                src={'http://openweathermap.org/img/wn/' + icon + '@4x.png'}
                alt='weather icon.png'
            />}

            <p> Temperature: {' '}  {temperature} °C ( feels like {feelsLike} °C)</p>
            <p> Wind: {' '} {wind} m/s </p>
            <p> Humidity: {' '} {humidity} % </p>
        </div>
    )
}

export default Weather

// For Windows PowerShell:  ($env:VITE_API_KEY="add_key") -and (npm run dev)
// For Windows cmd.exe:     set "VITE_API_KEY=add_ley" && npm run dev