import { useState,useEffect } from "react";
import "../styles/CarousalTwo.css";
import { datatwo } from "../components/Constant";

import {Link} from 'react-router-dom';

function CarouselHotelSecond() {
    const [slidetwo, setSlidetwo] = useState(0);
    
    function nextSlidetwo() {
        setSlidetwo((slidetwo + 1)%7);
    }
    function prevSlidetwo() {
        if(slidetwo==0){
            setSlidetwo(6);
        }
        else{
        setSlidetwo((slidetwo - 1)%7);
        }
    }
    useEffect(()=>{
        clearInterval(loop);
        const loop=setInterval(() => {
            setSlidetwo(s=>(s+1)%7);
        }, 8000);
    },[])
    return (
        <div className="carouseltwo flexja">
            
            {
                datatwo.map((item, idx) => {
                    return(<div key={idx} className={slidetwo == idx ? "slidetwo" : "slidetwo slide-hiddentwo"}>
                        <h4>{item.h4}</h4>
                        <h5>{item.h5}</h5>
                        <p className="secondh">{item.p}</p>
                        <Link to={`/`}>
                          <span> Know more</span>
                        </Link>
                      </div>)
                })
            }
            <div className="flexa">
                <svg className="arrowtwo arrow-lefttwo" onClick={prevSlidetwo} width="5" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9L1 5L5 1" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="indicatorstwo">
                    {
                        datatwo.map((_, idx) => {
                            return <button key={idx} onClick={() => setSlidetwo(idx)} className={slidetwo == idx ? "indicatortwo indicator-activetwo" : "indicatortwo indicator-inactivetwo"}></button>
                        })
                    }
                </span>
                <svg className="arrowtwo arrow-righttwo" onClick={nextSlidetwo} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
        </div>
    )
}

export default CarouselHotelSecond;