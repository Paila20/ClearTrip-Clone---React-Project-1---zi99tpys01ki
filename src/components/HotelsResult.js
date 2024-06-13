import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "../styles/HotelsResult.css";

import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';

import HotelsResultCardsCarousal from "../SmallComp/HotelsResultCardsCarousal";
import Footer from "../SmallComp/Footer";
import { months,days,detailsStatefun,filterStatefun,baseapi } from './Constant';




export default function HotelsResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let cityparam = searchParams.get("location");
  let dayOfWeek = searchParams.get("date");
  let adults = JSON.parse(searchParams.get("adults"));
  let childrens = JSON.parse(searchParams.get("childrens"));
  let rooms = searchParams.get("rooms");
  const dateObject = new Date(dayOfWeek);
  
  
  const {filter,setfilter}=filterStatefun();
  const {details,setdetails}=detailsStatefun();
  const [searchhoteldata, setsearchhoteldata] = useState();
  const [inputvalue, setinputvalue] = useState(cityparam);
  const [navanimate, setnavanimate] = useState({});
  const [datego, setdatego] = useState(dateObject);
  const [daygo, setdaygo] = useState(days[dateObject.getDay()]);
  // const [monthgo, setmonthgo] = useState(months[dateObject.getMonth()])
  // const [datere,setdatere]=useState(dateObject)
  // const [dayre,setdayre]=useState(days[dateObject.getDay()]) 
  // const [monthre,setmonthre]=useState(months[dateObject.getMonth()]);
  const [pagination, setpagination] = useState(1);
  const [pop, setpop] = useState({});
  const [toggle, settoggle] = useState(true);
  const [dataa, setdataa] = useState([]);
  const [loader, setloader] = useState(false);
  const [totalelementsforpagination,settotalelementsforpagination]=useState();


  function filterr() {
    setpop({});
    settoggle(!toggle);
  }
  function popp(key) {
    setpop({});
    setpop({ [key]: !pop[key] })
  }
  
 
  function filterchanger(key, value) {
    setfilter((prev) => ({ ...prev, [key]: value === filter[key] ? "" : value }));
}

