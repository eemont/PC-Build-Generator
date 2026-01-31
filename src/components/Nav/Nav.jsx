import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Nav.css";


export default function Nav() {

    const { selectedTab, setSelectedTab } = useState('home');

    useEffect(() => {
        const links = document.querySelectorAll(".navbar .links a");

        const joinButton = document.querySelector(".navbar .links #join")
        let computedStyles = window.getComputedStyle(joinButton);
        const primaryPurple = computedStyles.getPropertyValue("--primary-purple");

        const h2 = document.querySelector(".navbar h2");
        computedStyles = window.getComputedStyle(h2);
        const grayText = computedStyles.getPropertyValue("color");

        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const img = e.target.querySelector('.img');
                img.style.background = primaryPurple;
            });

            link.addEventListener('mouseleave', (e) => {
                const img = e.target.querySelector('.img');
                img.style.background = grayText;
            })
        });

    }, []);


    return (
            <nav className="navbar">
                <Link to="/" className="brand">
                    <div className="img" id="pc" />
                    <h2>PC Build Generator</h2>
                </Link>
                <div className="links">
                    <Link to="/">
                        <div className="img" id="home" />
                        <p>Home</p>
                    </Link>
                    <Link to="/build">
                        <div className="img" id="build" />
                        <p>Build Your PC</p>
                    </Link>
                    <Link to="/saved">
                        <div className="img" id="save" />
                        <p>Saved Builds</p>
                    </Link>
                    <Link to="/">
                        <button className='join-now'>
                            <div className="img" id="join" />
                            <p>Join Now</p>
                        </button>
                    </Link>
                </div>
            </nav>
    )
}