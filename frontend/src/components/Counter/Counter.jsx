import React from 'react'
import './Counter.css'
const Counter = () => {
  return (
    <div className="stats-section py-5">
        <div className="overlay">
            <div className="container">
                <div className="row align-items-center">
                    {/* Left Side Title */}
                    <div className="col-12 col-md-6 mb-4 mb-md-0">
                        <h2 className="text-white">Satsang Nepal, Satsang Biratnagar.</h2>
                        <p className="text-light">An overview of the Families and Individuals currently active and following <br />Sri Sri Thakur Anukulchandra.</p>
                    </div>
    
                    {/* Right Side Counters */}
                    <div className="col-12 col-md-6">
                        <div className="row text-center">
                            <div className="col-6">
                                <div className="counter-card">
                                    <div className="counter-number">2500</div>
                                    <div className="counter-label">Total Families Initiated</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="counter-card">
                                    <div className="counter-number">5000</div>
                                    <div className="counter-label">Total People Initiated</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Counter
