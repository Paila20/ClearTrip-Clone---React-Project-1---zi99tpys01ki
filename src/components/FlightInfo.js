import React, { useState, useEffect, useRef, useMemo } from 'react'
import "../styles/FlightInfo.css";
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IoIosArrowDown } from "react-icons/io";
import Footer from "../SmallComp/Footer"
import { countries, states, months, days, objdropdownstate, logofinder, airlineNamefinder, detailssStatefun, baseapi, logosvg,localtoken } from './Constant';

export default function FlightInfo() {
  const navigate = useNavigate();
  const inputref = useRef()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let flightid = searchParams.get("flightid");
  let dayOfWeek = searchParams.get("date");
 
  const dateObject = new Date(dayOfWeek);
 

  

  const { details, setdetails } = detailssStatefun();
  const [pageLoader, setpageLoader] = useState(false);
  const [dataa, setdataa] = useState();
  const [date, setdate] = useState(dateObject.getDate());
  const [day, setday] = useState(days[dateObject.getDay()]);
  const [month, setmonth] = useState(months[dateObject.getMonth()]);
  const [year, setyear] = useState(dateObject.getFullYear());
  const [phonenumber, setphonenumber] = useState("");
  const [email, setemail] = useState("");
  const [errorcontact, seterrorcontact] = useState(false);
  const [pop, setpop] = useState({});
  const [switcherform, setswitcherform] = useState(false);
 

  function popp(key) {
    setpop({});
    setpop((prev) => ({ ...prev, [key]: !pop[key] }));
  }

  function personalInfosenderone(e) {
    e.preventDefault();
    if (phonenumber.length == 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setdetails((prev) => ({ ...prev, dnumber: phonenumber, demail: email }));
      setswitcherform(true);
      setphonenumber("");
      setemail("");
    }
    else {
      seterrorcontact(true);
    }
  }
  function travellerinfo(key, value) {
    setdetails((prev) => ({ ...prev, [key]: value }));
  }

  function startdate(){
    const departureDate = new Date(dateObject);
    const [hours, minutes] = dataa.departureTime.split(":");
    departureDate.setHours(hours, minutes);
    
    return departureDate;
  }

  
  function enddate(){
    const [departureHours, departureMinutes] = dataa.departureTime.split(":");
    const [arrivalHours, arrivalMinutes] = dataa.arrivalTime.split(":");
    const arrivalDate = new Date(dateObject);
    if(departureHours>arrivalHours){
    arrivalDate.setHours(arrivalHours,arrivalMinutes);
    }
    else if(departureHours==arrivalHours){
      arrivalDate.setHours(arrivalHours,departureMinutes+arrivalMinutes)
    }
    else{
      arrivalDate.setHours(departureHours+arrivalHours,departureMinutes+arrivalMinutes)
    }
  
    return arrivalDate;
  }


  const senddata = async () => {
    try {
      if (details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress) {
        const response = await (await fetch(`${baseapi}/booking`,
          {
            method: "POST",
            headers: {
              projectID: "mhroh2oic5sz",
              Authorization:`Bearer ${localtoken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingType: "flight",
              bookingDetails: {
                flightId: `${flightid}`,
                startDate: `${startdate()}`,
                endDate: `${enddate()}`
              }
            })
          }
        )).json();
        console.log(flightid);
        console.log(startdate());
        console.log(enddate());
      }
    }
    catch (error) {
      alert(error);
    }
  }


  
  function gotopayment() {
    if (details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress) {
      senddata();
      navigate(`/flights/results/flightInfo/flightbooking?FirstName="${details.dfname}"&Email="${details.demail}"&amount=${caltotalamout()}`);
    }
    else{
      alert("detils are not fully filled, fill all the fields");
    }
  }

  function emailerror(e) {
    const inputval = e.target.value;
    const inputele = e.target;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputval)) {
      inputele.style.outline = "1px solid green";
    }
    else {
      inputele.style.outline = "none"
    }
  }

  function taxCalculate() {
    const val = (dataa.ticketPrice * 18) / 100;
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  function caltotalamout() {
    const val = (dataa.ticketPrice * 18) / 100;
    const add = val + dataa.ticketPrice;
    return Math.floor(add).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  function numbererror(e) {
    const inputValue = e.target.value;
    const inputElement = e.target;
    if (inputValue.length == 0) {
      inputElement.style.outline = "none";
    } else if (inputValue.length == 10) {
      inputElement.style.outline = "1px solid green";
    } else {
      inputElement.style.outline = "1px solid red";
    }

  }
  async function fetchdataforflightcarddetails() {
    try {
      const response = await (await fetch(`${baseapi}/flight/${flightid}`,
        {
          method: "GET",
          headers: {
            projectID: "afznkxyf8vti",
            "Content-Type": "application/json",
          }
        }
      )).json();
      setdataa(response.data);
      setpageLoader(true);
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    setpageLoader(false);
    fetchdataforflightcarddetails();
  }, []);
  return (
    <div className='flightInfo flexa flexc'>
      <div className="wholenav flexja">
        <nav className='flexa'>
          <NavLink to='/'>
            {logosvg}
          </NavLink>
        </nav>
      </div>
      {pageLoader && dataa &&
        <div className='flightInfoBody flexja'>
          <div className='flightInfovhbody flex'>
            <div className='leftdiv'>
              <div className='flightinfo-FirstPart flexa g20'>
                <div className='flightinfo-1-logo flexja'>1</div>
                <h1>Review your itinerary</h1>
              </div>
              <div className=' flightinfo-carddetails '>
                <div className='flightinfo-sou-To-des flexa g20'>
                  <div className='source-to-destination flexa'>
                    {dataa.source}
                   
                    <p><svg viewBox="0 0 24 24" height="16" width="16"><g fill="none" fillRule="evenodd"><path fill="#FFF" d="M24 24H0V0h24z"></path><path fill="#FFF" d="M24 24H0V0h24z"></path><path fill="currentColor" d="M5 12.875h10.675l-4.9 4.9L12 19l7-7-7-7-1.225 1.225 4.9 4.9H5z"></path></g></svg></p>&nbsp;
                

                   {dataa.destination}
                  </div>
                  <div className='flightinfodate'>
                    {`${day}, ${date} ${month} ${year}`}
                  </div>
                </div>
                <div className='flightinfo-cardPhases flex'>
                  <div className='flightinfo-cardPhase1st flexj flexc'>
                    <img src={logofinder(dataa)} alt="image" />
                    <div className='flightinfo-flightName'>{airlineNamefinder(dataa)}</div>
                    <div className='flightinfo-flightId'>{dataa.flightID[0] + dataa.flightID[1]}-{dataa.flightID[dataa.flightID.length - 3] + dataa.flightID[dataa.flightID.length - 2] + dataa.flightID[dataa.flightID.length - 1]}</div>
                  </div>
                  <div className='flightinfo-cardPhase2st'><svg width="9" height="97" viewBox="0 0 9 97"><g fill="none" fillRule="evenodd"><circle fill="#999" cx="4.5" cy="4.5" r="4.5"></circle><circle fill="#999" cx="4.5" cy="92.5" r="4.5"></circle><path stroke="#999" strokeLinecap="square" strokeDasharray="7" d="M4.5 7v84"></path></g></svg></div>
                  <div className='flightinfo-cardPhase3st flex flexc'>
                    <div className='flexa'><h2 className='flgihtinfo-departureTime'>{dataa.departureTime}</h2>&nbsp;&nbsp;&nbsp;<p className='flgihtinfo-source'>{dataa.source}</p></div>
                    <div className='clocksvg flexa'><svg width="20" height="20"><g fill="#4D4D4D" fillRule="evenodd"><path d="M19.202 6.102c-1.055-2.459-2.847-4.246-5.325-5.304A9.83 9.83 0 009.984 0a9.728 9.728 0 00-3.882.798C3.643 1.853 1.844 3.64.787 6.102A9.732 9.732 0 000 9.984c0 1.356.258 2.659.787 3.893 1.057 2.462 2.857 4.26 5.315 5.314a9.728 9.728 0 003.882.798c1.355 0 2.654-.27 3.892-.798 2.48-1.057 4.271-2.856 5.326-5.314A9.782 9.782 0 0020 9.984a9.724 9.724 0 00-.798-3.882zm-1.597 8.3a8.773 8.773 0 01-3.215 3.203 8.613 8.613 0 01-4.406 1.181c-1.192 0-2.33-.23-3.412-.7-1.083-.47-2.017-1.088-2.8-1.87-.781-.781-1.404-1.725-1.87-2.81a8.61 8.61 0 01-.688-3.422c0-1.586.39-3.054 1.17-4.396a8.778 8.778 0 013.204-3.204 8.546 8.546 0 014.396-1.181c1.585 0 3.06.396 4.406 1.18a8.8 8.8 0 013.215 3.205 8.547 8.547 0 011.181 4.396 8.629 8.629 0 01-1.18 4.417z" fillRule="nonzero"></path><path d="M10.618 9.902V4.237c0-.339-.295-.612-.634-.612a.616.616 0 00-.602.612V9.99c0 .011.022.055.022.088a.572.572 0 00.164.492l3.27 3.27a.622.622 0 00.842 0 .59.59 0 000-.854l-3.062-3.083z"></path></g></svg>&nbsp; &nbsp; 0{dataa.duration}:00</div>
                    <div className='flexa'><h2 className='flgihtinfo-arrivalTime'>{dataa.arrivalTime}</h2>&nbsp;&nbsp;&nbsp;<p className='flgihtinfo-source'>{dataa.destination}</p></div>
                  </div>
                </div>
              </div>
              <div className='flightinfo-SecondPart flexa g20'>
                <div className='flightinfo-2-logo flexja'>2</div>
                <h1>Add contact details <br /><p>E-ticket will be sent to this email address</p></h1>
              </div>
              <div className='flightinfo-contactdetails flexj flexc'>
                {!switcherform &&
                  <form onSubmit={(e) => personalInfosenderone(e)} className='flexj flexc'>
                    <label htmlFor="mobile">Mobile number</label>
                    <input type="number" className='flightinfo-mobileinput' onClick={() => { popp("mobile") }} placeholder='Mobile number' ref={inputref} value={phonenumber} onChange={(e) => { seterrorcontact(false); setphonenumber(e.target.value); numbererror(e) }} />
                    <label htmlFor="email">Email address</label>
                    <input type='email' placeholder='Email address' onClick={() => { popp("email") }} value={email} onChange={(e) => { seterrorcontact(false); setemail(e.target.value), emailerror(e) }} />
                    {errorcontact && <p className='errorcontact'>fill the form correctly</p>}
                    <button onClick={() => { popp("button") }}>Submit</button>
                  </form>
                }
              </div>
              <div className='flightinfo-ThirdPart flexa g20'>
                <div className='flightinfo-3-logo flexja'>3</div>
                <h1>Add traveller details</h1>
              </div>
              {switcherform && <>
                <div className='flightinfo-travellerdetails flexj flexc g20'>
                  <label>Billing Address</label>
                  <input className='flightinfo-billinginput' type='text' placeholder='Billing Address' onClick={() => { popp("billingAddress") }} value={details.dbillingAddress} onChange={(e) => { travellerinfo("dbillingAddress", e.target.value) }} />
                  <label>Traveller name and gender</label>
                  <div className='flightinfo-travellerdiv flexa g20'>
                    <input type='text' className='fname' placeholder='First name' value={details.dfname} onChange={(e) => { travellerinfo("dfname", `${e.target.value}`); }} onClick={() => { popp("fname") }} />
                    <input type='text' className='lname' placeholder='Last name' value={details.dlname} onChange={(e) => { travellerinfo("dlname", `${e.target.value}`) }} onClick={() => { popp("lname") }} />
                    <div className='gender flexa b1' onClick={() => { popp("gender") }}>
                      <input type='text' placeholder='Gender' className='b1' value={details.dgender} disabled />
                      <IoIosArrowDown className={pop["gender"] ? "gender-downarrow" : "gender-uparrow"} />
                      {pop["gender"] &&
                        <div className='gender-pop felxa flexc'>
                          <p onClick={() => { travellerinfo("dgender", "Male") }}>Male</p>
                          <p onClick={() => { travellerinfo("dgender", "Female") }}>Female</p>
                        </div>
                      }
                    </div>
                  </div>
                  <label>Nationality</label>
                  <div className='flexa g10'>
                    <div className='country flexa' onClick={() => { popp("country") }} >
                      <input type='text' className='country-input' placeholder='Country (e.g. India)' value={details.dcountry} disabled />
                      <IoIosArrowDown className={pop["country"] ? "country-downarrow" : "country-uparrow"} />
                      {pop["country"] &&
                        <div className='country-pop flexa g10 flexc'>
                          {countries.map((item, index) => (<div key={index} onClick={() => { travellerinfo("dcountry", item) }}>{item}</div>))}
                        </div>
                      }
                    </div>
                    <div className='state flexa' onClick={() => { popp("state") }} >
                      <input type='text' className='state-input' placeholder='state (e.g. Alaska)' value={details.dstate} disabled />
                      <IoIosArrowDown className={pop["state"] ? "state-downarrow" : "state-uparrow"} />
                      {pop["state"] &&
                        <div className='state-pop flexa g10 flexc'>
                          {states.map((item, index) => (<div key={index} onClick={() => { travellerinfo("dstate", item) }}>{item}</div>))}
                        </div>
                      }
                    </div>
                  </div>
                  <div className='flightinfo-buttondiv flex'>
                    <button onClick={() => { setswitcherform(false) }}>back</button>
                    <button onClick={() => { gotopayment(); popp("submitdetails");
                  
                    }}>Submit</button>
                  </div>
                </div>
              </>
              }
            </div>
            <div className='rightdiv-flight flex flexc'>
              <div className='flightinfo-price flexa'><p>Total price</p><h2>₹{caltotalamout()}</h2></div>
              <div className='flightinfo-base-fare flexa'><p>Base fare (travellers)</p>₹{dataa.ticketPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div className='flightinfo-tax flexa'><p>Taxes and fees</p><p>₹{taxCalculate()}</p></div>
              <div className='flightinfo-medical-benifit flexa'><p>Medi-cancel benefit <svg viewBox="0 0 12 12" className="ml-1 c-pointer c-secondary-500" height="14" width="14"><path d="M6 0c3.308 0 6 2.692 6 6s-2.692 6-6 6-6-2.692-6-6 2.692-6 6-6zm0 .75A5.257 5.257 0 00.75 6 5.257 5.257 0 006 11.25 5.257 5.257 0 0011.25 6 5.257 5.257 0 006 .75zm.577 4.525V9.4H5.452V5.275h1.125zM6.015 4.15a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="#3366cc" fillRule="evenodd"></path></svg></p> <p><del>₹199</del>&nbsp;<span>Free</span></p></div>
            </div>
          </div>
        </div>
      }
      {!pageLoader && <div className="lds-dual-ring"></div>}
      <Footer />
    </div>
  )
}







