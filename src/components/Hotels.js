import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Hotels.css";
import Calendar from 'react-calendar';
import CarouselHotelFirst from '../SmallComp/CarousalHotelFirst';
import CarouselHotelSecond from '../SmallComp/CarousalHotelSecond';
import { months,days,roomAndpeople, baseapi } from './Constant';
import card1 from '../Assets/BSB_CTONECARD_F_2006.png'
import card2 from '../Assets/BSB_SBI_DOM_F_2803.png'
import card3 from '../Assets/BSB_dubai_packages_1912_1.png'
import card4 from '../Assets/BSB_exploreall_Packages_1912_1.png'
import card5 from '../Assets/BSB_hdfc_F_1704.png'
import card6 from '../Assets/BSB_srilanka_packages_1912_1.png'
import {flightimg} from '../Assets/Icons'
import { destination } from "./Constant";
import flightcard from '../Assets/desktop_flights_ctmahi3.png'

export default function Hotels() {
  const navigate = useNavigate();

  const [dataa, setdataa] = useState([]);
  const [datego, setdatego] = useState(new Date());
  const [daygo, setdaygo] = useState(days[datego.getDay()]);
  const [monthgo, setmonthgo] = useState(months[datego.getMonth()])
  const [datere, setdatere] = useState(new Date());
  const [dayre, setdayre] = useState(days[datere.getDay()]);
  const [monthre, setmonthre] = useState(months[datere.getMonth()])
  const [Pop, setPop] = useState({})
  const [rooms, setrooms] = useState(1);
  const [adults, setadults] = useState(1);
  const [childrens, setchildrens] = useState(0);
  const [inputvalue, setinputvalue] = useState();

  function Popkey(val) {
    setPop({})
    setPop({ [val]: !Pop[val] });
  }

  function datesetterRe(date) {
    if ((datere.getMonth()) < (date.getMonth()) || ((datere.getMonth()) === (date.getMonth()) && datere.getDate() < date.getDate())) {
      setdatere(date);
      setdayre(days[date.getDay()]);
      setmonthre(months[date.getMonth()]);
    }
  }

  function navigateToHotelResults() {
    if (inputvalue != "") {
      navigate(`/hotels/results?location=${inputvalue}&rooms=${rooms}&adults=${adults}&childrens=${childrens}&date=${datego}`)
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
   
      const arr = response.data.hotels.map(item=>{return item.location})
       setdataa(new Set(arr));
     
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    fetchdataHotelInputFields("");
  }, [])
  return (

    <div className='HotelsMainPage'>
      <div className='flexa g20'>
        <div className='MainHotelFrontPage'>
          <h1 className='HotelsMainHeading'>Search hotels</h1>
          <h4 className='HotelsMainHeadingBottom'>Enjoy hassle free bookings with Cleartrip</h4>
          <div className='HotelsMainPageForm flexja flexc g20'>
            <div className='formInputDiv flexa' onClick={() => { Popkey("input"); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z"></path><path stroke="gray" strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
              <input type='text' onClick={() => { Popkey("input"); }} value={inputvalue} onChange={(e) => { setinputvalue(e.target.value); fetchdataHotelInputFields(e.target.value) }} placeholder='Enter locality, landmark, city or hotel' />
              {Pop["input"] && <div className='HotelsInputPopup'>
                <p className='flexa'>Popular destinations</p>
                {Array.from(dataa).map((item,index) => (
                  <div key={index} className='hotelMainPageInput flexa' onClick={() => { Popkey("input"); setinputvalue(item) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="dropdown-new__item-stroke--icon listItemHover"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10.182C20 16.546 12 22 12 22s-8-5.454-8-11.818c0-2.17.843-4.251 2.343-5.786A7.91 7.91 0 0 1 12 2c2.122 0 4.157.862 5.657 2.396A8.277 8.277 0 0 1 20 10.182Z" stroke='black'></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke='black'></path></svg>&nbsp;&nbsp;
                  {item}
                  </div>
                ))}
              </div>
              }
            </div>
            <div className='dateOuter flexa'>
              <div className='datesDiv flexja'>
                <div className='leftcalenderDiv flexja' onClick={() => { Popkey("go") }}>{`${daygo}, ${monthgo} ${datego.getDate()}`}
                  {Pop["go"] && <Calendar minDate={new Date()} onChange={(date,e)=>{e.stopPropagation(); Popkey("go"); setdatego(date); setdaygo(days[date.getDay()]); setmonthgo(months[date.getMonth()]); datesetterRe(date) }} value={datego} className="calendarForGoing" />}
                </div>
                <p></p>
                <div className='rightcalenderDiv flexja' onClick={() => { Popkey("re") }}>{`${dayre}, ${monthre} ${datere.getDate()}`}
                  {Pop["re"] && <Calendar minDate={datego} onChange={(date,e)=>{e.stopPropagation(); Popkey("re"); setdatere(date); setdayre(days[date.getDay()]); setmonthre(months[date.getMonth()]) }} value={datere} className="calendarForGoing" />}
                </div>
              </div>
              <div className='HotelsRoomSelectorDiv flexa' onClick={() => { Popkey("selector") }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_1418_9065" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "alpha" }}><rect width="24" height="24" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_1418_9065)"><path d="M12.4528 11.2453C11.4465 11.2453 10.5912 10.8931 9.88679 10.1887C9.18239 9.48428 8.83019 8.62893 8.83019 7.62264C8.83019 6.63648 9.18239 5.78596 9.88679 5.07109C10.5912 4.35703 11.4465 4 12.4528 4C13.4591 4 14.3145 4.35703 15.0189 5.07109C15.7233 5.78596 16.0755 6.63648 16.0755 7.62264C16.0755 8.62893 15.7233 9.48428 15.0189 10.1887C14.3145 10.8931 13.4591 11.2453 12.4528 11.2453ZM19.6377 20H5.26792C4.90566 20 4.60377 19.8792 4.36226 19.6377C4.12075 19.3962 4 19.0943 4 18.7321V18.0075C4 17.5044 4.14611 17.0363 4.43834 16.6032C4.72976 16.1709 5.11698 15.834 5.6 15.5925C6.74717 15.0491 7.88951 14.6413 9.02702 14.3692C10.1637 14.0979 11.3057 13.9623 12.4528 13.9623C13.6 13.9623 14.7423 14.0979 15.8798 14.3692C17.0166 14.6413 18.1585 15.0491 19.3057 15.5925C19.7887 15.834 20.1763 16.1709 20.4685 16.6032C20.76 17.0363 20.9057 17.5044 20.9057 18.0075V18.7321C20.9057 19.0943 20.7849 19.3962 20.5434 19.6377C20.3019 19.8792 20 20 19.6377 20ZM5.20755 18.7925H19.6981V18.0075C19.6981 17.7258 19.6128 17.469 19.4421 17.2371C19.2706 17.0061 19.034 16.8101 18.7321 16.6491C17.7258 16.166 16.6945 15.7989 15.6383 15.5478C14.5813 15.2958 13.5195 15.1698 12.4528 15.1698C11.3862 15.1698 10.3247 15.2958 9.26853 15.5478C8.21152 15.7989 7.17987 16.166 6.17359 16.6491C5.8717 16.8101 5.63542 17.0061 5.46475 17.2371C5.29328 17.469 5.20755 17.7258 5.20755 18.0075V18.7925ZM12.4528 10.0377C13.117 10.0377 13.6857 9.80106 14.1591 9.3277C14.6316 8.85514 14.8679 8.28679 14.8679 7.62264C14.8679 6.95849 14.6316 6.39014 14.1591 5.91758C13.6857 5.44423 13.117 5.20755 12.4528 5.20755C11.7887 5.20755 11.2203 5.44423 10.7478 5.91758C10.2744 6.39014 10.0377 6.95849 10.0377 7.62264C10.0377 8.28679 10.2744 8.85514 10.7478 9.3277C11.2203 9.80106 11.7887 10.0377 12.4528 10.0377Z" fill="#808080"></path></g></svg> &nbsp;
                <p>{`${rooms} Rooms, ${adults} Adults `}{childrens ? `${childrens} Children` : ""}</p>
                {Pop["selector"] && <div className='HotelsPeoplePop'>
                  <p className='flexa'>Quick select</p>
                  {roomAndpeople.map((item,index) => (
                    <div key={index} className='flexa' onClick={() => { setrooms(item.room); setadults(item.adult); setchildrens(item.children); Popkey("selector") }}>
                      {`${item.room} Rooms, ${item.adult} Adults `}{item.children ? `${item.children} Children` : ""}
                    </div>
                  ))}
                </div>
                }
              </div>
            </div>
            <div className='HotelsMainFormButtonDiv'><button className={`HotelsMainFormButton ${!inputvalue ? "buttondisabled" : ""}`} onClick={() => { navigateToHotelResults() }} disabled={!inputvalue}>Search hotels</button></div>
          </div>
          
        </div>
        <div className='flexja flexc sidecarousaldiv'>
          <CarouselHotelFirst />
          <div className='moreOffers flexa'>
            <p>More offers</p>
            <Link to="/maintenance"><div>View all</div></Link>
          </div>
          <CarouselHotelSecond />
        </div>
        
      </div>
      <div className= 'maxboxhotel'>
            {flightimg}
            <span className="flex ">Free cancellation or free date change starting from ₹499. T&amp;C apply.</span>

          </div>
          <div className= 'card-imghotel flex flexc'>
            <div className="card-flex1hotel flex g10">
              <img src={card1}/>
              <img src={card2} />
              <img src={card3} />
            </div>
           

          </div>
          <div className="flex qrcodehotel">
              <img src={flightcard}/>
            </div>
            <div className="flex flexc popularhotel">
              <h1>Popular destinations</h1>
              <div className="flex g20 destination-imgshotel">
                {destination.map((item,index) =>(
                  <img key={index} src={item.src}/>
                ))}
              </div>

            </div>

            <div className="flex flexc g20 whycleartriphotel">
              <h1> Why Cleartrip ? </h1>
              <p>
              It is no longer an uphill battle to get the lowest airfare and book tickets online. Cleartrip is all about making travel  easy, affordable  and simple. From international flights to domestic flights; from early morning flights to late night flights, from cheap flights to luxurious ones. Cleartrip helps you complete your flight booking in just a few clicks. Your online flight booking experience is seamless with our features like:

              </p>
              <p>
              ClearChoice Max: Free cancellation or rescheduling for domestic (up to 24 hrs before departure) & international flights (up to 72 hrs before departure).
              </p>
                <p>
                ClearChoice Plus: Free date change or airline change up to 12 hrs (up to 24 hours for Air India*& Vistara*) before departure.
                </p>
                <p>
                Medi-cancel refund: Cancel your domestic flight booking easily on valid medical grounds and get up to ₹3500 against airline cancellation charges per passenger per segment.
                </p>
                <p>
                International travel insurance: Get stress-free coverage against a vast range of uncertainties for all international destinations at only ₹89 per user per day.
                </p>
                <p>
                And with our round-the-clock customer service, we ensure no queries or concerns regarding your flight tickets are left unresolved.
                </p>
            </div>
    </div>
  )
}
