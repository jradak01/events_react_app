import React from "react";
import { Carousel } from 'react-bootstrap';

const Pocetna = () => {
    return (
        <div>
            <Carousel style={{ width: '60%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://www.pulainfo.hr/wp/wp-content/uploads/2019/05/party-1.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Istraži</h3>
                        <p>Pronađi događaje koji te zanimaju u nekom mjestu, od neke osobe ili pak po tematici!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://cdn.hiconsumption.com/wp-content/uploads/2020/08/How-To-Build-An-Outdoor-Movie-Theater-01-Hero.jpg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Kreiraj</h3>
                        <p>Isplanirao si neki događaj? Želiš obavijestiti prijatelje? Kreiraj događaj na našoj stranici i obavijesti ih!</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://www.rollingstone.com/wp-content/uploads/2020/03/ConcertCrowd.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Zabavi se</h3>
                        <p>Iskoristi svoje slobodno vrijeme najbolje što možeš!</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Pocetna;