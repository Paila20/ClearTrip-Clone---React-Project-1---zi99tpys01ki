import React, { useMemo, useState, useEffect, useRef } from 'react'
import "../styles/HotelsCardInfo.css";
import Calendar from 'react-calendar';
import LoginSignup from '../SmallComp/LoginSignup';
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { GiSparkles, GiMeal, GiGymBag } from "react-icons/gi";
import { MdOutlineVerified, MdRestaurant, MdTableBar, MdOutlineSignalWifi4Bar, MdOutlineFreeCancellation } from "react-icons/md";
import { FaPersonSwimming, FaSprayCanSparkles } from "react-icons/fa6";
import HotelsCardInfoCarousalFirst from "../SmallComp/HotelsCardInfoCarousalFirst"
import Footer from '../SmallComp/Footer';
import { months,days,HotelsCardInfoStatefun,baseapi } from './Constant';

export default function HotelsCardInfo() {
  const carddivbuttonroom=useRef();
  const navdivbuttonroom=useRef()
  const generalref=useRef();
  const amenitieref=useRef();
  const roomref=useRef();
  const colorrating = useRef([]);
  const colorratinghalf = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let hotel_id = searchParams.get("hotel_id");
  let cityparam = searchParams.get("location");
  let adults = JSON.parse(searchParams.get("adults"));
  let childrens = JSON.parse(searchParams.get("childrens"));
  let rooms = searchParams.get("rooms");
  let dayOfWeek = searchParams.get("date");
  const dateObject = new Date(dayOfWeek);

  const {details,setdetails}=HotelsCardInfoStatefun();
  const [dataa, setdataa] = useState({});
  const [loader, setloader] = useState(false);
  const [navanimate, setnavanimate] = useState({});
  const [inputvaluehotel, setinputvaluehotel] = useState(cityparam);
  const [inputvaluehotelid, setinputvaluehotelid] = useState(hotel_id);
  const [logincheck, setlogincheck] = useState(false)
  const [datego, setdatego] = useState(dateObject);
  const [daygo, setdaygo] = useState(days[dateObject.getDay()]);
  const [monthgo, setmonthgo] = useState(months[dateObject.getMonth()])
  const [searchhoteldata, setsearchhoteldata] = useState();
  const [toggle, settoggle] = useState(true);
  const [roomcarddetailspop, setroomcarddetailspop] = useState(false);
  const [sidebardata, setsidebardata] = useState({});
  const [color,setcolor]=useState({"general":true,"amenities":false,"rooms":false})
  
  function colorchanger(key){
    setcolor({})
    setcolor((prev)=>({...prev,[key]:true})); 
  }

  const scrollhandle = (ele) => {
    if (ele.current) {
        window.scrollTo({ top: ele.current.offsetTop - 150, behavior: 'smooth' });
    }
}

window.addEventListener("scroll", scrolleffect);

function scrolleffect() {
  const scrollY = window.scrollY;

  const roomOffset = roomref?.current?.offsetTop || 0;
  const amenityOffset = amenitieref?.current?.offsetTop || 0;
  const generalOffset = generalref?.current?.offsetTop || 0;
  const cardOffset = carddivbuttonroom?.current?.offsetTop || 0;

  if (roomref.current && amenitieref.current && generalref.current) {
      if (scrollY >= roomOffset - 151) {
          colorchanger("rooms");
      } else if (scrollY >= amenitieref.current.offsetTop - 151) {
          colorchanger("amenities");
      } else if (scrollY >= generalref.current.offsetTop - 151) {
          colorchanger("general");
      }
  }

  if (carddivbuttonroom.current && navdivbuttonroom.current) {
      const opacity = Math.max(0, 1 - (scrollY - cardOffset) / 10);
      navdivbuttonroom.current.style.opacity = opacity;
  }
}
  
  function fulldetailpagedirectionchanger() {
    setroomcarddetailspop(!roomcarddetailspop)
  }

  function popupnavanimate(key) {
    console.log(key)
    console.log(navanimate)
    setnavanimate({});
    setnavanimate((prev) => ({ ...prev, [key]: !navanimate[key] }));
  }

  function closedynamicpop(key) {
    setnavanimate((prev) => ({ [prev]: false }))
    setnavanimate((prev) => ({ ...prev, [key]: true }))
  }

  function guestscalc(key1, key2) {
    key1 == "increase" ? setdetails((prev) => ({ ...prev, [key2]: details[key2] + 1 })) : setdetails((prev) => ({ ...prev, [key2]: details[key2] - 1 }));
  }

  function trueFinderpop() {
    return Object.keys(navanimate).length;
}


  function navigatecurrentpage() {
    navigate(`/hotels/results/hotelInfo?hotel_id=${inputvaluehotelid}&location=${inputvaluehotel}&rooms=${details.room}&adults=${details.adults}&childrens=${details.children}&date=${dateObject}`)
  }
 

  function navigatedetailspage(){
    navigate(`/hotels/results/hotelInfo/Info?hotel_id=${dataa._id}&rooms=${rooms}&adults=${adults}&childrens=${childrens}&date=${dayOfWeek}&roomno=${sidebardata.roomNumber}`)
  }

  const fetchdataHotel = async (valuee) => {
    try {
      const response = await (await fetch(`${baseapi}/hotel?search={"location":"${valuee}"}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            projectID: "afznkxyf8vti",
            "Content-Type": "application/json",
          }
        }
      )).json();
      setsearchhoteldata(response.data.hotels);
    } catch (error) {
      alert(error);
    }
  }

  const fetchcarddetails = useMemo(async () => {
    try {
      const response = await (await fetch(`${baseapi}/hotel/${hotel_id}`,
        {
          method: "GET",
          headers: {
            projectID: "afznkxyf8vti",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            "Content-Type": "application/json",
          }
        }
      )).json();
      setdataa(response.data)
      setloader(true)
      setTimeout(() => {
        colorratingmanager(response.data.rating);
      }, 1000);
    } catch (error) {
      alert(error);
    }
  }, [toggle])
  
  useEffect(() => {
    fetchdataHotel("");
    fetchcarddetails;

  }, [])

  function colorratingmanager(rating) {
    let count = 1;
    while (count <= rating && colorrating[count - 1]) {
      colorrating[count - 1].style.backgroundColor = "#00aa6c";
      count++;
    }
    let ans = rating % 1;
    if (ans > 0) {
      colorratinghalf[count - 1].style.backgroundColor = "#00aa6c";
    }
  }




  return (
    <div className='hotelcardinfo flex flexc'>

      {Object.keys(sidebardata).length != 0 &&
        <div className={`sideinforoomdiv flex flexc g20 ${roomcarddetailspop ? "roomcarddetailspopPosition" : ""}`}>
          <div className='flex flexc g10'>
            <svg onClick={() => { fulldetailpagedirectionchanger() }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M18 6L12 12M12 12L6 18M12 12L6 6M12 12L18 18" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <div className='flexa flexjsb'><h1>Room Details</h1> <h1>₹{Math.floor(sidebardata.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1></div>
            <line />
          </div>
          <h3>RoomNo:</h3>
          <h3>{sidebardata.roomNumber}</h3>
          <h3>Room Type:</h3>
          <p>{sidebardata.roomType}</p>
          <h3>Room Size:</h3>
          <h4>{sidebardata.roomSize}</h4>
          <h3>Bed Details:</h3>
          <h4>{sidebardata.bedDetail}</h4>
          <button className='navigatebtnhotelcardinfo' onClick={()=>{navigatedetailspage()}}>Book</button>

        </div>
      }
     

      {loader &&
        <div className='HotelsResult flexa flexc' style={{fontSize:"13px"}}>
          <div className={`navbaranimate ${trueFinderpop() > 0 ? "animatedown" : "animateup"} flexja`}>
            <div className='upperCenterdivDynamic flexja b1 g5'>
              <div className='hotelInputdynamic flexa g10' onClick={(e) => { closedynamicpop("hotel") }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z"></path><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
                <input className='inputdynamic' type='text' value={inputvaluehotel} onChange={(e) => { setinputvaluehotel(e.target.value); fetchdataHotelInputFields(e.target.value) }} />
                {navanimate["hotel"] && <div className='popdynamichotelInput' onClick={(e) => { e.stopPropagation() }}>
                  {searchhoteldata.map((item, index) => (
                    <div key={index} className='hotelMainPageInput flexa' onClick={(e) => { e.stopPropagation(); setnavanimate({ ["hotel"]: false }); setinputvaluehotel(item.name); setinputvaluehotelid(item._id) }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="dropdown-new__item-stroke--icon listItemHover"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z" stroke='black'></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke='black'></path></svg>&nbsp;&nbsp;{item.name}</div>
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
            <button onClick={() => { setnavanimate({}); navigatecurrentpage(); settoggle(!toggle) }}>Update</button>
          </div>


          <nav className='navFlightResults flexja'>
            <div className='innernav'>
              <div className='uppernav flexa'>
                <div className='upperLeftIcons flex'>
                  <Link to="/"><svg width="107" height="24" viewBox="0 0 310 65" fill="none" ><path d="M249.469 16.3906C243.189 16.3906 240.039 19.1706 240.039 25.4606V49.1506H247.469V25.8206C247.469 23.7506 248.399 22.7506 250.539 22.7506H257.039V16.3906H249.469V16.3906Z" fill="#FF4F17"></path><path d="M264.891 1.59961C262.461 1.59961 260.461 3.59961 260.461 6.09961C260.461 8.59961 262.461 10.5296 264.891 10.5296C267.321 10.5296 269.391 8.52961 269.391 6.09961C269.391 3.66961 267.391 1.59961 264.891 1.59961Z" fill="#FF4F17"></path><path d="M268.61 16.2402H261.25V49.0902H268.61V16.2402Z" fill="#FF4F17"></path><path d="M121.289 42.8804C119.149 42.8804 118.219 42.3104 118.219 40.1704V1.65039H110.789V40.1704C110.789 46.6704 114.429 49.2404 120.139 49.2404H124.069V42.8804H121.289V42.8804Z" fill="#FF4F17"></path><path d="M209.119 16.2695C202.839 16.2695 199.689 19.0495 199.689 25.3395V49.1195H207.119V25.6995C207.119 23.6295 208.049 22.6295 210.189 22.6295H216.689V16.2695H209.119Z" fill="#FF4F17"></path><path d="M228.33 16.2998V8.08984H220.9V40.0798C220.9 46.2898 224.11 49.1498 230.33 49.1498H235.9V42.7898H231.4C229.4 42.7898 228.33 42.0798 228.33 40.0798V22.6598H235.9V16.2998H228.33V16.2998Z" fill="#FF4F17"></path><path d="M274.82 16.5006V63.3706H282.25V46.3006C284.91 48.1406 288.13 49.2306 291.6 49.2306C300.67 49.2306 308.02 41.8806 308.02 32.8106C308.02 23.7406 300.67 16.3906 291.6 16.3906C288.12 16.3906 284.9 17.4806 282.25 19.3206V16.5006H274.82V16.5006ZM282.25 32.8106C282.25 27.6406 286.44 23.4606 291.6 23.4606C296.76 23.4606 300.95 27.6506 300.95 32.8106C300.95 37.9706 296.76 42.1606 291.6 42.1606C286.44 42.1606 282.25 37.9706 282.25 32.8106V32.8106Z" fill="#FF4F17"></path><path d="M156.92 32.1006C156.92 22.1006 150.21 16.3906 141.42 16.3906C131.57 16.3906 125.5 23.2506 125.5 32.7406C125.5 42.2306 132.21 49.2406 141.57 49.2406C149.85 49.2406 154.21 45.5306 156.28 39.3906H148.28C147.07 41.7506 144.78 42.8206 141.42 42.8206C136.99 42.8206 133.35 40.0406 133.07 35.0406H156.78C156.92 33.4706 156.92 32.7506 156.92 32.1106V32.1006ZM133.14 29.7406C133.78 25.3806 136.85 22.7406 141.64 22.7406C146.43 22.7406 149.07 25.2406 149.49 29.7406H133.14Z" fill="#FF4F17"></path><path d="M98.8005 37.9506C97.5905 41.3806 95.3005 42.8106 91.8705 42.8106C86.2305 42.8106 83.8005 38.3806 83.8005 32.7406C83.8005 27.1006 86.5805 22.7406 92.0105 22.7406C95.4405 22.7406 97.7205 24.5306 98.7905 27.6006H106.72C104.86 20.1006 99.2905 16.3906 91.8705 16.3906C81.8705 16.3906 76.2305 23.5306 76.2305 32.7406C76.2305 42.7406 82.8705 49.2406 91.8705 49.2406C100.87 49.2406 105.22 44.1706 106.72 37.9606H98.7905L98.8005 37.9506Z" fill="#FF4F17"></path><path d="M56.6095 17.7393C44.1095 26.8793 33.3295 38.8793 23.6895 48.9493C22.9795 49.6593 22.0495 50.1593 21.0495 50.1593C19.8395 50.1593 18.9095 49.4493 18.0495 48.1593C15.5495 44.4493 11.7695 35.4493 10.0495 31.5193C8.68954 28.3093 9.40954 25.6593 12.6195 24.3093C15.8295 23.0193 19.3995 22.8093 20.2595 26.4493C20.2595 26.4493 21.8995 32.8093 22.3995 34.6593C32.3295 25.4493 44.5395 15.6693 54.8895 9.66929C52.3195 4.80929 47.2495 1.5293 41.4695 1.5293H16.9795C8.54954 1.5293 1.76953 8.30929 1.76953 16.6693V41.2293C1.76953 49.5793 8.54954 56.3693 16.9795 56.3693H41.4695C49.8195 56.3693 56.6095 49.5893 56.6095 41.2293V17.7393V17.7393Z" fill="#FF4F17"></path><path d="M186.059 16.5006V19.3206C183.399 17.4806 180.179 16.3906 176.709 16.3906C167.639 16.3906 160.289 23.7406 160.289 32.8106C160.289 41.8806 167.639 49.2306 176.709 49.2306C180.189 49.2306 183.409 48.1406 186.059 46.3006V49.0906H193.489V16.5006H186.059ZM176.709 42.1606C171.539 42.1606 167.359 37.9706 167.359 32.8106C167.359 27.6506 171.549 23.4606 176.709 23.4606C181.869 23.4606 186.059 27.6506 186.059 32.8106C186.059 37.9706 181.869 42.1606 176.709 42.1606Z" fill="#FF4F17"></path></svg></Link>
                </div>
                <div className='upperCenterdiv flexja g5'>
                  <div className='hotelInputStatic flexa' onClick={() => { popupnavanimate("hotel") }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z"></path><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
                    <p>{cityparam}</p>
                  </div>
                  <div className='dateInputUpperStatic flexa'>
                    <div className='dateInputStaticInnerLeftStatic flexja g5' onClick={() => { popupnavanimate("goingdate") }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path></svg>
                      <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
                    </div>
                    <div className='datecenterline'></div>
                    <div className='dateInputStaticInnerRightStatic flexja g5' onClick={() => { popupnavanimate("returndate") }}>
                      <p>{dateObject.getDate()} {days[dateObject.getDay()]}'{dateObject.getFullYear().toString().match(/\d{2}$/)[0]}</p>
                    </div>
                  </div>
                  <div className='roomsAndGuestsStatic flexja g5' onClick={() => { popupnavanimate("room") }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className=""><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path></svg>
                    <p>{rooms} room, {adults + childrens} guests</p>
                  </div>
                </div>
              </div>
              <div className='hotelcardinfo-bottomnav flex'>
                <div className='hotelcardinfo-bottomnavleft flexa'>
                  <a onClick={()=>{scrollhandle(generalref)}} className={color["general"]?"hotelcardinfo-navbottomoptionunderline":""}>General</a>
                  <a onClick={()=>{scrollhandle(amenitieref)}} className={color["amenities"]?"hotelcardinfo-navbottomoptionunderline":""}>Amenities</a>
                  <a onClick={()=>{scrollhandle(roomref)}} className={color["rooms"]?"hotelcardinfo-navbottomoptionunderline":""}>Rooms</a>
                </div>
                <div className='hotelcardinfo-bottomnavright flexa' ref={navdivbuttonroom}>
                  <div className='flexa g10'>
                    <del>₹{Math.floor(dataa.avgCostPerNight * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del>
                    <div className='flexa'><h1>₹{Math.floor(dataa.avgCostPerNight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>&nbsp;<p>+₹{Math.floor((dataa.avgCostPerNight * 12) / 100)} tax / night</p></div>
                  </div>
                  <a onClick={()=>{scrollhandle(roomref)}}  className='flexja'>Select room</a>
                </div>

              </div>
            </div>
          </nav>
          <div className='hotelcardinfo-mainbody flexa flexc'>
            <div className='hotelcardinfo-box1 flex'>
              <div className='hotelcardinfo-box1left flexa flexc'>
                <div id='hotelcardinfo-general' className='flex flexc g20'>
                  <div className='hotelcardinfo-generalheading flexc g10 flex' ref={generalref}>
                    <h1>{dataa.name}&nbsp;-&nbsp;{dataa.location.match(/^([^,]+)/)[1]}</h1>
                    <span>{dataa.amenities.length}-star Hotel,{dataa.location.match(/^([^,]+)/)[1]}</span>
                  </div>
                  
                  <span className='flexa '>
                   {dataa.rating >= 1 && dataa.rating <= 5 ?  dataa.rating : ''}/5
                     &nbsp;&nbsp;
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12" className="hotelcardinfo-ownlogo">
                     <path fill="#1a1a1a" d="M16.603 3.717L18 2.202h-3.097a9.696 9.696 0 00-10.886 0H.912l1.397 1.515A4.257 4.257 0 00.914 6.676a4.243 4.243 0 001.121 3.072 4.269 4.269 0 002.977 1.373 4.283 4.283 0 003.075-1.137l1.369 1.485 1.368-1.483a4.26 4.26 0 002.9 1.133 4.264 4.264 0 004.271-4.256 4.234 4.234 0 00-1.392-3.146zM5.186 9.742a2.896 2.896 0 01-2.67-1.778 2.871 2.871 0 01.627-3.138 2.892 2.892 0 013.148-.624 2.887 2.887 0 011.784 2.66A2.872 2.872 0 017.229 8.9a2.89 2.89 0 01-2.043.843zm4.27-2.963c0-1.895-1.384-3.521-3.207-4.217a8.361 8.361 0 016.413 0c-1.823.696-3.206 2.322-3.206 4.217zm4.268 2.963a2.896 2.896 0 01-2.669-1.778 2.872 2.872 0 01.626-3.138 2.892 2.892 0 013.15-.624 2.887 2.887 0 011.783 2.66c0 .764-.305 1.497-.847 2.037a2.894 2.894 0 01-2.043.843zm0-4.39a1.518 1.518 0 00-1.399.933 1.504 1.504 0 00.328 1.645 1.516 1.516 0 002.586-1.068c0-.4-.16-.784-.444-1.067a1.517 1.517 0 00-1.07-.442zM6.7 6.863a1.506 1.506 0 01-.935 1.395 1.52 1.52 0 01-1.65-.327 1.508 1.508 0 011.07-2.577 1.518 1.518 0 011.401.931c.076.184.115.38.115.578z"></path>
                     </svg>
                      &nbsp;&nbsp;
                     {Array.from({ length: 5 }).map((_, index) => (
                     <div key={index} className='hotelcardinfo-colorrating' ref={(e) => { colorrating[index] = e }}>
                     <div className='hotelcardinfo-colorratinghalf' ref={(e) => { colorratinghalf[index] = e }}></div>
                     </div>
                     ))}
                  </span>


                  <div className='hotelcardinfo-cancellationdiv'>
                    <div className='flex g10'><div><GiSparkles className='hotelcardinfo-cancellationdivlogo' /></div><div><h4>Cancellation till check-in available</h4><p>With Cancel For No Reason powered by Cleartrip</p></div></div>
                    <div className='flex g10'><div><MdOutlineVerified className='hotelcardinfo-cancellationdivlogo' /></div><div><h4>Best in className service</h4><p>Service at this property rated 5.0</p></div></div>
                    <div className='flex g10'><div><GiMeal className='hotelcardinfo-cancellationdivlogo' /></div><div><h4>Free breakfast on select plans</h4><p>Some plans include free breakfast</p></div></div>
                  </div>
                </div>
                <hr />
                <div id='hotelcardinfo-amenities' ref={amenitieref}>
                  <h2>Amenities</h2>
                  <div className='hotelcardinfo-amenitiesgriddiv'>
                    {dataa.amenities.map((item, index) => (
                      <div key={index} className='flexa g10'>{item == "Gym" ? <GiGymBag /> : item == "Swimming Pool" ? <FaPersonSwimming /> : item == "Restaurant" ? <MdRestaurant /> : item == "Bar" ? <MdTableBar /> : item == "Free WiFi" ? <MdOutlineSignalWifi4Bar /> : item == "Spa" ? <FaSprayCanSparkles /> : ""}<p>{item}</p></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='hotelcardinfo-box1right flex flexc'>
                <div className='hotelcardinfo-carousaldiv'>{dataa && <HotelsCardInfoCarousalFirst data={dataa.images} />}</div>
                <div className='hotelcardinfo-prizeinfo flexa' ref={carddivbuttonroom}>
                  <div className='flex flexc g5'>
                    <div className='flexa'><h3>₹{Math.floor(dataa.avgCostPerNight).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>&nbsp;&nbsp; <p>+₹{Math.floor((dataa.avgCostPerNight * 12) / 100)} tax</p> <pre> / night</pre></div>
                    <div className='flexa'><del>₹{Math.floor(dataa.avgCostPerNight * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del> &nbsp;<span>52% off</span>&nbsp;<p>No cost EMI from ₹3,933</p></div>
                  </div>
                  <a onClick={()=>{scrollhandle(roomref)}}>Select room</a>
                </div>
              </div>
            </div>
            
            <div className='cardsroomsouterdiv flex flexc g20' ref={roomref}>
              <h1 id='room'>Rooms</h1>
              <div className='carousaltypecarddiv flex g20'>
                <div className='cardupperdiv flex g20'>
                  {dataa.rooms.map((item, index) => (
                    <div key={index} className='roomcardhotel flex flexc'>
                      <h2>{item.roomType} Room</h2>
                      <div className='flex flexc g10'>
                        <div className='flexa g10 roomcardhotelbreakfast'><GiMeal className='cardlogofeatures' /><p>Breakfast</p></div>
                        <div className='flexa g10 roomcardhotelcancellation'><MdOutlineFreeCancellation className='cardlogofeatures' /><p>{dataa.rooms[0].cancellationPolicy}</p></div>
                      </div>
                      <div className='flex flexc g5'>
                        <div className='flexa aboutroomupperdiv'>
                          <div className='flexa'>
                            <h3>₹{Math.floor(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h3>&nbsp;&nbsp;
                            <p>+₹{item.costDetails.taxesAndFees} tax</p>
                            <pre> / night</pre>
                          </div>
                          <span className='roomfulldetailsrelative' onClick={() => { fulldetailpagedirectionchanger();; setsidebardata(item) }}> <div className='roomfulldetailsabsolute'>Click me for details</div><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 c-pointer"><mask id="mask0_3260_299832" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16"><rect width="16" height="16" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_3260_299832)"><path d="M8 11C8.1 11 8.18067 10.9696 8.242 10.9087C8.30289 10.8473 8.33333 10.7667 8.33333 10.6667V7.65C8.33333 7.56111 8.3 7.486 8.23333 7.42467C8.16667 7.36378 8.08889 7.33333 8 7.33333C7.9 7.33333 7.81933 7.36667 7.758 7.43333C7.69711 7.5 7.66667 7.57778 7.66667 7.66667V10.6833C7.66667 10.7722 7.7 10.8473 7.76667 10.9087C7.83333 10.9696 7.91111 11 8 11ZM8 6.38333C8.11111 6.38333 8.20844 6.34444 8.292 6.26667C8.37511 6.18889 8.41667 6.08889 8.41667 5.96667C8.41667 5.85556 8.37511 5.76111 8.292 5.68333C8.20844 5.60556 8.11111 5.56667 8 5.56667C7.88889 5.56667 7.79156 5.60556 7.708 5.68333C7.62489 5.76111 7.58333 5.85556 7.58333 5.96667C7.58333 6.08889 7.62489 6.18889 7.708 6.26667C7.79156 6.34444 7.88889 6.38333 8 6.38333ZM8 14C7.16667 14 6.38333 13.8444 5.65 13.5333C4.91667 13.2222 4.28067 12.7973 3.742 12.2587C3.20289 11.7196 2.77778 11.0833 2.46667 10.35C2.15556 9.61667 2 8.83333 2 8C2 7.16667 2.15556 6.38333 2.46667 5.65C2.77778 4.91667 3.20289 4.28044 3.742 3.74133C4.28067 3.20267 4.91667 2.77778 5.65 2.46667C6.38333 2.15556 7.16667 2 8 2C8.83333 2 9.61667 2.15556 10.35 2.46667C11.0833 2.77778 11.7196 3.20267 12.2587 3.74133C12.7973 4.28044 13.2222 4.91667 13.5333 5.65C13.8444 6.38333 14 7.16667 14 8C14 8.83333 13.8444 9.61667 13.5333 10.35C13.2222 11.0833 12.7973 11.7196 12.2587 12.2587C11.7196 12.7973 11.0833 13.2222 10.35 13.5333C9.61667 13.8444 8.83333 14 8 14ZM8 13.3333C9.47778 13.3333 10.7362 12.814 11.7753 11.7753C12.814 10.7362 13.3333 9.47778 13.3333 8C13.3333 6.52222 12.814 5.26378 11.7753 4.22467C10.7362 3.186 9.47778 2.66667 8 2.66667C6.52222 2.66667 5.264 3.186 4.22533 4.22467C3.18622 5.26378 2.66667 6.52222 2.66667 8C2.66667 9.47778 3.18622 10.7362 4.22533 11.7753C5.264 12.814 6.52222 13.3333 8 13.3333Z" fill="#1A1A1A"></path></g></svg></span>
                        </div>
                        <div className='flexa'><del>₹{Math.floor(item.price * 1.2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</del> &nbsp;<span>52% off</span>&nbsp;<p>No cost EMI from ₹3,933</p></div>
                      </div>
                      <button className='hotelroombookbutton' onClick={() => { fulldetailpagedirectionchanger(); setsidebardata(item) }}>Book</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {!loader && <div className="lds-dual-ring"></div>}
      <div className='hotelcardinfofooter'>
        <Footer />
      </div>
    </div>
  )
}