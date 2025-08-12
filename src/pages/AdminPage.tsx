import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useReservations } from '../hooks/useReservations';
import { format, parseISO } from 'date-fns';
import { Check, X, CalendarX, CalendarCheck, User, FileText } from 'lucide-react';
import Button from '../components/Button';

const AdminPage: React.FC = () => {
  const { reservations, loading, error } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'room船橋｜管理画面';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const toggleReservationDetails = (id: string) => {
    setSelectedReservation(selectedReservation === id ? null : id);
  };

  const updateReservationStatus = async (id: string, status: 'reserved' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-xl md:text-2xl font-bold text-sky-800 mb-6 text-center">Admin Login</h1>
          
          {authError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
              <p className="text-sm md:text-base leading-relaxed">{authError}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm md:text-base"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              showArrow={false}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-sky-800 mb-2">Reservation Management</h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
          View and manage all bookings for Room Funabashi
        </p>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">Loading reservations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-lg">
            <p className="text-sm md:text-base leading-relaxed">{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CalendarX size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-base md:text-xl font-semibold text-gray-800 mb-2">No Reservations Found</h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              There are no bookings in the system yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleReservationDetails(reservation.id)}
                >
                  <div>
                    <div className="flex items-center mb-2">
                      <span 
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          reservation.status === 'reserved' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}
                      />
                      <h3 className="text-base md:text-lg font-semibold text-gray-800">
                        {reservation.guest_name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {format(parseISO(reservation.reservation_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {reservation.status === 'reserved' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateReservationStatus(reservation.id, 'cancelled');
                        }}
                        className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition duration-200"
                        aria-label="Cancel reservation"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <span className="text-gray-400">
                      {selectedReservation === reservation.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                
                {selectedReservation === reservation.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User size={18} className="text-sky-600 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700 text-sm md:text-base">Guest Information</p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{reservation.guest_name}</p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">{reservation.guest_email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <CalendarCheck size={18} className="text-sky-600 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700 text-sm md:text-base">Booking Details</p>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                              {reservation.num_guests} {reservation.num_guests === 1 ? 'guest' : 'guests'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {reservation.notes && (
                          <div className="flex items-start">
                            <FileText size={18} className="text-sky-600 mt-1 mr-2 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-700 text-sm md:text-base">Special Requests</p>
                              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{reservation.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Created: {format(parseISO(reservation.created_at), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ 
                          color: 
                          reservation.status === 'reserved' 
                            ? '#059669' 
                            : '#DC2626'
                        }}>
                          Status: {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;