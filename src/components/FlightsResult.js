let tl;
import React, { useEffect, useState, useMemo } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import "../styles/FlightsResults.css";

import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';

import { CiCircleInfo } from "react-icons/ci";
import Footer from "../SmallComp/Footer";
import {objdropdowncity,days,months,logofinder,airlineNamefinder,flightsresultsStatefun, baseapi } from './Constant';


export default function FlightsResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let flightFrom = searchParams.get("source");
    let flightTo = searchParams.get("destination");
    let dayOfWeek = searchParams.get("dayofweek");
    const dateObject = new Date(dayOfWeek);
    

    let count = 0;
    
    const {filter,setfilter}=flightsresultsStatefun();
    const {rotateButton,setrotateButton}=flightsresultsStatefun();
    const {filterPopup,setfilterPopup}=flightsresultsStatefun();
    const [flightResultsortingnav, setflightResultsortingnav] = useState({});
    const [pageLoader, setpageLoader] = useState(false);
    const [dataa, setdataa] = useState();
    const [ways, setways] = useState("one");
    const [adult, setadult] = useState(1);
    const [children, setchildren] = useState(0);
    const [infant, setinfant] = useState(0);
    const [flightIn, setflightIn] = useState(flightFrom);
    const [flightOut, setflightOut] = useState(flightTo);
    const [flightResultdatego, setflightResultdatego] = useState(dateObject.getDate());
    const [flightResultdaygo, setflightResultdaygo] = useState(days[dateObject.getDay()]);
    const [flightResultmonthgo, setflightResultmonthgo] = useState(months[dateObject.getMonth()]);
    const [travellersCount, settravellersCount] = useState(adult + children + infant);
    const [functionCalltoggle, setfunctionCalltoggle] = useState(false);
    const [calenderdate, setcalenderdate] = useState();
    const [onewayPrice, setonewayPrice] = useState("2,500");
    const [togglecardfulldetails, settogglecardfulldetails] = useState({});
    const [valuee, setvaluee] = useState(2500);
    const [searchedcityIn, setSearchedcityIn] = useState([]);
    const [searchedcityOut, setSearchedcityOut] = useState([]);

 

  
    function airlineSelectorwithvalue(key, value) {
        setTimeout(() => {
            if (filter[key] == value) {
                setfilter((prev) => ({ ...prev, [key]: null }))
            }
            else {
                setfilter((prev) => ({ ...prev, [key]: value }));
            }
        }, 10);

    }

    function togglecarddetails(val) {
        settogglecardfulldetails({})
        settogglecardfulldetails({ [val]: !togglecardfulldetails[val] });
    }

    function swaplocations() {
        const temp = flightIn;
        setflightIn(flightOut);
        setflightOut(temp);
    }

    function sortingnav(key) {
        setflightResultsortingnav({})
        setflightResultsortingnav({ [key]: !flightResultsortingnav[key] });
    }


    function message() {
        if (count == 0) {
            return <div className='errorMessage flexja'>
                    <div className='innererrormessage flexja'>
                    <CiCircleInfo className='iconerrormessage' /> &nbsp;No Flights Are Available
                    </div>
                 </div>;
        }
    }

   

    const onewayPricewithcomma = (number) => {
        clearTimeout(tl);
        tl = setTimeout(() => {
            setvaluee(number);
        }, 3000);
        setonewayPrice(number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    };

    const onewayPricewithoutcomma = () => {
        return parseInt(onewayPrice.replace(/,/g, ''), 10);
    }

    function numberwithComma(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function buttonRotate(key) {
        setrotateButton({});
        setrotateButton((prev) => ({ ...prev, [key]: !rotateButton[key] }));
    }
    function filterbuttonRotate(key) {
        setfilterPopup((prev) => ({ ...prev, [key]: !filterPopup[key] }));
    }

    function buttonRotateAllFalse() {
        setrotateButton((prev) => ({ prev: false }));
    }

    

    function navigateToFlightInfo(_id) {
       
       
        navigate(`/flights/results/Info?flightid=${_id}&date=${dateObject}`)
    }

    function forwardRoute() {
        navigate(`/flights/results?source=${flightIn}&destination=${flightOut}&dayofweek=${calenderdate}`);
        setfunctionCalltoggle(!functionCalltoggle);
    }

    
    const fetchdataForFlightsMountingPhase = useMemo(async () => {
        try {
            const response = await (await fetch(`${baseapi}/flight?search={"source":"${flightFrom[0]+flightFrom[1]+flightFrom[2]}","destination":"${flightTo[0]+flightTo[1]+flightTo[2]}"}&day=${days[dateObject.getDay()]}&filter={${filter.stops != null ? `"stops":${filter.stops},` : ""}${`"ticketPrice":{"$lte":${valuee}}`}}&limit=20&page=1&sort={${Object.keys(flightResultsortingnav).length === 0 ? "" : `"${Object.keys(flightResultsortingnav)[0]}":${flightResultsortingnav[`${Object.keys(flightResultsortingnav)[0]}`] == true ? "1" : "-1"}`}}`,
                {
                    method: "GET",
                    headers: {
                        projectID: "afznkxyf8vti",
                        "Content-Type": "application/json",
                    }
                }
            )).json();
            console.log(response)
            setdataa(response.data.flights);
            setpageLoader(true);
       
        } catch (error) {
            alert(error);
        }
    }, [functionCalltoggle, valuee, filter, flightResultsortingnav])

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
        setpageLoader(false);
        fetchdataForFlightsMountingPhase;
        setcalenderdate(dateObject);
        
    }, []);
    useEffect(()=>{
        fetchFlightsIn();
        fetchFlightsOut();
    },[])


    return (
        <div className='flightResultMain flex flexc'>

            <nav className='navFlightResults flexja'>
                <div className='innernav'>
                    <div>
                    <div className='uppernav flexa'>
                        <div className='upperLeftIcons flex'>
                            <Link to="/"><svg width="107" height="24" viewBox="0 0 310 65" fill="none" ><path d="M249.469 16.3906C243.189 16.3906 240.039 19.1706 240.039 25.4606V49.1506H247.469V25.8206C247.469 23.7506 248.399 22.7506 250.539 22.7506H257.039V16.3906H249.469V16.3906Z" fill="#FF4F17"></path><path d="M264.891 1.59961C262.461 1.59961 260.461 3.59961 260.461 6.09961C260.461 8.59961 262.461 10.5296 264.891 10.5296C267.321 10.5296 269.391 8.52961 269.391 6.09961C269.391 3.66961 267.391 1.59961 264.891 1.59961Z" fill="#FF4F17"></path><path d="M268.61 16.2402H261.25V49.0902H268.61V16.2402Z" fill="#FF4F17"></path><path d="M121.289 42.8804C119.149 42.8804 118.219 42.3104 118.219 40.1704V1.65039H110.789V40.1704C110.789 46.6704 114.429 49.2404 120.139 49.2404H124.069V42.8804H121.289V42.8804Z" fill="#FF4F17"></path><path d="M209.119 16.2695C202.839 16.2695 199.689 19.0495 199.689 25.3395V49.1195H207.119V25.6995C207.119 23.6295 208.049 22.6295 210.189 22.6295H216.689V16.2695H209.119Z" fill="#FF4F17"></path><path d="M228.33 16.2998V8.08984H220.9V40.0798C220.9 46.2898 224.11 49.1498 230.33 49.1498H235.9V42.7898H231.4C229.4 42.7898 228.33 42.0798 228.33 40.0798V22.6598H235.9V16.2998H228.33V16.2998Z" fill="#FF4F17"></path><path d="M274.82 16.5006V63.3706H282.25V46.3006C284.91 48.1406 288.13 49.2306 291.6 49.2306C300.67 49.2306 308.02 41.8806 308.02 32.8106C308.02 23.7406 300.67 16.3906 291.6 16.3906C288.12 16.3906 284.9 17.4806 282.25 19.3206V16.5006H274.82V16.5006ZM282.25 32.8106C282.25 27.6406 286.44 23.4606 291.6 23.4606C296.76 23.4606 300.95 27.6506 300.95 32.8106C300.95 37.9706 296.76 42.1606 291.6 42.1606C286.44 42.1606 282.25 37.9706 282.25 32.8106V32.8106Z" fill="#FF4F17"></path><path d="M156.92 32.1006C156.92 22.1006 150.21 16.3906 141.42 16.3906C131.57 16.3906 125.5 23.2506 125.5 32.7406C125.5 42.2306 132.21 49.2406 141.57 49.2406C149.85 49.2406 154.21 45.5306 156.28 39.3906H148.28C147.07 41.7506 144.78 42.8206 141.42 42.8206C136.99 42.8206 133.35 40.0406 133.07 35.0406H156.78C156.92 33.4706 156.92 32.7506 156.92 32.1106V32.1006ZM133.14 29.7406C133.78 25.3806 136.85 22.7406 141.64 22.7406C146.43 22.7406 149.07 25.2406 149.49 29.7406H133.14Z" fill="#FF4F17"></path><path d="M98.8005 37.9506C97.5905 41.3806 95.3005 42.8106 91.8705 42.8106C86.2305 42.8106 83.8005 38.3806 83.8005 32.7406C83.8005 27.1006 86.5805 22.7406 92.0105 22.7406C95.4405 22.7406 97.7205 24.5306 98.7905 27.6006H106.72C104.86 20.1006 99.2905 16.3906 91.8705 16.3906C81.8705 16.3906 76.2305 23.5306 76.2305 32.7406C76.2305 42.7406 82.8705 49.2406 91.8705 49.2406C100.87 49.2406 105.22 44.1706 106.72 37.9606H98.7905L98.8005 37.9506Z" fill="#FF4F17"></path><path d="M56.6095 17.7393C44.1095 26.8793 33.3295 38.8793 23.6895 48.9493C22.9795 49.6593 22.0495 50.1593 21.0495 50.1593C19.8395 50.1593 18.9095 49.4493 18.0495 48.1593C15.5495 44.4493 11.7695 35.4493 10.0495 31.5193C8.68954 28.3093 9.40954 25.6593 12.6195 24.3093C15.8295 23.0193 19.3995 22.8093 20.2595 26.4493C20.2595 26.4493 21.8995 32.8093 22.3995 34.6593C32.3295 25.4493 44.5395 15.6693 54.8895 9.66929C52.3195 4.80929 47.2495 1.5293 41.4695 1.5293H16.9795C8.54954 1.5293 1.76953 8.30929 1.76953 16.6693V41.2293C1.76953 49.5793 8.54954 56.3693 16.9795 56.3693H41.4695C49.8195 56.3693 56.6095 49.5893 56.6095 41.2293V17.7393V17.7393Z" fill="#FF4F17"></path><path d="M186.059 16.5006V19.3206C183.399 17.4806 180.179 16.3906 176.709 16.3906C167.639 16.3906 160.289 23.7406 160.289 32.8106C160.289 41.8806 167.639 49.2306 176.709 49.2306C180.189 49.2306 183.409 48.1406 186.059 46.3006V49.0906H193.489V16.5006H186.059ZM176.709 42.1606C171.539 42.1606 167.359 37.9706 167.359 32.8106C167.359 27.6506 171.549 23.4606 176.709 23.4606C181.869 23.4606 186.059 27.6506 186.059 32.8106C186.059 37.9706 181.869 42.1606 176.709 42.1606Z" fill="#FF4F17"></path></svg></Link>
                            <Link to="/flights"><svg height="18px" width="18px" fill="#999"><title>Flights</title><path d="M16.115.426l-4.387 4.427L1.676 2.172 0 3.862l8.285 4.403-3.35 3.38-2.606-.322-1.325 1.336 2.955 1.568 1.554 2.981 1.325-1.336-.304-2.613 3.35-3.38 4.27 8.303 1.676-1.69-2.544-9.936 4.479-4.527c1.203-1.214-.462-2.802-1.65-1.603z" fill="#36C" fillRule="evenodd"></path></svg></Link>
                            <Link to="/hotels"><svg width="20" height="20" fill="#999"><title>Hotels</title><g fill="none" fillRule="evenodd"><path fill="#FFF" d="M0 0h20v20H0z"></path><path d="M17.65 16.364v-2.432H2.354v2.425H.002L0 4.73c0-1.458 2.358-1.458 2.358 0v6.791h15.256L20 11.515v4.849h-2.35zm-8.895-5.096h-4.96c-.942 0-.853-2.173.03-2.173h3.941V7.478c0-.764.471-1.195.989-1.281v-.012h.104c.056-.004.113-.004.17 0h9.67c.959 0 1.301.31 1.301 1.299v3.789H8.755v-.005zm-3.13-3.177c-1.036 0-1.875-.855-1.875-1.909s.84-1.91 1.875-1.91c1.035 0 1.875.856 1.875 1.91 0 1.054-.84 1.909-1.875 1.909z" fill="#36CD"></path></g></svg></Link>
                        </div>
                       
                    </div> 
                    <div className='downnav flexa g20'>
                        <div className='flex g5'>
                        <div className='flightResultways flexa' onClick={() => { buttonRotate("ways"); }}>
                            <p>{ways == "one" ? "One way" : "Round trip"}</p>
                            <svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${rotateButton["ways"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
                            {rotateButton["ways"] && <div className='flightResultwaysPop'>
                                <p onClick={() => { setways("one"); }} className='flexja hov'>
                                    {ways == "one" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
                                    <p className='wayChooserPtext'>&nbsp;&nbsp; One Way</p>
                                </p>
                                <p onClick={() => { setways("two"); }} className='flexja hov' >
                                    {ways == "two" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
                                    <p className='wayChooserPtext'>&nbsp;&nbsp; Round trip</p>
                                </p>  
                            </div>}
                        </div>
                        <div className='flightResultInOut flexa'>
                            <input className='flightResultIn flexja' value={flightIn} onClick={() => { buttonRotate("flight1"); }}  onChange={(e) => { setflightIn(e.target.value) ; fetchFlightsIn(e.target.value) }}/>
                            {rotateButton["flight1"] && <div className='flightInData flightResultInData flexa flexc'>
                                {searchedcityIn.map((item) => (
                                    <div className='slidee flexja' onClick={() => { setflightIn(`${item.iata_code} - ${item.city}`); buttonRotateAllFalse() }}>
                                        <p>{item.iata_code}</p>
                                        <h4>{item.city} {item.name}</h4>
                                    </div>
                                ))}
                            </div>
                            }
                            <svg onClick={() => { swaplocations(); buttonRotateAllFalse() }} width="16" height="14" data-testid="modifySwap" className="c-pointer"> <g transform="translate(0 -1)" fill="none" fillRule="evenodd"> <g fill="#ED6521"> <path d="M3.556 7L0 11l3.556 4v-3h6.222v-2H3.556V7zM16 5l-3.556-4v3H6.222v2h6.222v3L16 5z"></path> </g> </g> </svg>
                            <input className='flightResultOut flexja' value={flightOut} onClick={() => { buttonRotate("flight2"); } } onChange={(e) => { setflightOut(e.target.value) ; fetchFlightsOut(e.target.value) }} />
                            {rotateButton["flight2"] && <div className='flightInData flightResultOutData flexa flexc'>
                                {searchedcityOut.map((item) => (
                                    <div className='slidee flexja' onClick={() => { setflightOut(`${item.iata_code} - ${item.city}`); buttonRotateAllFalse() }}>
                                        <p>{item.iata_code}</p>
                                        <h4>{item.city} {item.name}</h4> 
                                    </div>
                                ))}
                            </div>
                            }
                        </div>
                        </div>
                        <div className='flex g5'>
                        <div className='flightResultLeftDatePicker flexa' onClick={() => { buttonRotate("datego") }}>
                            <div className='datesGoing flightResultdatesGoing'>{`${flightResultdaygo}, ${flightResultmonthgo} ${flightResultdatego}`}</div>
                            {rotateButton["datego"] && <Calendar minDate={new Date()} onChange={(date) => { setflightResultdatego(date.getDate()); setcalenderdate(date); setflightResultdaygo(days[date.getDay()]); setflightResultmonthgo(months[date.getMonth()]); }} value={flightResultdatego} className="calendarForGoing flightResultcalendarGoing " />}
                        </div>
                       
                        <div className='flightResultTraveller flexa' >
                            <div className='travellerdata flexa' onClick={() => { buttonRotate("traveller") }}>{`${travellersCount} Travellers`}</div>
                            <svg onClick={() => { buttonRotate("traveller") }} width="14" height="9" fill="currentColor" className={`t-all ml-3 ${rotateButton["traveller"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
                            {rotateButton["traveller"] &&
                                <div className='peopleChooser flightResultPeopleChooser flexa'>
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
                                    <button onClick={() => { settravellersCount(adult + children + infant); buttonRotateAllFalse() }}>Submit</button>
                                </div>
                            } 
                        </div>
                        <button className='flightResultSubmitMain' onClick={() => {buttonRotate("submit"); forwardRoute(); }}>Submit</button>
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
            {pageLoader &&
                <div className='MainPageFlightResult flex'>
                    <div className='leftSortingComp flex flexc'>
                        <div className='stops flexa' onClick={() => { filterbuttonRotate("stops") }}>
                            <p>Stops</p>
                            <svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${filterPopup["stops"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
                        </div>
                        {filterPopup["stops"] &&
                            <div className='filterPopupstops flex flexc'>
                                <label onClick={() => { airlineSelectorwithvalue("stops", 0) }} for="non-stop" className='flex'>
                                    <div className='flexa'>
                                        <input type='checkbox' id='non-stop' checked={filter["stops"] == 0} />
                                        <p>Non-stop</p>
                                    </div>
                                </label>
                                <label onClick={() => { airlineSelectorwithvalue("stops", 1) }} for="1-stop" className='flex'>
                                    <div className='flexa'>
                                        <input type='checkbox' id='1-stop' checked={filter["stops"] == 1} />
                                        <p>1 stop</p>
                                    </div>
                                </label>
                                <label onClick={() => { airlineSelectorwithvalue("stops", 2) }} for="2-stop" className='flex'>
                                    <div className='flexa'>
                                        <input type='checkbox' id='2-stop' checked={filter["stops"] == 2} />
                                        
                                        <p>2 stop</p>
                                    </div>
                                </label>
                            </div>}
                        <div className='wayprice flexa' onClick={() => { filterbuttonRotate("wayprice") }}>
                            <p>One-way price</p>
                            <svg width="14" height="9" fill="currentColor" className={`t-all ml-3 ${filterPopup["wayprice"] ? "rotateButtonzero" : "rotateButtonOneNinty"}`} style={{ color: "rgb(153, 153, 153)", transform: "rotate(-180deg)" }}><g fill="none" fillRule="evenodd"><path d="M15 12H-1V-4h16z"></path><path stroke="#FFF" strokeWidth="0.5" fill="currentColor" d="M11.59 8L7 3.42 2.41 8 1 6.59l6-6 6 6z"></path></g></svg>
                        </div>
                        {filterPopup["wayprice"] &&
                            <div className='filterPopupwayprice flex flexc'>
                                <p>Up to ₹{onewayPrice}</p>
                                <input type='range' min="1127" max="2500" value={onewayPricewithoutcomma()} onChange={(e) => { onewayPricewithcomma(e.target.value); }} />
                                <div className='flexa'><p>₹1,127</p><p>₹2,500</p></div>
                            </div>}
                      
                       
                       
                    </div>
                    <div className='FlightResultDataRender'>
                        <nav className='flightResultsortingNav flexa'>
                            <div>Airlines</div>
                           
                            {["departureTime", "duration", "arrivalTime", "ticketPrice"].map((type, index) => (
                            <div
                                key={type}
                                className={flightResultsortingnav[type] !== null ? "activesortingnavColor" : null}
                                onClick={() => sortingnav(type)}
                                style={type === "ticketPrice" ? { marginRight: 200 } : {}}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)} &nbsp;
                                {flightResultsortingnav[type] !== null && (
                                <svg
                                    viewBox="0 0 5 8"
                                    fill="currentColor"
                                    width="7px"
                                    height="12px"
                                    style={flightResultsortingnav[type] === false ? { transform: "rotate(-180deg)" } : {}}
                                >
                                    <path d="M0 4.688l2.073.006L2.08 0l.823.013.005 4.679L5 4.695 2.483 8z" fillRule="evenodd"></path>
                                </svg>
                                )}
                            </div>
                            ))}

                        </nav>   
                        <div className='flightResultData'>
                            {dataa.map((item, index) => (filter[`${item.flightID[0]}${item.flightID[1]}`] && <div className='countvisibility'>{count++}</div> && (
                                <div className='flightResultcardOuter flexja flexc'>
                                    <div className='flightResultcardInner flexa'>
                                        <div className='flightResultcardheader flexa flexc g20'>
                                            <div className='flexja g10'>
                                                <img src={logofinder(item)} />
                                                <div >
                                                    <p className='flightName'>{airlineNamefinder(item)}</p>
                                                    <p className='flightid'>{`${item.flightID[0]}${item.flightID[1]}-${item.flightID[item.flightID.length - 3] + item.flightID[item.flightID.length - 2] + item.flightID[item.flightID.length - 1]}`}</p>
                                                </div>
                                            </div>
                                            <div className='flightdetails' onClick={() => { togglecarddetails(`${index}`) }}>{togglecardfulldetails[`${index}`] ? "Hide details" : "Flight details"}</div>
                                        </div>
                                        <div className='flightResultdepartureTime'>{item.departureTime}</div>
                                        <div className='flightResultDuration flexja flexc'><p className='flightresultduration'>{item.duration}h 00m</p><div className='flightdurationandstopSeperator flexja'><div></div></div><p className='flightresultstops'>{item.stops == 0 ? "Non-stop" : item.stops == 1 ? item.stops + " Stop" : item.stops + " Stops"}</p></div>
                                        <div className='fligthResultArrivalTime'>{item.arrivalTime}</div>
                                        <div className='flightprice'>₹{numberwithComma(item.ticketPrice)}</div>
                                        <div className='flightbookbutton flexja' onClick={() => { navigateToFlightInfo(item._id) }}>Book</div>
                                    </div>
                                    {togglecardfulldetails[`${index}`] &&
                                        <div className='flightresultCardFullDetails'>
                                            <div className='flightresultCardFullDetailsHeader flexa'>
                                                <div className='flexja g20'>
                                                    <div className='flexja g20'>
                                                        {item.source} → {item.destination}
                                                    </div>
                                                    <div className='cardsmentiondate'>
                                                        {days[dateObject.getDay()]}, {dateObject.getDate()} {months[dateObject.getMonth()]}
                                                    </div>
                                                </div>
                                                <div className='cardpartiallytext'>PARTIALLY REFUNDABLE</div>
                                            </div>
                                            <div className='flightresult-cardInnerDetails flexa'>
                                                <div className='phase1 flexa flexc g5'>
                                                    <img src={logofinder(item)} alt='img' />
                                                    <p>{airlineNamefinder(item)}</p>
                                                    <p className='flightid'>{`${item.flightID[0]}${item.flightID[1]}-${item.flightID[item.flightID.length - 3] + item.flightID[item.flightID.length - 2] + item.flightID[item.flightID.length - 1]}`}</p>
                                                </div>
                                                <div className='phase2'>
                                                    <div className='flex flexc g2'>
                                                        <h2><span>{item.source}</span> {item.departureTime}</h2>
                                                        <p>{days[dateObject.getDay()]}, {dateObject.getDate()} {months[dateObject.getMonth()]} {dateObject.getFullYear()}</p>
                                                    </div>
                                                </div>
                                                <div className='phase3 flexja g5 flexc'>
                                                    <svg width="20" height="20"><g fill="#4D4D4D" fill-rule="evenodd"><path d="M19.202 6.102c-1.055-2.459-2.847-4.246-5.325-5.304A9.83 9.83 0 009.984 0a9.728 9.728 0 00-3.882.798C3.643 1.853 1.844 3.64.787 6.102A9.732 9.732 0 000 9.984c0 1.356.258 2.659.787 3.893 1.057 2.462 2.857 4.26 5.315 5.314a9.728 9.728 0 003.882.798c1.355 0 2.654-.27 3.892-.798 2.48-1.057 4.271-2.856 5.326-5.314A9.782 9.782 0 0020 9.984a9.724 9.724 0 00-.798-3.882zm-1.597 8.3a8.773 8.773 0 01-3.215 3.203 8.613 8.613 0 01-4.406 1.181c-1.192 0-2.33-.23-3.412-.7-1.083-.47-2.017-1.088-2.8-1.87-.781-.781-1.404-1.725-1.87-2.81a8.61 8.61 0 01-.688-3.422c0-1.586.39-3.054 1.17-4.396a8.778 8.778 0 013.204-3.204 8.546 8.546 0 014.396-1.181c1.585 0 3.06.396 4.406 1.18a8.8 8.8 0 013.215 3.205 8.547 8.547 0 011.181 4.396 8.629 8.629 0 01-1.18 4.417z" fill-rule="nonzero"></path><path d="M10.618 9.902V4.237c0-.339-.295-.612-.634-.612a.616.616 0 00-.602.612V9.99c0 .011.022.055.022.088a.572.572 0 00.164.492l3.27 3.27a.622.622 0 00.842 0 .59.59 0 000-.854l-3.062-3.083z"></path></g></svg>
                                                    <p>{item.duration}h 00m</p>
                                                </div>
                                                <div className='phase4'>
                                                    <h2><span>{item.destination}</span> {item.arrivalTime}</h2>
                                                    <p>{days[dateObject.getDay()]}, {dateObject.getDate()} {months[dateObject.getMonth()]} {dateObject.getFullYear()}</p>
                                                </div>
                                                <div className='phase5'>
                                                    <p>Check-in baggage</p>
                                                    <p>Cabin baggage</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )))}
                            {message()}
                        </div>
                    </div>
                </div>
            }
            {!pageLoader && <div className="lds-dual-ring"></div>}
            <Footer/>
        </div>

    )
}

