import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link,NavLink } from 'react-router-dom'
import "../styles/HotelsResult.css";

import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import LoginSignup from '../SmallComp/LoginSignup';
import HotelsResultCardsCarousal from "../SmallComp/HotelsResultCardsCarousal";
import Footer from "../SmallComp/Footer";
import { months,days,detailsStatefun,filterStatefun,baseapi } from './Constant';
import { useAuthContext } from './ContextAllData';




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
  
  const { all, setall,logincheck, setlogincheck, tokenAvailability, settokenAvailability,checklogin } = useAuthContext();
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
  // const [tokenAvailability, settokenAvailability] = useState();
  // const [logincheck, setlogincheck] = useState(false);
  const [profiletoggle, setprofiletoggle] = useState(false);


  
  function finishtoken() {
    localStorage.removeItem("token");
    settokenAvailability(false);
    checklogin();
  }

  // function checklogin() {
  //   const token = JSON.parse(localStorage.getItem("token")) || [];
  //   if (typeof token === "string") {
  //     settokenAvailability(true)
  //   }

  // }


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
    if(localStorage.getItem('token')){
      navigate(`/hotels/results/hotelInfo?hotel_id=${hotel_id}&location=${cityparam}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`) 
    }
    else {
      setlogincheck(true);
    }
  


   
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
    <>
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
      
      {logincheck && <LoginSignup settokenAvailability={settokenAvailability} checklogin={checklogin} setlogincheck={setlogincheck} />}
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

            <div className='upperrightIcons flex'>

          <nav className='navUpperHome'>
            {!tokenAvailability && <button className='loginoutBtn' onClick={() => setlogincheck(true)}>Log in / Sign up</button>}
            {tokenAvailability && <button className='profileBtn flexja' onClick={(e) => { setprofiletoggle(!profiletoggle) }} ><svg viewBox="0 0 14 14" height="16px" width="16px" className="c-inherit"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.5"></circle><path fill="currentColor" d="M3,5 C4.38071187,5 5.5,3.88071187 5.5,2.5 C5.5,1.11928813 4.38071187,0 3,0 C1.61928813,0 0.5,1.11928813 0.5,2.5 C0.5,3.88071187 1.61928813,5 3,5 Z" transform="matrix(-1 0 0 1 10 3)"></path><path fill="currentColor" d="M7,9 C9.14219539,9 10.8910789,10.6839685 10.9951047,12.8003597 L11,13 L3,13 C3,10.790861 4.790861,9 7,9 Z"></path><circle cx="7" cy="7" r="7.75" stroke="#FFF" strokeWidth="1.5"></circle></g></svg>
              {JSON.parse(localStorage.getItem("user"))}
              {profiletoggle &&
                <div className='profilePop flexja flexc'>

                  <div className='profileSelectorDiv flexja'>
                    <div className='profileSelectorleft'>
                      <h5>Account</h5>
                      <NavLink to="/bookeddetails"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" d="M13,9.46769027 L13,12 C13,12.5522847 12.5522847,13 12,13 L2,13 C1.44771525,13 1,12.5522847 1,12 L1,9.46769027 L13,9.46769027 Z M8.76884248,1.00969027 C9.32112723,1.00969027 9.76884248,1.45740552 9.76884248,2.00969027 L9.768,3.99969027 L12,4 C12.5522847,4 13,4.44771525 13,5 L13,7.96769027 L1,7.96769027 L1,5 C1,4.44771525 1.44771525,4 2,4 L4.268,3.99969027 L4.26884248,2.00969027 C4.26884248,1.45740552 4.71655774,1.00969027 5.26884248,1.00969027 L8.76884248,1.00969027 Z M8.268,2.509 L5.768,2.509 L5.767,3.99969027 L8.267,3.99969027 L8.268,2.509 Z"></path></g></svg><p>Trips</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" stroke="currentColor" d="M6.66377804,12.0103667 C6.85467399,12.1862449 7.14840775,12.1868013 7.33996863,12.0116476 L7.52037698,11.846694 C10.4133674,9.18600047 11.3179531,8.24297499 11.9494023,7.05369364 C12.2679269,6.45377943 12.4230769,5.8833705 12.4230769,5.29700272 C12.4230769,3.72548999 11.2121985,2.5 9.66538462,2.5 C8.79968324,2.5 7.94470884,2.90670095 7.38258677,3.57477308 L7,4.02947068 L6.61741323,3.57477308 C6.05529116,2.90670095 5.20031676,2.5 4.33461538,2.5 C2.78780146,2.5 1.57692308,3.72548999 1.57692308,5.29700272 C1.57692308,5.88588466 1.73340796,6.4586853 2.05471743,7.06126617 C2.68799666,8.24891226 3.59889285,9.19694245 6.47994688,11.8409976 L6.66377804,12.0103667 Z"></path></g></svg><p>ShortLists</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" d="M4.5,7 C6.43299662,7 8,8.56700338 8,10.5 L8,14 L1,14 L1,10.5 C1,8.56700338 2.56700338,7 4.5,7 Z M10.5002944,9 C11.8810062,9 13.0002944,10.1192881 13.0002944,11.5 L13.0002944,14 L9.50029435,13.9997654 L9.50029435,10.5057654 C9.50029435,10.083454 9.48261395,9.6733711 9.38403764,9.28165365 C9.72780691,9.10132075 10.0848802,9 10.5002944,9 Z M10.5242101,4 C11.6287796,4 12.5242101,4.8954305 12.5242101,6 C12.5242101,7.1045695 11.6287796,8 10.5242101,8 C9.41964058,8 8.52421008,7.1045695 8.52421008,6 C8.52421008,4.8954305 9.41964058,4 10.5242101,4 Z M4.5,1 C5.88071187,1 7,2.11928813 7,3.5 C7,4.88071187 5.88071187,6 4.5,6 C3.11928813,6 2,4.88071187 2,3.5 C2,2.11928813 3.11928813,1 4.5,1 Z"></path></g></svg><p>Travellers</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" d="M10.9938128,1.8893206 C10.9979344,1.92619985 11,1.96327993 11,2.00038878 L11,2.9992998 L2.5,3 C2.25454011,3 2.05039163,3.17687516 2.00805567,3.41012437 L2,3.5 C2,3.74545989 2.17687516,3.94960837 2.41012437,3.99194433 L2.5,4 L12,4 C12.5522847,4 13,4.44771525 13,5 L13,12 C13,12.5522847 12.5522847,13 12,13 L2,13 C1.44771525,13 1,12.5522847 1,12 L1,5 L1.003,4.9462998 L1.00048219,4.89843613 L1,2.89446607 C1,2.38516155 1.38277848,1.95722081 1.88893182,1.90065328 L9.88893182,1.00657599 C10.4377995,0.945234733 10.9324715,1.34045296 10.9938128,1.8893206 Z M11,8 C10.4477153,8 10,8.44771525 10,9 C10,9.55228475 10.4477153,10 11,10 C11.5522847,10 12,9.55228475 12,9 C12,8.44771525 11.5522847,8 11,8 Z"></path></g></svg><p>Cleartrip Wallet</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="c-neutral-400"><path d="M11.1008 6.54288L12.0964 2.82779C12.2011 2.437 11.9417 2.16047 11.6665 2.08674C11.3914 2.01301 10.9756 2.32048 10.9756 2.32048L11.0285 2.1229C11.1856 1.53666 11.085 1.09317 10.7035 0.990929C10.3219 0.888689 9.98632 1.32248 9.85603 1.80873L9.82924 1.90872C9.82924 1.90872 9.6977 1.34976 9.37393 1.263C9.05016 1.17625 8.70913 1.39914 8.57825 1.88757L8.42176 2.47162C8.42176 2.47162 8.48102 1.85917 7.9926 1.7283C7.66883 1.64155 7.32721 1.8666 7.19692 2.35287L6.20149 6.06788C5.88733 7.24035 6.94727 9.31557 8.59504 9.64142C10.1295 9.94486 11.7497 8.81117 12.0638 7.63869L13.0521 5.12688C13.1824 4.64064 13.0005 4.42988 12.7463 4.31421C12.437 4.1735 11.1008 6.54288 11.1008 6.54288Z" fill="#808080" fill-opacity="0.7"></path><path d="M10.2949 4.86084L10.9756 2.32048M10.9756 2.32048L11.0285 2.1229C11.1856 1.53666 11.085 1.09317 10.7035 0.990929C10.3219 0.888689 9.98632 1.32248 9.85603 1.80873L9.82924 1.90872M10.9756 2.32048C10.9756 2.32048 11.3914 2.01301 11.6665 2.08674C11.9417 2.16047 12.2011 2.437 12.0964 2.82779L11.1008 6.54288C11.1008 6.54288 12.437 4.1735 12.7463 4.31421C13.0005 4.42988 13.1824 4.64064 13.0521 5.12688L12.0638 7.63869C11.7497 8.81117 10.1295 9.94486 8.59503 9.64142C6.94727 9.31557 5.88733 7.24035 6.20149 6.06788L7.19692 2.35287C7.32721 1.8666 7.66883 1.64155 7.9926 1.7283C8.48102 1.85917 8.42176 2.47162 8.42176 2.47162M8.42176 2.47162L7.94993 4.23251M8.42176 2.47162L8.57825 1.88757C8.70913 1.39914 9.05016 1.17625 9.37393 1.263C9.6977 1.34976 9.82924 1.90872 9.82924 1.90872M9.82924 1.90872L9.1224 4.54667" stroke="#D1D1D1" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3.95491 9.63425L1.4926 5.36977C1.23368 4.92117 1.46286 4.49322 1.7787 4.31087C2.09454 4.12852 2.71065 4.37097 2.71065 4.37097L2.5797 4.14417C2.19118 3.47123 2.16855 2.88946 2.60655 2.63658C3.04454 2.3837 3.60332 2.80896 3.92558 3.36713L3.99184 3.4819C3.99184 3.4819 3.96929 2.74705 4.34094 2.53248C4.71259 2.3179 5.2082 2.48054 5.5319 3.04121L5.91897 3.71163C5.91897 3.71163 5.64274 2.97387 6.20339 2.65018C6.57504 2.43561 7.0721 2.60072 7.39436 3.1589L9.85642 7.42334C10.6335 8.76921 10.0103 11.6868 8.08052 12.6358C6.28338 13.5196 3.9041 12.6544 3.12706 11.3085L1.07255 8.52971C0.750298 7.97155 0.905398 7.65064 1.1815 7.42334C1.51739 7.14683 3.95491 9.63425 3.95491 9.63425Z" fill="#808080"></path><path d="M4.39424 7.28703L2.71065 4.37097M2.71065 4.37097L2.5797 4.14417C2.19118 3.47123 2.16855 2.88946 2.60655 2.63658C3.04454 2.3837 3.60332 2.80896 3.92558 3.36713L3.99184 3.4819M2.71065 4.37097C2.71065 4.37097 2.09454 4.12852 1.7787 4.31087C1.46286 4.49322 1.23368 4.92117 1.4926 5.36977L3.95491 9.63425C3.95491 9.63425 1.51739 7.14683 1.1815 7.42334C0.905398 7.65064 0.750298 7.97155 1.07255 8.52971L3.12706 11.3085C3.9041 12.6544 6.28338 13.5196 8.08052 12.6358C10.0103 11.6868 10.6335 8.76921 9.85643 7.42334L7.39436 3.1589C7.0721 2.60072 6.57504 2.43561 6.20339 2.65018C5.64274 2.97387 5.91897 3.71163 5.91897 3.71163M5.91897 3.71163L7.08598 5.73295M5.91897 3.71163L5.5319 3.04121C5.2082 2.48054 4.71259 2.3179 4.34094 2.53248C3.96929 2.74705 3.99184 3.4819 3.99184 3.4819M3.99184 3.4819L5.74011 6.50999" stroke="#B3B3B3" strokeWidth="0.545068" strokeLinecap="round" strokeLinejoin="round"></path></svg> <p>Hi-Five</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" d="M0.646446609,6.64644661 L0.590530795,6.71219845 C0.362196938,7.03084485 0.584244403,7.5 1,7.5 L4.5,7.5 L4.5,13 C4.5,13.2761424 4.72385763,13.5 5,13.5 L9,13.5 L9.08987563,13.4919443 C9.32312484,13.4496084 9.5,13.2454599 9.5,13 L9.5,7.5 L13,7.5 C13.4454524,7.5 13.6685358,6.96142904 13.3535534,6.64644661 L7.35355339,0.646446609 C7.15829124,0.451184464 6.84170876,0.451184464 6.64644661,0.646446609 L0.646446609,6.64644661 Z"></path></g></svg><p>Expressway</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 103 94" height="16" width="16" fill="#999" className=""><path fillRule="evenodd" d="M63.869 3.11c.615 2.336 5.017 2.131 6.55 3.684 1.937 1.962 3.359 6.55 3.372 9.708.007 1.8.09 3.601-.175 5.741-.062.5-.206 4.238-.421 6.56-.104 1.114.088 1.422.923 1.736.95.36 1.285 1.421.966 2.904-.677 3.16-1.535 10.722-2.636 12.758-.29.536-.834.943-1.283 1.048-.777.323-1.274.288-1.572 1.59-1.025 4.704-1.89 8.855-2.81 11.921-.608 1.072-1.06 1.418-1.766 1.91-.497.345-1.406 1.255-1.477 1.919-.181 1.702.313 3.77 1.954 4.561 10.353 3.892 22.675 9.347 30.774 11.252 5.516 1.298 6.503 7.34 6.503 12.871H0C0 87.742.987 81.7 6.503 80.402c8.099-1.905 20.42-7.36 30.773-11.252 1.642-.792 2.136-2.86 1.954-4.561-.07-.664-.98-1.574-1.477-1.92-.706-.49-1.157-.837-1.766-1.909-.92-3.066-1.785-7.217-2.809-11.921-.299-1.302-.796-1.267-1.573-1.59-.448-.105-.993-.512-1.282-1.048-1.1-2.036-1.96-9.598-2.637-12.758-.318-1.483.016-2.545.966-2.904.836-.314 1.027-.622.924-1.736-.216-2.322-.36-6.06-.421-6.56-.266-2.14-.337-3.95-.175-5.74.273-3.017 1.6-6.19 3.628-7.925 4.034-3.451 9.842-6.096 15.157-7.48 2.027-.53 5.15-1.022 8.08-1.086 2.482-.053 7.188-.078 8.024 3.097"></path></svg><p>Profile</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-neutral-400"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><g transform="translate(-.5)"><path stroke="currentColor" strokeWidth="2" d="M7.5,11.7619821 C10.1233526,11.7619821 12.25,9.63533468 12.25,7.01198212 C12.25,4.38862956 10.1233526,2.26198212 7.5,2.26198212 C4.87664744,2.26198212 2.75,4.38862956 2.75,7.01198212 C2.75,9.63533468 4.87664744,11.7619821 7.5,11.7619821 Z"></path><g fill="currentColor" transform="translate(6)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g><g fill="currentColor" transform="rotate(-45 4.5 -.243)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g><g fill="currentColor" transform="rotate(45 4.5 14.243)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g><g fill="currentColor" transform="rotate(90 4.5 10)"><polygon points=".5 11 2.5 11 2.5 14 .5 14"></polygon><polygon points=".5 0 2.5 0 2.5 3 .5 3"></polygon></g></g></g></svg><p>Settings</p></p></NavLink>
                    </div>
                    <div className='profileSelectorright'>
                      <h5>Quick tools</h5>
                      <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" className="c-secondary-500" height="16" width="16"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" d="M7,0.506145606 C10.5898509,0.506145606 13.5,3.41629473 13.5,7.00614561 C13.5,10.5959965 10.5898509,13.5061456 7,13.5061456 C3.41014913,13.5061456 0.5,10.5959965 0.5,7.00614561 C0.5,3.41629473 3.41014913,0.506145606 7,0.506145606 Z M7,2.00614561 C4.23857625,2.00614561 2,4.24472186 2,7.00614561 C2,9.76756936 4.23857625,12.0061456 7,12.0061456 C9.76142375,12.0061456 12,9.76756936 12,7.00614561 C12,4.24472186 9.76142375,2.00614561 7,2.00614561 Z M9.95170499,6.25 L9.95170499,7.75 L4,7.75 L4,6.25 L9.95170499,6.25 Z"></path></g></svg><p>Cancellations</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" className="c-secondary-500" height="16" width="16"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" d="M10.2668078,7.9689266 L12.8037656,10.4358768 C13.0747077,10.6993422 13.0993388,11.1151056 12.8776589,11.4062615 L12.8037656,11.4895931 L10.2668078,13.9565433 L9.21220667,12.902827 L10.3256362,11.8201617 C9.09324498,11.7008095 8.15528162,11.3539959 7.53165946,10.7438555 L7.39333574,10.5983631 L8.49545964,9.59597947 L8.57836232,9.68117546 C8.90069746,9.98312464 9.45117369,10.1985626 10.2448054,10.3004475 L10.4902046,10.3275793 C10.5070205,10.3291543 10.5293571,10.3305626 10.5571255,10.3318005 L9.21220667,9.02264295 L10.2668078,7.9689266 Z M10.2668078,0.0434566847 L12.8037656,2.51040687 C13.0747077,2.77387225 13.0993388,3.18963564 12.8776589,3.48079157 L12.8037656,3.56412322 L10.2668078,6.0310734 L9.21220667,4.97735705 L10.36,3.861 L9.90547203,3.86319783 C7.75690071,3.85907413 6.766746,4.78606842 6.70312299,6.87606591 L6.6998369,7.0964307 C6.6998369,10.1345163 4.79337963,11.76317 1.29936687,11.8611255 L1.02747077,11.8656394 L0.00323858539,11.8679129 L-3.01092484e-13,10.366261 L1.02189677,10.3639964 C3.84757515,10.3486777 5.14036442,9.36504783 5.21612054,7.29380019 L5.21966679,7.0964307 C5.21966679,4.1050435 6.77779721,2.44923727 9.6542424,2.36492217 L10.51,2.358 L9.21220667,1.09717303 L10.2668078,0.0434566847 Z M1.03670265,2.59215268 L1.34961383,2.59595624 C2.88866715,2.63405802 4.04499582,2.95941162 4.81023737,3.61667181 L4.9580687,3.75256249 L3.92748451,4.8304344 L3.82564589,4.73926653 C3.3540282,4.35409048 2.51563444,4.12564382 1.30241769,4.09689616 L1.03670265,4.09380823 L0.0016192927,4.09380823 L0.0016192927,2.59215268 L1.03670265,2.59215268 Z"></path></g></svg><p>Change flight</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-secondary-500"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" d="M5.5,1 C5.5,1.82842712 6.17157288,2.5 7,2.5 C7.82842712,2.5 8.5,1.82842712 8.5,1 L11,1 C11.5522847,1 12,1.44771525 12,2 L12,12 C12,12.5522847 11.5522847,13 11,13 L8.5,13 C8.5,12.1715729 7.82842712,11.5 7,11.5 C6.17157288,11.5 5.5,12.1715729 5.5,13 L3,13 C2.44771525,13 2,12.5522847 2,12 L2,2 C2,1.44771525 2.44771525,1 3,1 L5.5,1 Z M4.402,2.499 L3.5,2.499 L3.5,6 L5,6 L5,7.5 L3.5,7.5 L3.5,11.499 L4.402,11.499 L4.46706391,11.3917355 C4.96982923,10.6015566 5.83218191,10.0625441 6.82372721,10.0050927 L7,10 C8.06512059,10 9.00059634,10.5550755 9.53293609,11.3917355 L9.597,11.499 L10.5,11.499 L10.5,7.5 L9,7.5 L9,6 L10.5,6 L10.5,2.499 L9.597,2.499 L9.53293609,2.60826455 C9.03017077,3.39844335 8.16781809,3.93745585 7.17627279,3.99490731 L7,4 C5.93487941,4 4.99940366,3.44492446 4.46706391,2.60826455 L4.402,2.499 Z M8,6 L8,7.5 L6,7.5 L6,6 L8,6 Z"></path></g></svg><p>print ticket</p></p></NavLink>
                      <NavLink to="/under-maintainance"><p className='profileSelectors rightPS flexa'><svg viewBox="0 0 14 14" height="16" width="16" className="c-secondary-500"><g fill="none" fillRule="evenodd"><rect width="14" height="14" fill="#FFF" opacity="0"></rect><path fill="currentColor" fillRule="nonzero" d="M5.5,1 C5.5,1.82842712 6.17157288,2.5 7,2.5 C7.82842712,2.5 8.5,1.82842712 8.5,1 L11,1 C11.5522847,1 12,1.44771525 12,2 L12,12 C12,12.5522847 11.5522847,13 11,13 L8.5,13 C8.5,12.1715729 7.82842712,11.5 7,11.5 C6.17157288,11.5 5.5,12.1715729 5.5,13 L3,13 C2.44771525,13 2,12.5522847 2,12 L2,2 C2,1.44771525 2.44771525,1 3,1 L5.5,1 Z M4.402,2.499 L3.5,2.499 L3.5,6 L5,6 L5,7.5 L3.5,7.5 L3.5,11.499 L4.402,11.499 L4.46706391,11.3917355 C4.96982923,10.6015566 5.83218191,10.0625441 6.82372721,10.0050927 L7,10 C8.06512059,10 9.00059634,10.5550755 9.53293609,11.3917355 L9.597,11.499 L10.5,11.499 L10.5,7.5 L9,7.5 L9,6 L10.5,6 L10.5,2.499 L9.597,2.499 L9.53293609,2.60826455 C9.03017077,3.39844335 8.16781809,3.93745585 7.17627279,3.99490731 L7,4 C5.93487941,4 4.99940366,3.44492446 4.46706391,2.60826455 L4.402,2.499 Z M8,6 L8,7.5 L6,7.5 L6,6 L8,6 Z"></path></g></svg><p>print hotel voucher</p></p></NavLink>
                    </div>
                  </div>
                  <div className='SignoutBtn' onClick={() => { finishtoken(); setall((prev) => ({ ...prev, ["token"]: "" })) }}>Log out</div>
                </div>}
            </button>}
          </nav>
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
     
    </div>
    <Footer/>
    </>
  )
}