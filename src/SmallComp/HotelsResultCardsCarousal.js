import { useState,useEffect } from "react";
import "../styles/Carousal.css";

function HotelsResultCardsCarousal({data}) {
    const [slide, setSlide] = useState(0);
    
    function nextSlide() {
        setSlide((slide + 1)%data.length);
    }
    function prevSlide() {
        if(slide==0){
            setSlide(data.length-1);
        }
        else{
        setSlide((slide - 1)%data.length);
        }
    }
    return (
        <div className="carousel HotelsResultCardsCarousalMainDiv flexja">
            {
                data.map((item, idx) => {
                    return <img loading="lazy" src={item} alt="img" key={idx} className={slide == idx ? "slide" : "slide slide-hidden"} />
                })
            }
            <div className="flexa">
                <svg className="arrow leftarrow" onClick={(e)=>{e.stopPropagation();prevSlide()}} width="5" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9L1 5L5 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="indicators">
                    {
                        data.map((_, idx) => {
                            return <button key={idx} onClick={() => setSlide(idx)} className={slide == idx ? "indicator indicator-active" : "indicator indicator-inactive"}></button>
                        })
                    }
                </span>
                <svg className="arrow rightarrow" onClick={(e)=>{e.stopPropagation();nextSlide()}} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
        </div>
    )
}

export default HotelsResultCardsCarousal;