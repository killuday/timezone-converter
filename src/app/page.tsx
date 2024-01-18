"use client"
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

const Home = () => {
  const [selectedTimeZones, setSelectedTimeZones] = useState<string[]>(['Asia/Kolkata']);
  const [now, setNow] = useState(DateTime.utc().toMillis()); // Initialize with the current UTC time in milliseconds
  

  const aryIanaTimeZones = [
    'Europe/Andorra',
    'Asia/Karachi',
    'Asia/Dhaka',
    'Asia/Dubai',
    'Asia/Kabul',
    'Asia/Jerusalem',
    'Asia/Kolkata',
    'Indian/Chagos',
    'Asia/Baghdad',
  ];

  const convertToUTC = (selectedTimeZone: string, currentTime: number) => {
    const now = DateTime.fromMillis(currentTime).setZone(selectedTimeZone);
    return now;
  };
  const [utcDateTimes, setUtcDateTimes] = useState<DateTime[]>([convertToUTC('Europe/Andorra', now)]);

  const handleTimeZoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeZone = event.target.value;
    updateSelectedTimeZones(newTimeZone);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNow = parseInt(event.target.value, 10);
    setNow(newNow);
  };

  const updateSelectedTimeZones = (newTimeZone: string) => {
    if (!selectedTimeZones.includes(newTimeZone)) {
      const updatedTimeZones = [...selectedTimeZones, newTimeZone];
      const updatedUtcDateTimes = updatedTimeZones.map((timezone) => convertToUTC(timezone, now));

      setSelectedTimeZones(updatedTimeZones);
      setUtcDateTimes(updatedUtcDateTimes);
    } else {
      const updatedTimeZones = selectedTimeZones.filter((timezone) => timezone !== newTimeZone);
      const updatedUtcDateTimes = updatedTimeZones.map((timezone) => convertToUTC(timezone, now));

      setSelectedTimeZones(updatedTimeZones);
      setUtcDateTimes(updatedUtcDateTimes);
    }
  };

  useEffect(() => {
    // Update UTC times whenever 'now' changes
    const updatedUtcDateTimes = selectedTimeZones.map((timezone) => convertToUTC(timezone, now));
    setUtcDateTimes(updatedUtcDateTimes);
  }, [now, selectedTimeZones]);

  return (
    <div className="container flex items-center justify-center mx-auto p-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">Timezone Converter</h1>
        <label className="block mb-2">Select Timezone:</label>
        <select
          className="border p-2 mb-4"
          value={selectedTimeZones[selectedTimeZones.length - 1]}
          onChange={handleTimeZoneChange}
        >
          {aryIanaTimeZones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
        <p>Current Time (UTC): {DateTime.fromMillis(now).toUTC().toFormat('yyyy-MM-dd HH:mm:ss')}</p>
       
        {selectedTimeZones.map((timezone, index) => (
          <>

          <p key={timezone} className="text-lg">
            UTC Time ({timezone}): {utcDateTimes[index].toFormat('HH:mm')}
          </p>
          <input
  type="range"
  min={DateTime.utc().startOf('day').toMillis()} // Convert to milliseconds
  max={DateTime.utc().endOf('day').toMillis()} // Convert to milliseconds
  step={60000} // 1 minute step
  value={now}
  onChange={handleSliderChange}
/>
          </>
        ))}
      </div>
    </div>
  );
};

export default Home;
