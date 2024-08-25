import React from 'react'
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import myImage from './assets/video.mp4';

const Home = () => {
    return (
        <div className="ai_body_content">
            <div className="header">
                <h3 id="course">AI Mushroom Classification</h3>
            </div>
            <div className="ai_box">
                <video autoPlay muted loop id="background-video">
                    <source src={myImage} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="ai_content">
                    <h1 id="title">
                        Through this AI project, we aim to identify and classify mushrooms to distinguish between edible and poisonous varieties                    </h1>
                    <p id="detail_about_title">
                    </p>
                </div>
                <div className="ai_actions">
                    <Link to="/predict-page">
                        <button id="predict_btn">Predict</button>
                    </Link>
                </div>
            </div>
            
        </div>)
}

export default Home