function filterchangerforrating(key, value) {
  setfilter((prev) => ({ ...prev, [key]: value === filter[key] ? "1" : value }));
}


  function guestscalc(key1, key2) {
    key1 == "increase" ? setdetails((prev) => ({ ...prev, [key2]: details[key2] + 1 })) : setdetails((prev) => ({ ...prev, [key2]: details[key2] - 1 }));
  }

  function popupnavanimate(key) {
    setnavanimate({});
    setnavanimate((prev) => ({ ...prev, [key]: !navanimate[key] }));
  }

  function closedynamicpop(key) {
    setnavanimate((prev) => ({ [prev]: false }))
    setnavanimate((prev) => ({ ...prev, [key]: true }))
  }

  function trueFinderpop() {
    return Object.keys(navanimate).length;
}


  
  function navigatecurrentpage() {
    navigate(`/hotels/results?location=${inputvalue}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${datego}`)
  }
  function navigatecardinfo(hotel_id) {

      navigate(`/hotels/results/hotelInfo?hotel_id=${hotel_id}&location=${cityparam}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`)
   
  }
  const fetchdataHotelInputFields = async (valuee) => {
    try {
      const response = await (await fetch(`${baseapi}/hotel?search={"location":"${valuee}"}`,
        {
          method: "GET",
          headers: {
            projectID: "afznkxyf8vti",
            "Content-Type": "application/json",
          }
        }
      )).json();
      const arr= response.data.hotels.map(item =>{return item.location})
      setsearchhoteldata(new Set(arr));
    } catch (error) {
      alert(error);
    }
  }
  function sortingincreaseordecrease(value) {
    if (filter.pricehighlow == "") {
      return value;
    }
    else if (filter.pricehighlow == "hightolow") {
      return value.sort((a, b) => b.avgCostPerNight - a.avgCostPerNight);
    }
    else if (filter.pricehighlow == "lowtohigh") {
      return value.sort((a, b) => a.avgCostPerNight - b.avgCostPerNight);
    }
  }

 
  const fetchMaindataHotels = useMemo(async () => {
    try { 
      setloader(false);
      const response = await (await fetch(`${baseapi}/hotel?search={"location":"${cityparam}"}&filter={"rating":{"$gte":"${filter["rating"]}"}}&limit=10&page=${pagination}`,
        {
          method: "GET",
          headers: {
            projectID: "afznkxyf8vti",
            "Content-Type": "application/json",
          }
        }
      )).json();
      console.log(response)
      settotalelementsforpagination(response.totalResults)
      setdataa(sortingincreaseordecrease(response.data.hotels))
     
      setloader(true);
    } catch (error) {
      alert(error);
    }
  }, [toggle, cityparam,pagination])

  useEffect(() => {
    fetchdataHotelInputFields("");
    fetchMaindataHotels;
   
  }, [])
  return (
    <div className='HotelsResult flexa flexc'>


      <div className={`navbaranimate ${trueFinderpop() > 0 ? "animatedown" : "animateup"} flexja`}>
        <div className='upperCenterdivDynamic flexja b1 g5'>
          <div>
          <div className='hotelInputdynamic flexa g10' onClick={(e) => { closedynamicpop("hotel") }} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z"></path><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
            <input className='inputdynamic' type='text' value={inputvalue} onChange={(e) => { setinputvalue(e.target.value); fetchdataHotelInputFields(e.target.value) }} />
            {navanimate["hotel"] && <div className='popdynamichotelInput' onClick={(e) => { e.stopPropagation() }}>
              {Array.from(searchhoteldata).map((item) => (
              
                <div className='hotelMainPageInput flexa' onClick={(e) => { e.stopPropagation(); setnavanimate({ ["hotel"]: false }); setinputvalue(item) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="dropdown-new__item-stroke--icon listItemHover"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z" stroke='black'></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke='black'></path></svg>&nbsp;&nbsp;{item}</div>
           
              ))}

            </div>}
          </div>
          <div className='dateInputUpperdynamic flexa'>
            <div className='dateInputStaticInnerLeftdynamic flexja g5' onClick={() => { closedynamicpop("goingdate") }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path></svg>
              <p>{`${datego.getDate()} ${daygo}'${datego.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
              {navanimate["goingdate"] && <Calendar minDate={new Date()} onChange={(date, e) => { e.stopPropagation(); setnavanimate({ ["goingdate"]: false }); setdatego(date); setdaygo(days[date.getDay()]); setmonthgo(months[date.getMonth()]) }} className="calendarForGoing" />}
            </div>
            <div className='datecenterline'></div>
                <div className='dateInputStaticInnerRightdynamic flexja g5' onClick={() => { closedynamicpop("returndate") }} >
                  <p>{`${datego.getDate()} ${daygo}'${datego.getFullYear().toString().match(/\d{2}$/)[0]}`}</p>
                  {navanimate["returndate"] && <Calendar minDate={datego} onChange={(date, e) => { e.stopPropagation(); setnavanimate({ ["returndate"]: false }); }} className="calendarForGoing" />}
                </div>
          </div>
          <div className='roomsAndGuestsdynamic flexja g5' onClick={() => { closedynamicpop("room") }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path></svg>
            <p>{details["room"]} room, {details["adults"] + details["children"]} guests</p>
            {navanimate["room"] && <div className='roomPopDynamic flexa flexc g20'>
              <div className='flexa'>
                <div>
                  <h4>Rooms</h4>
                  <p>AC rooms</p>
                </div>
                <div className='buttondivguests flexa'>
                  <button className={details["room"] == 1 ? "opacitydecrease" : ""} onClick={() => { guestscalc("decrease", "room") }} disabled={details["room"] == 1}>-</button>
                  <span>{details["room"]}</span>
                  <button className={details["children"] + details["adults"] == details["room"] ? "opacitydecrease" : ""} onClick={() => { guestscalc("increase", "room") }} disabled={details["children"] + details["adults"] == details["room"]}>+</button>
                </div>
              </div>
              <div className='flexa'>
                <div>
                  <h4>Adults over 12 Years</h4>
                  <p>12+ years</p>
                </div>
                <div className='buttondivguests flexa'>
                  <button className={details["adults"] == 1 ? "opacitydecrease" : ""} onClick={() => { guestscalc("decrease", "adults") }} disabled={details["adults"] == 1}>-</button>
                  <span>{details["adults"]}</span>
                  <button onClick={() => { guestscalc("increase", "adults") }}>+</button>
                </div>
              </div>
              <div className='flexa'>
                <div>
                  <h4>Children</h4>
                  <p>1 - 11 years</p>
                </div>
                <div className='buttondivguests flexa'>
                  <button className={details["children"] == 0 ? "opacitydecrease" : ""} onClick={() => { guestscalc("decrease", "children") }} disabled={details["children"] == 0}>-</button>
                  <span>{details["children"]}</span>
                  <button onClick={() => { guestscalc("increase", "children") }} disabled={details["children"] == details["adults"]}>+</button>
                </div>
              </div>
              <button className='guestsDoneButton' onClick={(e) => { e.stopPropagation(); setnavanimate({ ["room"]: false }) }}>Done</button>
            </div>}
          </div>
        </div>
        </div>
        <button onClick={() => { setnavanimate({}); navigatecurrentpage(); }}>Update</button>
      </div>

      <nav className='navFlightResults flexja'>
        <div className='innernav'>
          <div className='uppernav flexa'>
            <div className='upperLeftIcons flex'>
              <Link to="/"><svg width="107" height="24" viewBox="0 0 310 65" fill="none" ><path d="M249.469 16.3906C243.189 16.3906 240.039 19.1706 240.039 25.4606V49.1506H247.469V25.8206C247.469 23.7506 248.399 22.7506 250.539 22.7506H257.039V16.3906H249.469V16.3906Z" fill="#FF4F17"></path><path d="M264.891 1.59961C262.461 1.59961 260.461 3.59961 260.461 6.09961C260.461 8.59961 262.461 10.5296 264.891 10.5296C267.321 10.5296 269.391 8.52961 269.391 6.09961C269.391 3.66961 267.391 1.59961 264.891 1.59961Z" fill="#FF4F17"></path><path d="M268.61 16.2402H261.25V49.0902H268.61V16.2402Z" fill="#FF4F17"></path><path d="M121.289 42.8804C119.149 42.8804 118.219 42.3104 118.219 40.1704V1.65039H110.789V40.1704C110.789 46.6704 114.429 49.2404 120.139 49.2404H124.069V42.8804H121.289V42.8804Z" fill="#FF4F17"></path><path d="M209.119 16.2695C202.839 16.2695 199.689 19.0495 199.689 25.3395V49.1195H207.119V25.6995C207.119 23.6295 208.049 22.6295 210.189 22.6295H216.689V16.2695H209.119Z" fill="#FF4F17"></path><path d="M228.33 16.2998V8.08984H220.9V40.0798C220.9 46.2898 224.11 49.1498 230.33 49.1498H235.9V42.7898H231.4C229.4 42.7898 228.33 42.0798 228.33 40.0798V22.6598H235.9V16.2998H228.33V16.2998Z" fill="#FF4F17"></path><path d="M274.82 16.5006V63.3706H282.25V46.3006C284.91 48.1406 288.13 49.2306 291.6 49.2306C300.67 49.2306 308.02 41.8806 308.02 32.8106C308.02 23.7406 300.67 16.3906 291.6 16.3906C288.12 16.3906 284.9 17.4806 282.25 19.3206V16.5006H274.82V16.5006ZM282.25 32.8106C282.25 27.6406 286.44 23.4606 291.6 23.4606C296.76 23.4606 300.95 27.6506 300.95 32.8106C300.95 37.9706 296.76 42.1606 291.6 42.1606C286.44 42.1606 282.25 37.9706 282.25 32.8106V32.8106Z" fill="#FF4F17"></path><path d="M156.92 32.1006C156.92 22.1006 150.21 16.3906 141.42 16.3906C131.57 16.3906 125.5 23.2506 125.5 32.7406C125.5 42.2306 132.21 49.2406 141.57 49.2406C149.85 49.2406 154.21 45.5306 156.28 39.3906H148.28C147.07 41.7506 144.78 42.8206 141.42 42.8206C136.99 42.8206 133.35 40.0406 133.07 35.0406H156.78C156.92 33.4706 156.92 32.7506 156.92 32.1106V32.1006ZM133.14 29.7406C133.78 25.3806 136.85 22.7406 141.64 22.7406C146.43 22.7406 149.07 25.2406 149.49 29.7406H133.14Z" fill="#FF4F17"></path><path d="M98.8005 37.9506C97.5905 41.3806 95.3005 42.8106 91.8705 42.8106C86.2305 42.8106 83.8005 38.3806 83.8005 32.7406C83.8005 27.1006 86.5805 22.7406 92.0105 22.7406C95.4405 22.7406 97.7205 24.5306 98.7905 27.6006H106.72C104.86 20.1006 99.2905 16.3906 91.8705 16.3906C81.8705 16.3906 76.2305 23.5306 76.2305 32.7406C76.2305 42.7406 82.8705 49.2406 91.8705 49.2406C100.87 49.2406 105.22 44.1706 106.72 37.9606H98.7905L98.8005 37.9506Z" fill="#FF4F17"></path><path d="M56.6095 17.7393C44.1095 26.8793 33.3295 38.8793 23.6895 48.9493C22.9795 49.6593 22.0495 50.1593 21.0495 50.1593C19.8395 50.1593 18.9095 49.4493 18.0495 48.1593C15.5495 44.4493 11.7695 35.4493 10.0495 31.5193C8.68954 28.3093 9.40954 25.6593 12.6195 24.3093C15.8295 23.0193 19.3995 22.8093 20.2595 26.4493C20.2595 26.4493 21.8995 32.8093 22.3995 34.6593C32.3295 25.4493 44.5395 15.6693 54.8895 9.66929C52.3195 4.80929 47.2495 1.5293 41.4695 1.5293H16.9795C8.54954 1.5293 1.76953 8.30929 1.76953 16.6693V41.2293C1.76953 49.5793 8.54954 56.3693 16.9795 56.3693H41.4695C49.8195 56.3693 56.6095 49.5893 56.6095 41.2293V17.7393V17.7393Z" fill="#FF4F17"></path><path d="M186.059 16.5006V19.3206C183.399 17.4806 180.179 16.3906 176.709 16.3906C167.639 16.3906 160.289 23.7406 160.289 32.8106C160.289 41.8806 167.639 49.2306 176.709 49.2306C180.189 49.2306 183.409 48.1406 186.059 46.3006V49.0906H193.489V16.5006H186.059ZM176.709 42.1606C171.539 42.1606 167.359 37.9706 167.359 32.8106C167.359 27.6506 171.549 23.4606 176.709 23.4606C181.869 23.4606 186.059 27.6506 186.059 32.8106C186.059 37.9706 181.869 42.1606 176.709 42.1606Z" fill="#FF4F17"></path></svg></Link>
            </div>
            <div className='upperCenterdiv flexja g5' onClick={() => { popupnavanimate("hotel") }}>
              <div className='hotelInputStatic flexa' >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z"></path><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
                <p>{cityparam}</p>
              </div>
              <div className='dateInputUpperStatic flexa' onClick={() => { popupnavanimate("goingdate") }}>
                <div className='dateInputStaticInnerLeftStatic flexja g5' >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path></svg>
                  <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
                </div>
              
              </div>
              <div className='roomsAndGuestsStatic flexja g5' onClick={() => { popupnavanimate("room") }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path></svg>
                <p>{rooms} room, {adults + childrens} guests</p>
              </div>

            </div>
           
          </div>
          <div className='HotelsResultDownNav flexja'>
            <div className="hotelsresult-recommended flexa" onClick={() => { popp("highlow") }}>
              <p>Sort by: Recommended</p>
              &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${pop["highlow"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
              {pop["highlow"] && <div className='hotelsresult-recommended-pop flex flexc g20' onClick={(e) => { e.stopPropagation(); }}>
                <h3>Sort hotels by</h3>
                <div className='flex flexc g20'>
                  <div className='flexa g5'
                   onClick={() => { filterchanger("pricehighlow", "hightolow"),filterr() }}>
                    <p>Price: High to Low</p>
                    </div>
                  <div className='flexa g5'
                   onClick={() => { filterchanger("pricehighlow", "lowtohigh"),filterr() }}>
                   <p>Price: Low to High</p>
                   </div>
                </div>
              
              </div>}
            </div>
          
            <div className="hotelsresult-guestrating flexa" onClick={() => { popp("guestrating") }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.1" stroke="#1A1A1A" strokeWidth="0.8"></circle><path d="M6.54626 10.6369C6.49483 10.6695 6.42957 10.6239 6.44262 10.5644L6.80371 8.91793C6.81656 8.85936 6.79731 8.79837 6.75317 8.75778L5.53079 7.63381C5.48709 7.59363 5.51168 7.52069 5.57077 7.51515L7.16572 7.36572C7.22822 7.35986 7.28228 7.31975 7.30601 7.26164L7.93616 5.71834C7.95939 5.66144 8.04001 5.66154 8.0631 5.71851L8.69403 7.27518C8.71767 7.3335 8.77183 7.37379 8.83449 7.37966L10.4274 7.5289C10.4866 7.53445 10.5111 7.60773 10.4671 7.64779L9.24747 8.75767C9.20296 8.79818 9.18343 8.85936 9.19624 8.91817L9.55739 10.5764C9.57038 10.636 9.50474 10.6816 9.45338 10.6486L8.09073 9.77238C8.03551 9.73688 7.96471 9.73667 7.90928 9.77184L6.54626 10.6369ZM5.63153 11.2922C5.56475 11.5931 5.89497 11.8248 6.15523 11.6595L7.96327 10.5115C7.98569 10.4972 8.01431 10.4972 8.03673 10.5115L9.84477 11.6595C10.105 11.8248 10.4352 11.5931 10.3685 11.2922L9.8815 9.09716C9.87618 9.07319 9.88409 9.04821 9.90224 9.03168L11.5367 7.54209C11.7592 7.33927 11.6348 6.96866 11.3349 6.94128L9.2023 6.74661C9.17673 6.74427 9.1546 6.72783 9.14499 6.70401L8.32114 4.66226C8.20455 4.3733 7.79546 4.3733 7.67886 4.66226L6.85501 6.70401C6.8454 6.72783 6.82327 6.74427 6.7977 6.74661L4.66509 6.94128C4.36523 6.96866 4.24076 7.33927 4.46331 7.54209L6.09776 9.03168C6.11591 9.04821 6.12382 9.07319 6.1185 9.09716L5.63153 11.2922Z" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="0.1"></path></svg>
              <p>Guest Ratings</p>
              &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${pop["guestrating"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
              {pop["guestrating"] && <div className='hotelsresult-guestrating-pop flex flexc' onClick={(e) => { e.stopPropagation(); }}>
                <h3>Guest Ratings</h3>
                <div className='flexa g10' onClick={() => { filterchangerforrating("rating", "4.5") ,filterr()}}>
                  <div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "4.5" ? "blackbackground" : ""}`}><div></div></div></div>
                  <p>4.5 & above</p>
                  </div>
                <div className='flexa g10' onClick={() => { filterchangerforrating("rating", "4"),filterr() }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "4" ? "blackbackground" : ""}`}><div></div></div></div><p>4 & above</p></div>
                <div className='flexa g10' onClick={() => { filterchangerforrating("rating", "3.5"),filterr() }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "3.5" ? "blackbackground" : ""}`}><div></div></div></div><p>3.5 & above</p></div>
                <div className='flexa g10' onClick={() => { filterchangerforrating("rating", "3"),filterr() }}><div className='relativecolorinput'><div className={`absolutecolordiv flexja ${filter["rating"] == "3" ? "blackbackground" : ""}`}><div></div></div></div><p>3 & above</p></div>

                </div>}
            </div>
           
          </div>

        </div>
      </nav>
      <div className='hotelsresult-maindivbody flexa flexc '>
        {
          loader && (
            dataa.length > 0 && (
              <div className='hotelsresult-rendergrid flexja flexc'>
                {dataa.map((item, index) => (filter["pricehigh"] > item.avgCostPerNight && filter["pricelow"] < item.avgCostPerNight && (filter["stars"]!="" ? filter["stars"]==item.amenities.length : true)  && (
                  <div key={index} className='hotelsresult-card' onClick={() => { navigatecardinfo(item._id) }}>
                    <div className='img'><HotelsResultCardsCarousal data={item.images} /></div>
                    <div className='flex flexc g10'>
                      <div className='flexa flexc g5'>
                        <div className='flexa hotelsresultcard-firstline'>
                          <p>{item.name},&nbsp;{item.location}</p>
                          <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12" className=""><path fill="#1a1a1a" d="M16.603 3.717L18 2.202h-3.097a9.696 9.696 0 00-10.886 0H.912l1.397 1.515A4.257 4.257 0 00.914 6.676a4.243 4.243 0 001.121 3.072 4.269 4.269 0 002.977 1.373 4.283 4.283 0 003.075-1.137l1.369 1.485 1.368-1.483a4.26 4.26 0 002.9 1.133 4.264 4.264 0 004.271-4.256 4.234 4.234 0 00-1.392-3.146zM5.186 9.742a2.896 2.896 0 01-2.67-1.778 2.871 2.871 0 01.627-3.138 2.892 2.892 0 013.148-.624 2.887 2.887 0 011.784 2.66A2.872 2.872 0 017.229 8.9a2.89 2.89 0 01-2.043.843zm4.27-2.963c0-1.895-1.384-3.521-3.207-4.217a8.361 8.361 0 016.413 0c-1.823.696-3.206 2.322-3.206 4.217zm4.268 2.963a2.896 2.896 0 01-2.669-1.778 2.872 2.872 0 01.626-3.138 2.892 2.892 0 013.15-.624 2.887 2.887 0 011.783 2.66c0 .764-.305 1.497-.847 2.037a2.894 2.894 0 01-2.043.843zm0-4.39a1.518 1.518 0 00-1.399.933 1.504 1.504 0 00.328 1.645 1.516 1.516 0 002.586-1.068c0-.4-.16-.784-.444-1.067a1.517 1.517 0 00-1.07-.442zM6.7 6.863a1.506 1.506 0 01-.935 1.395 1.52 1.52 0 01-1.65-.327 1.508 1.508 0 011.07-2.577 1.518 1.518 0 011.401.931c.076.184.115.38.115.578z"></path></svg> {item.rating}/5</span>
                        </div>
                        <div className='hotelsresultcard-secondline flex'>
                          <span>{item.amenities.length}-star hotel</span>
                          <p>{item.rooms.length}K ratings</p>
                        </div>
                      </div>
                      <div className='flexa flexc g5'>
                        <div className='hotelsresultcard-thirdline'>
                          <p className='flexa'><h2>₹{item.avgCostPerNight && item.avgCostPerNight.toString().match(/^(\d+)\./) ? item.avgCostPerNight.toString().match(/^(\d+)\./)[1].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.avgCostPerNight.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h2>&nbsp; + ₹{((item.avgCostPerNight * 12) / 100).toString().match(/^(\d+)(?=\.)/)[0]} tax / night</p>
                        </div>
                        <div className='flexa g5 hotelsresultcard-fourthline'>
                          <span className='hotelsresult-greenoffer'>52% off</span>
                          <p> + Additional bank discouts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            )
          )
        }
      {!loader && <div className="lds-dual-ring"></div>}
      {loader && <div className='flexa paginationbuttondiv'>
        <button onClick={()=>{setTimeout(()=>{setpagination(pagination-1)},500)}} className={pagination==1?"disabledcolor":""} disabled={pagination==1}>Prev</button>
        <p className='flexja'>{pagination}-page</p>
        <button onClick={()=>{setTimeout(()=>{setpagination(pagination+1)},500)}} className={(+totalelementsforpagination/10)===pagination?"disabledcolor":""} disabled={(+totalelementsforpagination/10)===pagination}>Next</button>
      </div>}
      </div>
      <Footer/>
    </div>
  )
}