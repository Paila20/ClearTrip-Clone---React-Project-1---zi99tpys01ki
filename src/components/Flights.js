import "../styles/Flights.css";
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { CalendarMonth } from "../SmallComp/icons";
import Calendar from 'react-calendar';
import Carousel from "../SmallComp/Carousal"
import LoginSignup from '../SmallComp/LoginSignup';
import CarouselTwo from '../SmallComp/CarousalTwo';
import { objdropdowncity ,objcolor,objfares,months,daysOfWeek, baseapi } from './Constant';




export default function Flights() {
  const navigate = useNavigate();

  const [ways, setways] = useState("one");
  const [adult, setadult] = useState(1);
  const [children, setchildren] = useState(0);
  const [infant, setinfant] = useState(0);
  const [classFlight, setclassFlight] = useState("Economy")
  const [rotateButtonWay, setrotateButtonWay] = useState(false);
  const [rotateButtonPeople, setrotateButtonPeople] = useState(false);
  const [fare, setfare] = useState("Regular_fare");
  const [flightIn, setflightIn] = useState("");
  const [flightInOutPop, setflightInOutPop] = useState({ in: false, out: false });
  const [flightOut, setflightOut] = useState("");
  const [datego, setdatego] = useState(new Date());
  const [daygo, setdaygo] = useState(daysOfWeek[datego.getDay()]);
  const [monthgo, setmonthgo] = useState(months[datego.getMonth()])
  const [datere, setdatere] = useState(activeReDate ? new Date() : "");
  const [dayre, setdayre] = useState(activeReDate ? daysOfWeek[datere.getDay()] : "");
  const [monthre, setmonthre] = useState(activeReDate ? months[datere.getMonth()] : "")
  const [activeReDate, setactiveReDate] = useState(false);
  const [datePop, setdatePop] = useState({ go: false, re: false })
  const [samefield,setsamefield]=useState(false);
  const [searchedcityIn, setSearchedcityIn] = useState([]);
  const [searchedcityOut, setSearchedcityOut] = useState([]);
 

  
  function dateprintgo() {
    setdaygo(daysOfWeek[datego.getDay()]);
    setmonthgo(months[datego.getMonth()]);
    if (activeReDate) {
      if ((datere.getMonth() + 1) < (datego.getMonth() + 1) || ((datere.getMonth() + 1) === (datego.getMonth() + 1) && datere.getDate() < datego.getDate())) {
        setdatere(datego);
        dateprintre();
      }
    }
  }

  function dateprintre() {
    if (activeReDate) {
      setdayre(daysOfWeek[datere.getDay()])
      setmonthre(months[datere.getMonth()]);
    }
  }

  function getFlights() {
    if (flightIn && flightOut ) {
      navigate(`/flights/results?source=${flightIn}&destination=${flightOut}&dayofweek=${datego}`);
    }
   

  }

  function reverseInput() {
    const fi = flightIn;
    const fo = flightOut;
    setflightIn(fo);
    setflightOut(fi);
  }

  function forbuttonDisable() {
    {
      Object.keys(objfares).map((item) => {
        document.getElementsByClassName(objfares[item])[0].style.color = "black";
        document.getElementsByClassName(objfares[item])[0].style.border = "0.5px solid lightgray";
        document.getElementsByClassName(objfares[item])[0].style.backgroundColor = "white";
      })
      document.getElementsByClassName(`${fare}`)[0].style.color = "#3366CC";
      document.getElementsByClassName(`${fare}`)[0].style.border = "1px solid #3366CC";
      document.getElementsByClassName(`${fare}`)[0].style.backgroundColor = "#3366cc19";
    }
    {
      if(flightIn==flightOut && flightIn!=""&&flightOut!=""){
        setsamefield(true);
      }else{
        setsamefield(false);
      }
    }
    if (rotateButtonPeople) {
      {
        const minbutton = document.getElementsByClassName("min")[0];
        const minnbutton = document.getElementsByClassName("min")[1];
        const minnnbutton = document.getElementsByClassName("min")[2];
        adult == 1 ? (minbutton.style.color = "gray", minbutton.style.border = "1px solid gray") : (minbutton.style.color = "#3366CC", minbutton.style.border = "1px solid #3366CC");
        children == 0 ? (minnbutton.style.color = "gray", minnbutton.style.border = "1px solid gray") : (minnbutton.style.color = "#3366CC", minnbutton.style.border = "1px solid #3366CC");
        infant == 0 ? (minnnbutton.style.color = "gray", minnnbutton.style.border = "1px solid gray") : (minnnbutton.style.color = "#3366CC", minnnbutton.style.border = "1px solid #3366CC");
      }

      {
        Object.keys(objcolor).map((item) => {
          document.getElementsByClassName(objcolor[item])[0].style.color = "black";
          document.getElementsByClassName(objcolor[item])[0].style.border = "0.5px solid lightgray";
        })
        document.getElementsByClassName(`${classFlight}`)[0].style.color = "#3366CC";
        document.getElementsByClassName(`${classFlight}`)[0].style.border = "1px solid #3366CC";
      }
    }
  }

  const fetchFlightsIn = async () => {
    try {
        const response = await fetch(`${baseapi}/airport?search={"city":"${flightIn}"}`, {
            method: "GET",
            headers: {
                projectID: "afznkxyf8vti",
                "Content-Type": "application/json",
            }
        })
        const result = await response.json()
        setSearchedcityIn(result.data.airports)
    } catch (error) {
        console.log(error);
    }
}

const fetchFlightsOut = async () => {
  try {
      const response = await fetch(`${baseapi}/airport?search={"city":"${flightOut}"}`, {
          method: "GET",
          headers: {
              projectID: "afznkxyf8vti",
              "Content-Type": "application/json",
          }
      })
      const result = await response.json()
      console.log(result);
      setSearchedcityOut(result.data.airports)
  } catch (error) {
      console.log(error);
  }
}


  useEffect(() => {
    forbuttonDisable();
    dateprintgo();
    dateprintre();
    setdatePop({ go: false, re: false });
    fetchFlightsIn();
    fetchFlightsOut();
  }, [adult, children, infant, rotateButtonPeople, rotateButtonWay, classFlight, fare, datego, datere, flightIn,flightOut]);

 
  return (
      <div className='flightpage flex'>

        <div className='mainFlightPage'>
          <h1 className='flightMainHeading'>Search flights</h1>
          <h4 className='flightMainHeadingBottom'>Airline Sale is live!<br className='flightMainHeadingBottomMoverNextLine' /> Domestic fare starting at ₹1,799*</h4>
          <div className='flightSearchform flex flexc'>
            <div className='formselectorWayClass flexa'>
              <div className='wayDefine flexja' onClick={() => { setrotateButtonWay(!rotateButtonWay); setrotateButtonPeople(false) }}>
                {ways == "one" ?
                  (<p className='flexja'><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><mask id="mask0_1265_1893" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_1265_1893)"><path d="M14.45 18.375L13.75 17.65L18.9 12.5H2.80005V11.5H18.9L13.75 6.35L14.45 5.625L20.8251 12L14.45 18.375Z" fill="#1A1A1A"></path></g></svg>
                    <p>&nbsp; One way &nbsp;&nbsp;</p></p>)
                  : (<p className='flexja'><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><mask id="mask0_1265_2365" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_1265_2365)"><path d="M6.99995 19.3L2.69995 15L6.99995 10.7L7.69995 11.4L4.62495 14.5H12.5V15.5H4.62495L7.69995 18.6L6.99995 19.3ZM17 13.3L16.3 12.6L19.375 9.49995H11.5V8.49995H19.375L16.3 5.39995L17 4.69995L21.2999 8.99995L17 13.3Z" fill="#1A1A1A"></path></g></svg>
                    <p>&nbsp;Round trip&nbsp;&nbsp;</p></p>)
                }
                <svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${rotateButtonWay ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
                {rotateButtonWay &&
                  <div className='wayChooser flexa'>
                    <p onClick={() => { setways("one"); setactiveReDate(false) }} className='flexja hov'>
                      {ways == "one" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
                      <p className='wayChooserPtext'>&nbsp;&nbsp; One Way</p>
                    </p>
                    <p onClick={() => { setways("two"); setdatere(datego); setactiveReDate(true) }} className='flexja hov' >
                      {ways == "two" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
                      <p className='wayChooserPtext'>&nbsp;&nbsp; Round trip</p>
                    </p>
                  </div>
                }
              </div>
              <div className='peoplepop'>
                <div className='peopleForTrip flexja' onClick={() => { setrotateButtonPeople(!rotateButtonPeople); setrotateButtonWay(false) }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><mask id="mask0_1265_2374" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_1265_2374)"><path d="M12.4528 11.2453C11.4465 11.2453 10.5912 10.8931 9.88679 10.1887C9.18239 9.48428 8.83019 8.62893 8.83019 7.62264C8.83019 6.63648 9.18239 5.78596 9.88679 5.07109C10.5912 4.35703 11.4465 4 12.4528 4C13.4591 4 14.3145 4.35703 15.0189 5.07109C15.7233 5.78596 16.0755 6.63648 16.0755 7.62264C16.0755 8.62893 15.7233 9.48428 15.0189 10.1887C14.3145 10.8931 13.4591 11.2453 12.4528 11.2453ZM19.6377 20H5.26792C4.90566 20 4.60377 19.8792 4.36226 19.6377C4.12075 19.3962 4 19.0943 4 18.7321V18.0075C4 17.5044 4.14611 17.0363 4.43834 16.6032C4.72976 16.1709 5.11698 15.834 5.6 15.5925C6.74717 15.0491 7.88951 14.6413 9.02702 14.3692C10.1637 14.0979 11.3057 13.9623 12.4528 13.9623C13.6 13.9623 14.7423 14.0979 15.8798 14.3692C17.0166 14.6413 18.1585 15.0491 19.3057 15.5925C19.7887 15.834 20.1763 16.1709 20.4685 16.6032C20.76 17.0363 20.9057 17.5044 20.9057 18.0075V18.7321C20.9057 19.0943 20.7849 19.3962 20.5434 19.6377C20.3019 19.8792 20 20 19.6377 20ZM5.20755 18.7925H19.6981V18.0075C19.6981 17.7258 19.6128 17.469 19.4421 17.2371C19.2706 17.0061 19.034 16.8101 18.7321 16.6491C17.7258 16.166 16.6945 15.7989 15.6383 15.5478C14.5813 15.2958 13.5195 15.1698 12.4528 15.1698C11.3862 15.1698 10.3247 15.2958 9.26853 15.5478C8.21152 15.7989 7.17987 16.166 6.17359 16.6491C5.8717 16.8101 5.63542 17.0061 5.46475 17.2371C5.29328 17.469 5.20755 17.7258 5.20755 18.0075V18.7925ZM12.4528 10.0377C13.117 10.0377 13.6857 9.80106 14.1591 9.3277C14.6316 8.85514 14.8679 8.28679 14.8679 7.62264C14.8679 6.95849 14.6316 6.39014 14.1591 5.91758C13.6857 5.44423 13.117 5.20755 12.4528 5.20755C11.7887 5.20755 11.2203 5.44423 10.7478 5.91758C10.2744 6.39014 10.0377 6.95849 10.0377 7.62264C10.0377 8.28679 10.2744 8.85514 10.7478 9.3277C11.2203 9.80106 11.7887 10.0377 12.4528 10.0377Z" fill="#1A1A1A"></path></g></svg>
                  &nbsp;<p>{`${adult} Adult, `}{children > 0 ? `${children} Child, ` : ""}{infant > 0 ? `${infant} Infant, ` : ""}{(classFlight == "First" || classFlight == "Bussiness") ? `${classFlight} className` : classFlight == "Premium" ? `${classFlight} economy` : classFlight}</p>
                  &nbsp;&nbsp;<svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${rotateButtonPeople ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
                </div>
                {rotateButtonPeople &&
                  <div className='peopleChooser flexa'>
                    <div className='Adults flex'>
                      <div>
                        <h3>Adults</h3>
                        <h5>(12+ years)</h5>
                      </div>
                      <div className='peopleCounters flexja'>
                        <button className='flexja min' onClick={() => setadult(adult - 1)} disabled={adult == 1} >-</button>
                        <h4 className='flexja'>{adult}</h4>
                        <button className='flexja' onClick={() => setadult(adult + 1)}>+</button>
                      </div>
                    </div>
                    <div className='Children flex'>
                      <div>
                        <h3>Children</h3>
                        <h5>(2 - 12 yrs)</h5>
                      </div>
                      <div className='peopleCounters flexja'>
                        <button className='flexja min' onClick={() => setchildren(children - 1)} disabled={children == 0} >-</button>
                        <h4 className='flexja'>{children}</h4>
                        <button className='flexja' onClick={() => setchildren(children + 1)}>+</button>
                      </div>
                    </div>
                    <div className='Infants flex'>
                      <div>
                        <h3>Infants</h3>
                        <h5>(Below 2 yrs)</h5>
                      </div>
                      <div className='peopleCounters flexja'>
                        <button className='flexja min' onClick={() => setinfant(infant - 1)} disabled={infant == 0} >-</button>
                        <h4 className='flexja'>{infant}</h4>
                        <button className='flexja' onClick={() => setinfant(infant + 1)}>+</button>
                      </div>
                    </div>
                    <div className='peopleClasses'>
                      <div className='upperClassesdiv flexa'>
                        <p className='flexja Economy' onClick={() => setclassFlight("Economy")}>Economy</p>
                        <p className='flexja Bussiness' onClick={() => setclassFlight("Bussiness")}>Bussiness className</p>
                        <p className='flexja First' onClick={() => setclassFlight("First")}>First className</p>
                      </div>
                      <div className='downClassesdiv'><p className='Premium' onClick={() => setclassFlight("Premium")}>Premium economy</p></div>
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className='fares flex'>
              <div className='faresl flexja'>
                <p className='Regular_fare' onClick={() => setfare("Regular_fare")}>Regular fare</p>
                <p className='Student_fare' onClick={() => setfare("Student_fare")}>Student fare</p>
              </div>
              <div className='faresr flexja'>
                <p className='Senior_citizen_fare' onClick={() => setfare("Senior_citizen_fare")}>Senior citizen fare</p>
                <p className='Armed_forces_fare' onClick={() => setfare("Armed_forces_fare")}>Armed forces fare</p>
              </div>
            </div>
            <div className='inOutFlight flex'>
              <div className='flex flexc g5'>
              <div className='inOutCombine b1 flexa'>
                <div className='flexa'>
                  <div className='ii1 flexa'>
                    <svg width="20" height="17" viewBox="0 0 20 17" fill="#808080" className="icon-1"><path d="M1.37578 16.4977V15.4977H18.3758V16.4977H1.37578ZM2.95078 11.4227L0.675781 7.49766L1.52578 7.29766L3.32578 8.84766L8.72578 7.39766L4.67578 0.547657L5.75078 0.222656L12.6008 6.34766L17.8258 4.94766C18.2091 4.84766 18.5551 4.91832 18.8638 5.15966C19.1718 5.40166 19.3258 5.71432 19.3258 6.09766C19.3258 6.36432 19.2508 6.59766 19.1008 6.79766C18.9508 6.99766 18.7508 7.13099 18.5008 7.19766L2.95078 11.4227Z"></path></svg>
                    <input type='text' value={flightIn} onClick={() => { setflightInOutPop({}); setflightInOutPop({ ["in"]: !flightInOutPop["in"] }) }} onChange={(e) => { setflightIn(e.target.value) ; fetchFlightsIn(e.target.value) }} placeholder='Where from?' />
                    {flightInOutPop["in"] == true && <div className='flightInData '>

                      {searchedcityIn.map((item) => (
                        <div className='slidee flexa' onClick={() => { setflightIn(`${item.iata_code} - ${item.city}`); setflightInOutPop({}) }}>
                          <p>{item.iata_code}</p>
                          <h4>{item.city} {item.name}</h4>
                        </div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <p onClick={() => { reverseInput() }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="c-pointer"><rect width="32" height="32" rx="16" fill="white"></rect><g clipPath="url(#clip0_160_1650)"><path d="M24.1666 14.8333H7.83325" stroke="#3366CC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.83325 14.8333L13.6666 9" stroke="#3366CC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.83342 18.3335H24.1667" stroke="#3366CC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path><path d="M24.1667 18.3334L18.3334 24.1667" stroke="#3366CC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="16" cy="16" r="13.375" stroke="#3366CC" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></circle></g><defs><clipPath id="clip0_160_1650"><rect width="28" height="28" fill="white" transform="translate(2 2)"></rect></clipPath></defs></svg>
                </p>
               
                 <div className='i2 flexa'>
                  <div className='ii2 flexa'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#808080" className="icon-2"><mask id="mask0_160_1644" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_160_1644)"><path d="M3.5 20.5004V19.5004H20.5V20.5004H3.5ZM18.975 15.4004L3.5 11.1254V6.70039L4.3 6.92539L5 9.05039L10.5 10.6004V2.65039L11.625 2.92539L14.375 11.6754L19.625 13.1504C19.8917 13.2171 20.1043 13.3587 20.263 13.5754C20.421 13.7921 20.5 14.0337 20.5 14.3004C20.5 14.6837 20.3377 14.9921 20.013 15.2254C19.6877 15.4587 19.3417 15.5171 18.975 15.4004Z"></path></g></svg>
                    <input type='text' value={flightOut} onClick={() => { setflightInOutPop({}); setflightInOutPop({ ["out"]: !flightInOutPop["out"] }) }} onChange={(e) => { setflightOut(e.target.value) ; fetchFlightsOut(e.target.value)}} placeholder='Where to?' />
                    {flightInOutPop["out"] == true && <div className='flightInData '>
                      {searchedcityOut.map((item) => (
                        <div className=' slidee flexa' onClick={() => { setflightOut(`${item.iata_code} - ${item.city}`); setflightInOutPop({}) }}>
                          <p>{item.iata_code}</p>
                          <h4>{item.city} {item.name}</h4>
                        </div>
                      ))}
                    </div>
                    }  
                  </div>
                </div>
              </div>
                   {samefield && <span className='error'>Departure and arrival airports / cities cannot be same.</span>}
                    </div>
            </div>
            <div className='DateandButtonOuter flex'>
              <div className='DateandButtonInner flexa'>
                <div className='datePicker flexa'>
                  <div className='leftDatePicker flexa' onClick={() => { setdatePop({ go: true, re: false }) }}>
                    <CalendarMonth className='calendarIcon' />
                    <div className='datesGoing'>{`${daygo}, ${monthgo} ${datego.getDate()}`}</div>
                    {datePop.go && <Calendar minDate={new Date()} onChange={(date) => { setdatego(date) }} value={datego} className="calendarForGoing" />}
                  </div>
                  <div className='rightDatePicker flexja' onClick={() => { setdatePop({ go: false, re: true }) }}>
                    <div className={`datesReturn ${!activeReDate && "blur"}`}>{activeReDate ? `${dayre}, ${monthre} ${datere.getDate()}` : "Return"} </div>
                    {datePop.re && <Calendar minDate={datego} onChange={(date) => { setdatere(date); setactiveReDate(true); setways("two") }} value={datere} className="calendarForGoing" />}
                  </div>
                </div>
                <button className={`${(!flightIn || !flightOut)||samefield ? "buttondisabled" : ""}`} onClick={() => getFlights()} disabled={(!flightIn || !flightOut)||samefield}>Search flights</button>
              </div>
            </div>
          </div>
        </div>
        <div className='asidebarFlightPage'>
          <Carousel className="flightPageRightTopCarousal" />
          <div className='moreOffers flexa'>
            <p>More offers</p>
            <Link to="/"><div>View all</div></Link>
          </div>
          <CarouselTwo />
        </div>
      </div>
  )
}



