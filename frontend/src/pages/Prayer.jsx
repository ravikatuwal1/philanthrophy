import React, { useMemo, useState } from 'react';
import './Prayer.css';
import TIMES from '../data/prayer.json';
import PrayerVideo from '../components/PrayerVideo/PrayerVideo';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const ZONE_LOCATIONS = {
  East: ['Janakpur', 'Kosi', 'Mechi', 'Sagarmatha'],
  West: ['Bheri', 'Karnau', 'Mahakali', 'Rapti', 'Seti'],
  Central: ['Bagmati', 'Dhawalagiri', 'Gandaki', 'Lumbini', 'Narayani'],
};



function MonthTile({ month, am, pm }) {
  return (
    <div className="month-card">
      <h6 className="month-name">{month}</h6>
      <div className="time-row">
        <span className="chip am"><i className="bi bi-sun me-1" />AM</span>
        <span className="time-val">{am}</span>
      </div>
      <div className="time-row">
        <span className="chip pm"><i className="bi bi-moon me-1" />PM</span>
        <span className="time-val">{pm}</span>
      </div>
    </div>
  );
}

export default function Prayer() {
  const [zone, setZone] = useState('East');

  const locations = ZONE_LOCATIONS[zone] || [];
  const zoneTimes = TIMES[zone];

  const tiles = useMemo(() =>
    MONTHS.map((m) => (
      <MonthTile key={m} month={m} am={zoneTimes[m].am} pm={zoneTimes[m].pm} />
    )),
  [zoneTimes]);

  return (
    <>
      {/* New: Zone selector + timetable */}
      <div className="container prayer-zone mt-5">
        <h2 className="text-center mb-4 prayer-title">Congregational Prayer Timetable</h2>

        <div className="zone-bar d-flex align-items-center justify-content-center gap-3 mb-3">
          <span className="zone-label">Zone</span>
          <select
            className="form-select zone-select"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            <option value="East">East</option>
            <option value="Central">Central</option>
            <option value="West">West</option>
          </select>
        </div>

        <div className="text-center">
          <div className="zone-title">{zone}</div>
          <div className="zone-locations">
            <strong>Districts/Locations :</strong> {locations.join(', ')}
          </div>
        </div>

        <div className="month-grid mt-4">
          {tiles}
        </div>
      </div>
      <PrayerVideo />
    </>
  );
}