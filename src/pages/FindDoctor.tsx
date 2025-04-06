import { useState, useCallback, useEffect } from 'react'
import { useQuery } from 'react-query'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import type { Doctor } from '../types/database'

const containerStyle = {
  width: '100%',
  height: '400px'
}

export default function FindDoctor() {
  const [location, setLocation] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 })
  const [mapCenter, setMapCenter] = useState(userLocation)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  })

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(newLocation)
          setMapCenter(newLocation)
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const { data: doctors, isLoading } = useQuery<Doctor[]>(['doctors', location], async () => {
    const query = supabase
      .from('doctors')
      .select('*')
      .order('name')
    
    if (location) {
      query.ilike('location', `%${location}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  })

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    if (doctors && doctors.length > 0) {
      const bounds = new window.google.maps.LatLngBounds(mapCenter)
      doctors.forEach(() => bounds.extend(mapCenter))
      map.fitBounds(bounds)
    }
  }, [doctors, mapCenter])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex md:items-center md:justify-between"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Find a Doctor
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="mb-6">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Filter by Location
          </label>
          <input
            type="text"
            id="location"
            className="input-field mt-1"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or region"
          />
        </div>

        {isLoaded && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
              onLoad={onLoad}
            >
              {/* User's location marker */}
              <Marker
                position={userLocation}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
                title="Your Location"
              />

              {doctors?.map((doctor) => (
                <Marker
                  key={doctor.id}
                  position={mapCenter} // Replace with actual coordinates from doctor data
                  onClick={() => setSelectedDoctor(doctor)}
                />
              ))}

              {selectedDoctor && (
                <InfoWindow
                  position={mapCenter} // Replace with actual coordinates
                  onCloseClick={() => setSelectedDoctor(null)}
                >
                  <div>
                    <h3 className="font-medium">{selectedDoctor.name}</h3>
                    <p className="text-sm">{selectedDoctor.specialization}</p>
                    <p className="text-sm">{selectedDoctor.address}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors?.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="card hover:shadow-lg transition-shadow duration-200"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {doctor.location}
                  </p>
                  {doctor.contact_phone && (
                    <p className="text-gray-600 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {doctor.contact_phone}
                    </p>
                  )}
                  {doctor.contact_email && (
                    <p className="text-gray-600 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {doctor.contact_email}
                    </p>
                  )}
                  {doctor.address && (
                    <p className="text-gray-600 mt-2">{doctor.address}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}