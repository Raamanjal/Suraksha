import React, { useState, useEffect } from 'react';
import { findLocalResources } from '../services/geminiService';
import { Resource } from '../types';
import { BuildingLibraryIcon, MapPinIcon, PhoneIcon } from './Icons';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-t-red-500 border-gray-700 rounded-full animate-spin"></div>
    </div>
);

const ResourceCard: React.FC<{resource: Resource}> = ({resource}) => (
    <div className="bg-gray-900 p-4 rounded-lg space-y-2">
        <div className="flex items-start">
            <BuildingLibraryIcon className="w-5 h-5 mt-1 mr-3 text-red-400 flex-shrink-0" />
            <h3 className="font-bold text-lg">{resource.name}</h3>
        </div>
        <div className="flex items-start">
            <MapPinIcon className="w-5 h-5 mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <p className="text-gray-300">{resource.address}</p>
        </div>
        <div className="flex items-start">
            <PhoneIcon className="w-5 h-5 mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <a href={`tel:${resource.phone}`} className="text-red-400 hover:underline">{resource.phone}</a>
        </div>
    </div>
)

interface Location {
    lat: number;
    lon: number;
}

const ResourcesScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationStatus, setLocationStatus] = useState('Fetching location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationStatus('Location found. You can search for resources near you.');
        },
        () => {
          setLocationStatus('Location access denied. Search by place name.');
        }
      );
    } else {
      setLocationStatus('Geolocation is not supported by your browser.');
    }
  }, []);


  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResources([]);

    try {
      const results = await findLocalResources(searchQuery, location || undefined);
      setResources(results);
       if (results.length === 0) {
        setError("No resources found for your query. Try a different search term.");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSearchNearMe = () => {
      const nearMeQuery = "hospitals, police stations, fire stations";
      setQuery(nearMeQuery);
      handleSearch(nearMeQuery);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2 px-2">Local Resource Directory</h2>
      <p className="text-sm text-gray-400 mb-4 px-2">{locationStatus}</p>

      <form onSubmit={handleFormSubmit} className="flex gap-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Hospitals near Lucknow"
          className="flex-grow bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 rounded-lg py-2 px-5 font-bold transition-colors disabled:bg-red-800 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Find'}
        </button>
      </form>
       <button 
        onClick={handleSearchNearMe}
        disabled={!location || isLoading}
        className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-2 px-5 font-bold transition-colors flex items-center justify-center gap-2 disabled:bg-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed mb-6"
        >
          <MapPinIcon className="w-5 h-5" />
          Search For Emergency Services Near Me
      </button>

      <div className="space-y-4">
        {isLoading && <Spinner />}
        {error && resources.length === 0 && <p className="text-center text-red-500">{error}</p>}
        {resources.length > 0 && (
          resources.map((res, index) => <ResourceCard key={index} resource={res} />)
        )}
        {!isLoading && !error && resources.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>Search for nearby police stations, hospitals, or other emergency services.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesScreen;
