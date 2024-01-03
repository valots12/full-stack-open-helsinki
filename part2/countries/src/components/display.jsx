import Weather from './weather'

const Display = ({countries, filter, filterResult}) => {
    
    if (countries.length > 0) {

        const countriesNames = countries.map(country => country.name.common)
        const filterCountries = countriesNames.filter(country => country.toLowerCase().includes(filter))

        if (filterCountries.length > 10) {
            return (
                <div>Too many matches, specify another filter</div>
                )
        } 

        else if (filterCountries.length > 1) {
            return (
                <div>
                  {filterCountries.map(name => <li key={name}>{name} <button onClick={() => filterResult(name)}>Show</button></li>)}
                </div>
              )
        }

        else if (filterCountries.length === 0) {
            return (
                <div>No results, specify another filter</div>
              )
        }

        // case with one result
        const countryInfo = countries.filter(country => country.name.common.toLowerCase().includes(filter))
        const countryLanguages = countryInfo[0].languages
        console.log('test', countryInfo)

        return (
            <div>
              <h2>{countryInfo[0].name.common}</h2>
              <p>Capital: {countryInfo[0].capital}</p>
              <p>Area: {countryInfo[0].area}</p>
              <h3>Languages:</h3>
              {Object.values(countryLanguages).map(language => <li key={language}>{language}</li>)}
              <br />
              <img src={countryInfo[0].flags.png} alt="Country Flag" />
              <Weather city={countryInfo[0].capital}/>
            </div>
          )
    }
  }
  
  export default Display