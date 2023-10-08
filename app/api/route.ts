class CSVParser {
  static parse(csvText: string): object[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least two lines (header and data).');
    }

    const headers = lines[0].split(',');
    const result: object[] = [];

    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split(',');
      if (fields.length !== headers.length) {
        throw new Error(`Mismatch between the number of headers and data fields at line ${i + 1}.`);
      }

      const obj: { [key: string]: string } = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = fields[j];
      }
      result.push(obj);
    }

    return result;
  }
}

// FIRMS API Response Specification
// https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vnp14imgtdlnrt#ed-viirs-375m-attributes
function getUrlFIRMS() {
  const baseUrlFIRMS = 'https://firms.modaps.eosdis.nasa.gov/usfs/api/area/csv';

  const apiKeyFIRMS = process.env.FIRMS_API_KEY;
  const sourceFIRMS = 'VIIRS_SNPP_NRT';
  // west,south,east,north
  const areaFIRMS = '-180,10,-20,90';
  const dayRangeFIRMS = '1';

  const urlFIRMS = `${baseUrlFIRMS}/${apiKeyFIRMS}/${sourceFIRMS}/${areaFIRMS}/${dayRangeFIRMS}`;

  return urlFIRMS;
}

// NOAA File System
function getUrlNOAA() {
  const baseUrlNOAA = 'https://satepsanone.nesdis.noaa.gov/pub/FIRE/web/HMS/Fire_Points/Text';

  const currentDate = new Date();
  const yearNOAA = currentDate.getFullYear();
  const monthNOAA = currentDate.getMonth();
  const dayNOAA = currentDate.getDate();

  const dateNOAA = `${yearNOAA}${monthNOAA}${dayNOAA}`;

  const fileNOAA = `hms_fire${dateNOAA}.txt`;
  const urlNOAA = `${baseUrlNOAA}/${yearNOAA}/${dayNOAA}/${fileNOAA}`;

  return urlNOAA;
}

// Weather API Response Specification
// https://www.weatherapi.com/docs
function getUrlWeather () {
  const baseUrlWeather = 'http://api.weatherapi.com/v1';

  const methodWeather = 'current.json'
  const paramsWeather = new URLSearchParams({
    token: `${process.env.WEATHER_API_KEY}`, 
    q : "Houston" // TODO: dynamic query - based on lat, long from fire data
  });

  const urlWeather = `${baseUrlWeather}/${methodWeather}` + paramsWeather;

  return urlWeather;
}

export async function GET() {
  const resFIRMS = await fetch(getUrlFIRMS());
  const dataFIRMS = CSVParser.parse(await resFIRMS.text());
 
  const resWeather = await fetch(getUrlWeather());
  const dataWeather = await resWeather.json();
  console.log(dataWeather);

  return Response.json({ data: dataFIRMS });
}