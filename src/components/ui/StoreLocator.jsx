import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Search, MapPin, Navigation, LocateFixed, Loader2 } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase, mapboxToken } from '@/lib/supabase'; 

mapboxgl.accessToken = mapboxToken;

// Expanded bounds to ensure the map doesn't "cut" or prevent panning to edges
const PHILIPPINES_BOUNDS = [[114.0, 4.0], [130.0, 22.0]];

const StoreLocator = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const branchMarkers = useRef([]);

  const [userInput, setUserInput] = useState('');
  const [allBranches, setAllBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const getMapboxCoords = (coordInput) => {
    if (!coordInput || typeof coordInput !== 'string') return null;
    const parts = coordInput.split(',').map(n => parseFloat(n.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[1], parts[0]]; 
    }
    return null;
  };

  const renderMarkers = (branches) => {
    if (branchMarkers.current) {
      branchMarkers.current.forEach(m => m.remove());
    }
    branchMarkers.current = [];

    branches.forEach((loc) => {
      const coords = getMapboxCoords(loc.coordinates);
      if (!coords) return;

      const marker = new mapboxgl.Marker({ color: '#013F99' })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${loc.name}</b>`))
        .addTo(map.current);
      
      branchMarkers.current.push(marker);
    });
  };

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      // UPDATED: Centered on Visayas and zoom level 5 to see the whole country
      center: [122.5, 12.5], 
      zoom: 5,
      maxBounds: PHILIPPINES_BOUNDS
    });

    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('Mortuaries').select('*');
        if (error) throw error;
        const cleanData = data.filter(item => getMapboxCoords(item.coordinates) !== null);
        setAllBranches(cleanData);
        setFilteredBranches(cleanData);
        renderMarkers(cleanData);

        // Force resize to fix layout "cuts" during initial render
        setTimeout(() => {
          map.current?.resize();
        }, 300);

      } catch (err) {
        console.error("Supabase error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    map.current.on('load', fetchData);
  }, []);

  const handleSearch = async () => {
    if (!userInput) {
      setFilteredBranches(allBranches);
      renderMarkers(allBranches);
      if (userMarker.current) userMarker.current.remove();
      return;
    }

    setIsSearching(true);
  
    try {
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(userInput)}.json?access_token=${mapboxgl.accessToken}&country=ph&limit=1`
      );
      const geoData = await geoRes.json();
      
      if (!geoData.features?.length) {
        alert("Location not found.");
        setIsSearching(false);
        return;
      }
  
      const userCoords = geoData.features[0].center; 

      const candidates = allBranches.filter(branch => {
        const bCoords = getMapboxCoords(branch.coordinates);
        // Pre-filter with 40km air-distance (road distance is usually longer)
        return bCoords && turf.distance(turf.point(userCoords), turf.point(bCoords)) <= 40; 
      }).slice(0, 24);

      if (candidates.length === 0) {
        setFilteredBranches([]);
        renderMarkers([]);
        setIsSearching(false);
        return;
      }

      const coordsString = [
        userCoords.join(','),
        ...candidates.map(b => getMapboxCoords(b.coordinates).join(','))
      ].join(';');

      const matrixRes = await fetch(
        `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordsString}?sources=0&annotations=distance&access_token=${mapboxgl.accessToken}`
      );
      const matrixData = await matrixRes.json();

      const nearby = candidates.map((branch, index) => {
        const distanceInMeters = matrixData.distances[0][index + 1];
        return {
          ...branch,
          distance: distanceInMeters / 1000 
        };
      })
      .filter(b => b.distance <= 25)
      .sort((a, b) => a.distance - b.distance);

      setFilteredBranches(nearby);
      renderMarkers(nearby); 
  
      if (userMarker.current) userMarker.current.remove();
      userMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(userCoords)
        .addTo(map.current);

      map.current.flyTo({ 
        center: userCoords, 
        zoom: nearby.length > 0 ? 11 : 9 
      });
  
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const flyToLocation = (loc) => {
    setActiveBranch(loc.id);
    map.current?.flyTo({ 
      center: getMapboxCoords(loc.coordinates), 
      zoom: 14,
      essential: true 
    });
  };

  return (
    <div className="w-full animate-in fade-in duration-700 p-4">
      <div className="mb-8 border-l-4 border-brand-accent pl-6">
        <h2 className="text-3xl font-bold text-brand-primary uppercase tracking-tight">Search Mortuary</h2>
        <p className="text-slate-500 font-medium">Find nearest via road distance (within 25km).</p>
      </div>

      <div className="flex flex-col lg:flex-row h-[650px] w-full bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200">
        <div className="w-full lg:w-96 flex flex-col border-r border-slate-100 bg-slate-50">
          <div className="p-6 bg-white border-b border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Your Location</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LocateFixed className="absolute left-3 top-3 text-blue-500" size={18} />
                <input 
                  type="text"
                  placeholder="Enter city or area..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Loader2 className="animate-spin mb-2" size={24} />
                <p className="text-xs tracking-widest uppercase">Fetching Data...</p>
              </div>
            ) : filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <div 
                  key={branch.id}
                  onClick={() => flyToLocation(branch)}
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                    activeBranch === branch.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-transparent bg-white shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-blue-900 text-md leading-tight">{branch.name}</h3>
                    {branch.distance !== undefined && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                        {branch.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin size={12} className="mt-0.5 text-blue-400 flex-shrink-0" /> 
                    {branch.address}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200 mx-2">
                <p className="text-slate-400 text-sm italic">No branches within 25km road distance.</p>
                <button 
                   onClick={() => {
                     setFilteredBranches(allBranches);
                     renderMarkers(allBranches);
                     if (userMarker.current) userMarker.current.remove();
                     setUserInput('');
                     map.current?.flyTo({ center: [122.5, 12.5], zoom: 5 });
                   }} 
                   className="text-blue-600 text-xs font-bold mt-3 underline uppercase"
                >
                  Show all nationwide
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative bg-slate-100">
          <div ref={mapContainer} className="absolute inset-0 h-full w-full" />
          <button 
            onClick={() => map.current?.flyTo({ center: [122.5, 12.5], zoom: 5 })}
            className="absolute bottom-6 right-6 bg-white p-4 rounded-full shadow-xl z-10 hover:scale-110 transition-transform active:scale-95 text-blue-600 border border-slate-100"
            title="Recenter Philippines"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;