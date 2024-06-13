import { useState,useEffect } from "react";
import "../styles/CarousalThree.css";
import { datathree } from "../components/Constant";

function CarouselThree() {
    const [slidethree, setSlidethree] = useState(0);

    useEffect(()=>{
        clearInterval(loop);
        const loop=setInterval(() => {
            setSlidethree(s=>(s+1)%2);
        }, 3000);
    },[])
    return (
        <div className="carouselthree flexja">
            
            {
                datathree.map((item, idx) => {
                    return(<img src={item.img} alt="pics" key={idx} className={slidethree == idx ? "slidethree" : "slidethree slide-hiddenthree"}/>)
                })
            }
            <div className="flexa">
                <span className="indicatorsthree">
                    {
                        datathree.map((_, idx) => {
                            return <button key={idx} onClick={() => setSlidethree(idx)} className={slidethree == idx ? "indicatorthree indicator-activethree" : "indicatorthree indicator-inactivethree"}></button>
                        })
                    }
                </span>
            </div>
        </div>
    )
}

export default CarouselThree;