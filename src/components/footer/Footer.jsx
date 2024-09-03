import React, { useEffect, useState } from 'react';
import './Footer.css';

export default function Footer() {
    const [location, setLocation] = useState('');
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data.address) {
                    const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.county;
                    setLocation(city);
                } else {
                    setLocation('Localização não disponível');
                }
            } catch (error) {
                console.error('Erro ao obter localização:', error);
                setLocation('Erro ao obter localização');
            }
        });

        const interval = setInterval(() => setTime(new Date()), 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedDate = time.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = time.toLocaleTimeString(
        undefined,
        { hour: 'numeric', minute: 'numeric' }
    );

    return (
        <div className="footer">
            <p>
                {location && `${location}, `} {formattedDate} | {formattedTime}
            </p>
        </div>
    );
}
