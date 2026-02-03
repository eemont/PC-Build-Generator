import { Link } from "react-router-dom"

import "./Home.css"
import pcVideo from "../../assets/pc.mp4"

export default function Home() {

    return (
        <div>
            <video width="100%" height="100%" autoPlay loop muted className="video-bg">
                <source src={pcVideo} type="video/mp4" />
            </video>
            
            <div className="home-page">
                <div className="welcome-box">
                    <div className="welcome-content">
                        <h1>BUILD YOUR PERFECT PC</h1>
                        <p>Generate optimized builds tailored to your budget and performance goals</p>
                        <div className="call-to-action">
                            <Link to="/build">
                                <button id="start-building">Start Building</button>
                            </Link>
                            <Link to="/saved">
                                <button>View Saved Builds</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="how-it-works">
                    <h1>How It Works</h1>
                    <p>Follow 3 simple steps to get your custom PC build.</p>
                    <div className="step-cards">
                        <div className="step">
                            <h2 className="step-number">1</h2>
                            <h4>Enter your budget</h4>
                            <p>Type in your maximum spend to get started.</p>
                        </div>

                        <div className="step">
                            <h2 className="step-number">2</h2>
                            <h4>Generate a Build</h4>
                            <p>Instant recommendations with full compatibility checks.</p>
                        </div>

                        <div className="step">
                            <h2 className="step-number">3</h2>
                            <h4>Customize & Save</h4>
                            <p>Tweak parts, save your build, and share it with friends.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}