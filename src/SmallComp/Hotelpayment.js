import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IoIosArrowDown } from "react-icons/io";
import Footer from "../SmallComp/Footer";
import { CgClose } from 'react-icons/cg';
import { IoChevronDown } from "react-icons/io5";
import "../styles/Hotelpayment.css"
import { countries,states,months,days,hotelpaymentStatefun, baseapi,localtoken } from '../components/Constant';

export default function hotelpayment() {
  const colorrating = useRef([]);
  const colorratinghalf = useRef([]);
  const navigate = useNavigate();
  const inputref = useRef()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let hotel_id = searchParams.get("hotel_id");
  let adults = JSON.parse(searchParams.get("adults"));
  let childrens = JSON.parse(searchParams.get("childrens"));
  let rooms = searchParams.get("rooms");
  let roomno = JSON.parse(searchParams.get("roomno"));
  let dayOfWeek = searchParams.get("date");
  const dateObject = new Date(dayOfWeek);
  

  const [dataa, setdataa] = useState({});
  const {details,setdetails}=hotelpaymentStatefun();
  const [loader, setloader] = useState(false);
  const [phonenumber, setphonenumber] = useState("");
  const [email, setemail] = useState("");
  const [errorcontact, seterrorcontact] = useState(false);
  const [pop, setpop] = useState({});
  const [switcherform, setswitcherform] = useState(false);
  const [errortravellerform, seterrortravellerform] = useState(false);
  

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

  const senddata = async () => {
    try {
      if (details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress) {
        const response = await (await fetch(`${baseapi}/booking`,
          {
            method: "POST",
            headers: {
              projectID: "mhroh2oic5sz",
              Authorization: `Bearer ${localtoken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingType: "hotel",
              bookingDetails: {
                hotelId: `${hotel_id}`,
                startDate: `${dateObject}`,
                endDate: `${dateObject}`
              }
            })
          }
        )).json();

      }
    }
    catch (error) {
      alert(error);
    }
  } 

  function gotopayment() {
    if (details.dnumber && details.demail && details.dfname && details.dlname && details.dgender && details.dcountry && details.dstate && details.dbillingAddress) {
      const amount=caltotalamout();
      senddata();
      navigate(`/hotels/results/hotelInfo/Info/paymentBooking?FirstName="${details.dfname}"&Email="${details.demail}"&amount=${amount}`);
    }
    else {
      seterrortravellerform(true);
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

  function caltotalamout() {
    const val = ((dataa.rooms[roomno].costDetails.baseCost) * (adults + childrens));
    const add = val + dataa.rooms[roomno].price + dataa.rooms[roomno].costDetails.taxesAndFees;
    return add.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }




  const fetchcarddetails = async () => {
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
      if(response.message=="success"){
      setTimeout(() => {
        colorratingmanager(response.data.rating);
      }, 1000);
    }
    console.log(response);
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    fetchcarddetails();
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
    <>
      {loader && Object.keys(dataa).length > 0 &&
        <div className='hotelpayment'>
          <nav className=' flexa'>
            <Link to= "/">
            <svg width="107" height="24" viewBox="0 0 310 65" fill="none" className=" c-pointer" ><path d="M249.469 16.3906C243.189 16.3906 240.039 19.1706 240.039 25.4606V49.1506H247.469V25.8206C247.469 23.7506 248.399 22.7506 250.539 22.7506H257.039V16.3906H249.469V16.3906Z" fill="#FF4F17"></path><path d="M264.891 1.59961C262.461 1.59961 260.461 3.59961 260.461 6.09961C260.461 8.59961 262.461 10.5296 264.891 10.5296C267.321 10.5296 269.391 8.52961 269.391 6.09961C269.391 3.66961 267.391 1.59961 264.891 1.59961Z" fill="#FF4F17"></path><path d="M268.61 16.2402H261.25V49.0902H268.61V16.2402Z" fill="#FF4F17"></path><path d="M121.289 42.8804C119.149 42.8804 118.219 42.3104 118.219 40.1704V1.65039H110.789V40.1704C110.789 46.6704 114.429 49.2404 120.139 49.2404H124.069V42.8804H121.289V42.8804Z" fill="#FF4F17"></path><path d="M209.119 16.2695C202.839 16.2695 199.689 19.0495 199.689 25.3395V49.1195H207.119V25.6995C207.119 23.6295 208.049 22.6295 210.189 22.6295H216.689V16.2695H209.119Z" fill="#FF4F17"></path><path d="M228.33 16.2998V8.08984H220.9V40.0798C220.9 46.2898 224.11 49.1498 230.33 49.1498H235.9V42.7898H231.4C229.4 42.7898 228.33 42.0798 228.33 40.0798V22.6598H235.9V16.2998H228.33V16.2998Z" fill="#FF4F17"></path><path d="M274.82 16.5006V63.3706H282.25V46.3006C284.91 48.1406 288.13 49.2306 291.6 49.2306C300.67 49.2306 308.02 41.8806 308.02 32.8106C308.02 23.7406 300.67 16.3906 291.6 16.3906C288.12 16.3906 284.9 17.4806 282.25 19.3206V16.5006H274.82V16.5006ZM282.25 32.8106C282.25 27.6406 286.44 23.4606 291.6 23.4606C296.76 23.4606 300.95 27.6506 300.95 32.8106C300.95 37.9706 296.76 42.1606 291.6 42.1606C286.44 42.1606 282.25 37.9706 282.25 32.8106V32.8106Z" fill="#FF4F17"></path><path d="M156.92 32.1006C156.92 22.1006 150.21 16.3906 141.42 16.3906C131.57 16.3906 125.5 23.2506 125.5 32.7406C125.5 42.2306 132.21 49.2406 141.57 49.2406C149.85 49.2406 154.21 45.5306 156.28 39.3906H148.28C147.07 41.7506 144.78 42.8206 141.42 42.8206C136.99 42.8206 133.35 40.0406 133.07 35.0406H156.78C156.92 33.4706 156.92 32.7506 156.92 32.1106V32.1006ZM133.14 29.7406C133.78 25.3806 136.85 22.7406 141.64 22.7406C146.43 22.7406 149.07 25.2406 149.49 29.7406H133.14Z" fill="#FF4F17"></path><path d="M98.8005 37.9506C97.5905 41.3806 95.3005 42.8106 91.8705 42.8106C86.2305 42.8106 83.8005 38.3806 83.8005 32.7406C83.8005 27.1006 86.5805 22.7406 92.0105 22.7406C95.4405 22.7406 97.7205 24.5306 98.7905 27.6006H106.72C104.86 20.1006 99.2905 16.3906 91.8705 16.3906C81.8705 16.3906 76.2305 23.5306 76.2305 32.7406C76.2305 42.7406 82.8705 49.2406 91.8705 49.2406C100.87 49.2406 105.22 44.1706 106.72 37.9606H98.7905L98.8005 37.9506Z" fill="#FF4F17"></path><path d="M56.6095 17.7393C44.1095 26.8793 33.3295 38.8793 23.6895 48.9493C22.9795 49.6593 22.0495 50.1593 21.0495 50.1593C19.8395 50.1593 18.9095 49.4493 18.0495 48.1593C15.5495 44.4493 11.7695 35.4493 10.0495 31.5193C8.68954 28.3093 9.40954 25.6593 12.6195 24.3093C15.8295 23.0193 19.3995 22.8093 20.2595 26.4493C20.2595 26.4493 21.8995 32.8093 22.3995 34.6593C32.3295 25.4493 44.5395 15.6693 54.8895 9.66929C52.3195 4.80929 47.2495 1.5293 41.4695 1.5293H16.9795C8.54954 1.5293 1.76953 8.30929 1.76953 16.6693V41.2293C1.76953 49.5793 8.54954 56.3693 16.9795 56.3693H41.4695C49.8195 56.3693 56.6095 49.5893 56.6095 41.2293V17.7393V17.7393Z" fill="#FF4F17"></path><path d="M186.059 16.5006V19.3206C183.399 17.4806 180.179 16.3906 176.709 16.3906C167.639 16.3906 160.289 23.7406 160.289 32.8106C160.289 41.8806 167.639 49.2306 176.709 49.2306C180.189 49.2306 183.409 48.1406 186.059 46.3006V49.0906H193.489V16.5006H186.059ZM176.709 42.1606C171.539 42.1606 167.359 37.9706 167.359 32.8106C167.359 27.6506 171.549 23.4606 176.709 23.4606C181.869 23.4606 186.059 27.6506 186.059 32.8106C186.059 37.9706 181.869 42.1606 176.709 42.1606Z" fill="#FF4F17"></path></svg>
          </Link>
          </nav>
          <div className='hotelpaymentbodydiv flexja g20'>
            <div className='hotelpaymentleftdiv'>
              <div className='flightinfo-FirstPart flexa g20'>
                <div className='flightinfo-1-logo flexja'>1</div>
                <h3>Review your itinerary</h3> 
              </div>
              <div className='hotelpaymentcarddetails'>
                <div className='hotelpaymentcardborderdotted flex flexjsb'>
                  <div className='hotelpaymentcardhalfbolls1'></div>
                  <div className='hotelpaymentcardhalfbolls2'></div>
                  <div className='flex flexc g5'>
                    <div className='hotelpaymentstar'>{dataa.amenities.length}-star hotel in {dataa.location.match(/^([^,]+)/)[1]}</div>
                    <h2>{dataa.name}&nbsp;-&nbsp;{dataa.location.match(/^([^,]+)/)[1]}</h2>
                    <span className='flexa'>
                     
                    {dataa.rating >= 1 && dataa.rating <= 5 ?  dataa.rating :''}/5
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
                   

                  </div>
                  <img className='hotelpaymentcardimage' src={`${dataa.images[0]}`}></img>
                </div>
                <div className='hotelpaymentcardbottom flexa flexjsb'>
                  <div className='flexa'>
                    <div className='hotelpaymentbottomleftcard1 flexja'>
                      <div className='flex flexc g5'>
                        <p>check-in</p>
                        <h3>{dateObject.getDate()}&nbsp;{months[dateObject.getMonth()]}</h3>
                        <p>{days[dateObject.getDay()]},{dateObject.getFullYear()}</p>
                      </div>
                    </div>
                    <span className='smallline' />
                    <div className='hotelpaymentbottomleftcard2 flexja'>
                      <div className='flex flexc g5'>
                        <p>check-out</p>
                        <h3>{dateObject.getDate()}&nbsp;{months[dateObject.getMonth()]}</h3>
                        <p>{days[dateObject.getDay()]},{dateObject.getFullYear()}</p>
                      </div>
                    </div>
                  </div>
                  <span />
                  <div className='flexja flexc'>
                    <div className='flex flexc g5'>
                      <p>Rooms & Guests</p>
                      <h3>{rooms} Room, {childrens + adults} Guests</h3>
                      <p>{adults} adults {childrens ? `${childrens} children` : ""}</p>
                    
                    </div>
                  </div>
                  <div>

                   <p onClick= {() => popp('details')} style={{color: 'blue'}}>Details        <IoChevronDown/></p> 
             
                   {pop['details'] && <div className='detailspop'>
                    <div className='flex g20 '>
                      <CgClose onClick = {() => popp('details')}/>
                      <h3>Guests Information</h3>
                    </div>
                    <div className='flex g20 mt50 flexjsb'>
                      <p> Room {dataa.rooms.length}</p>
                      <p>{dataa.houseRules.guestProfile.unmarriedCouplesAllowed }  {adults} Adults</p>
                    </div>
                     </div>}
                  </div>
                </div>
              </div>

              <div className= 'hotelpaymentcarddetails1'>
                <div className='flex g10'>
                <h3>{dataa.rooms[0].roomType} ,</h3>
                <h3>{dataa.rooms[0].bedDetail}</h3>
                </div>
                <div className='flex g20'>
                <img src={dataa.images[1]} className= 'hotelroom-img'/>
                
                <div className=' flex  g20 mt50'>
                <p>{dataa.rooms[0].bedDetail}</p>
                <p>{dataa.rooms[0].roomSize} sq.ft.</p>
                <p>{dataa.rooms[0].roomType}</p>
                <p> Room {dataa.rooms[0].roomNumber}</p>
                </div>
                <p className='mt70' onClick={() => popp('moredetails')}>see more details</p>
                {pop['moredetails'] && <div className='moredetailspop'>
                  <CgClose onClick={() => popp('moredetails')}/>
                  <div className='flex g10'>
                    <h3>{dataa.rooms[0].roomType} ,</h3>
                    <h3>{dataa.rooms[0].bedDetail}</h3>

                  </div>
                  <img src={dataa.images[1]} className= 'hotelroom-imgpop'/>
                  <div className=' flex  g20 mt50'>
                <p>{dataa.rooms[0].bedDetail}</p>
                <p>{dataa.rooms[0].roomSize} sq.ft.</p>
                <p>{dataa.rooms[0].roomType}</p>
                <p> Room {dataa.rooms[0].roomNumber}</p>
                </div>
                  </div>}
                </div>
              </div>
                <div className='flexc g20 mt50'>
                  <h2>Cancellation Policy</h2>
                  <p>{dataa.rooms[0].cancellationPolicy}</p>

                </div>

                <div className='flexc g20 mt50'>
                  <h2>Booking Policy</h2>
                  <p>{dataa.childAndExtraBedPolicy.extraBedProvidedForChild === true ? 'Guests below 18 years of age allowed' : 'Guests below 18 years of age not allowed'}</p>
                  <p onClick= {()=>popp('seemore')} style={{color: 'blue'}}>see more</p>
                  
                                {
                                    pop['seemore'] && <div className='flexc g20 seemore'>
                                        <CgClose onClick={() => popp('seemore')} />
                                        <p>Guests below 18 years of age not allowed</p>
                                        </div>
                                }             
                </div>

              <div className='flightinfo-SecondPart flexa g20'>
                <div className='flightinfo-2-logo flexja'>2</div>
                <h1>Add contact details <br /><p>E-ticket will be sent to this email address</p></h1>
              </div>
              <div className='flightinfo-contactdetails flexj flexc'>
                {!switcherform &&
                  <form onSubmit={(e) => personalInfosenderone(e)} className='flexj flexc'>
                    <label htmlFor="mobile">Mobile number</label>
                    <input type="number" className='flightinfo-mobileinput' onClick={() => { popp("mobile") }} placeholder='Mobile number' value={phonenumber} onChange={(e) => { seterrorcontact(false); setphonenumber(e.target.value);numbererror(e) }} />
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
                  <input className='flightinfo-billinginput' type='text' placeholder='Billing Address' onClick={() => { popp("billingAddress") }} value={details.dbillingAddress} onChange={(e) => { travellerinfo("dbillingAddress", e.target.value); seterrortravellerform(false) }} />
                  <label>Guest name and gender</label>
                  <div className='flightinfo-travellerdiv flexa g20'>
                    <input type='text' className='fname' placeholder='First name' value={details.dfname} onChange={(e) => { travellerinfo("dfname", `${e.target.value}`); seterrortravellerform(false) }} onClick={() => { popp("fname") }} />
                    <input type='text' className='lname' placeholder='Last name' value={details.dlname} onChange={(e) => { travellerinfo("dlname", `${e.target.value}`); seterrortravellerform(false) }} onClick={() => { popp("lname") }} />
                    <div className='gender flexa b1' onClick={() => { popp("gender"); seterrortravellerform(false) }}>
                      <input type='text' placeholder='Gender' className='b1' value={details.dgender} disabled />
                      <IoIosArrowDown className={pop["gender"] ? "gender-downarrow" : "gender-uparrow"} />
                      {pop["gender"] &&
                        <div className='gender-pop felxa flexc'>
                          <p onClick={() => { travellerinfo("dgender", "Male"); seterrortravellerform(false) }}>Male</p>
                          <p onClick={() => { travellerinfo("dgender", "Female"); seterrortravellerform(false) }}>Female</p>
                        </div>
                      }
                    </div>
                  </div>
                  <label>Nationality</label>
                  <div className='flexa g10 resflexc'>
                    <div className='country flexa' onClick={() => { popp("country"); seterrortravellerform(false) }} >
                      <input type='text' className='country-input' placeholder='Country (e.g. India)' value={details.dcountry} disabled />
                      <IoIosArrowDown className={pop["country"] ? "country-downarrow" : "country-uparrow"} />
                      {pop["country"] &&
                        <div className='country-pop flexa g10 flexc'>
                          {countries.map((item, index) => (<div key={index} onClick={() => { travellerinfo("dcountry", item); seterrortravellerform(false) }}>{item}</div>))}
                        </div>
                      }
                    </div>
                    <div className='state flexa' onClick={() => { popp("state"); seterrortravellerform(false) }} >
                      <input type='text' className='state-input' placeholder='state (e.g. Alaska)' value={details.dstate} disabled />
                      <IoIosArrowDown className={pop["state"] ? "state-downarrow" : "state-uparrow"} />
                      {pop["state"] &&
                        <div className='state-pop flexa g10 flexc'>
                          {states.map((item, index) => (<div key={index} onClick={() => { travellerinfo("dstate", item), seterrortravellerform(false) }}>{item}</div>))}
                        </div>
                      }
                    </div>
                  </div>
                  {errortravellerform && <div className='errortravellerform'>Pls fill the forms Correctly</div>}
                  <div className='flightinfo-buttondiv flex'>
                    <button onClick={() => { setswitcherform(false) }}>back</button>
                    <button onClick={() => { gotopayment(); popp("submitdetails")}}>Submit</button>
                  </div>
                </div>
              </>
              }
            </div>
            <div className='hotelpaymentrightdiv flexj'>
              <div className='rightdiv flex flexc'>
                <div className='flightinfo-price flexa'><p>Total price</p><h2>₹{caltotalamout()}</h2></div>
                <div className='flightinfo-base-fare flexa'><p>Room charges</p>₹{dataa.rooms[roomno].price}</div>
                <div className='flightinfo-base-fare flexa'><p>Per guest charges</p>₹{dataa.rooms[roomno].costDetails.baseCost}</div>
                <div className='flightinfo-base-fare flexa'><p>Guests</p>{adults} adults{childrens ? `, ${childrens} children` : ""}</div>
                <div className='flightinfo-tax flexa'><p>Taxes and fees</p><p>₹{dataa.rooms[roomno].costDetails.taxesAndFees}</p></div>
                <div className='flightinfo-medical-benifit flexa'><p>Medi-cancel benefit <svg viewBox="0 0 12 12" className="ml-1 c-pointer c-secondary-500" height="14" width="14"><path d="M6 0c3.308 0 6 2.692 6 6s-2.692 6-6 6-6-2.692-6-6 2.692-6 6-6zm0 .75A5.257 5.257 0 00.75 6 5.257 5.257 0 006 11.25 5.257 5.257 0 0011.25 6 5.257 5.257 0 006 .75zm.577 4.525V9.4H5.452V5.275h1.125zM6.015 4.15a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="#3366cc" fillRule="evenodd"></path></svg></p> <p><del>₹199</del>&nbsp;<span>Free</span></p></div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      }
      {!loader && <div className="lds-dual-ring"></div>}
    </>
  )
} 
