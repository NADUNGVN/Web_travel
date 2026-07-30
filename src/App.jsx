import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StaysSpace } from './components/StaysSpace';
import { MapView } from './components/MapView';
import { FoodSpace } from './components/FoodSpace';
import { CompareDrawer } from './components/CompareDrawer';
import { ResultsSpace } from './components/ResultsSpace';
import { VillaDetailModal } from './components/VillaDetailModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { mockVillas } from './data/mockVillas';
import { getCurrentUser, isSupabaseConnected, supabase } from './lib/supabase';

// Get unique device fingerprint ID for vote anti-spam
export const getDeviceId = () => {
  let id = localStorage.getItem('trip_device_id');
  if (!id) {
    id = 'device_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem('trip_device_id', id);
  }
  return id;
};

export function App() {
  const [activeTab, setActiveTab] = useState('stays');
  const [currentUser, setCurrentUser] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [comparedVillas, setComparedVillas] = useState([]);
  const [selectedDetailVilla, setSelectedDetailVilla] = useState(null);
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);

  // Initialize User, Device ID & Votes
  useEffect(() => {
    getDeviceId(); // Ensure device ID exists

    const initUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    initUser();

    // Listen for Auth changes in Supabase
    if (isSupabaseConnected && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
            isSupabase: true
          });
        }
      });
      return () => subscription.unsubscribe();
    }

    // Load initial local votes
    const savedVotes = localStorage.getItem('trip_user_votes');
    if (savedVotes) {
      try {
        setUserVotes(JSON.parse(savedVotes));
      } catch (err) {
        console.error('Error loading saved votes', err);
      }
    }

    // BroadcastChannel for instant multi-tab / same-origin realtime sync
    let bc;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('trip_votes_channel');
        bc.onmessage = (event) => {
          if (event.data && event.data.type === 'VOTE_UPDATED') {
            setUserVotes(event.data.votes);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error', e);
    }

    return () => {
      if (bc) bc.close();
    };
  }, []);

  // Handle Voting (3-state: 'yes' (+2), 'maybe' (+1), 'no' (-2))
  const handleVote = (candidateId, voteType) => {
    setUserVotes((prev) => {
      const updated = { ...prev };
      if (updated[candidateId] === voteType) {
        delete updated[candidateId];
      } else {
        updated[candidateId] = voteType;
      }
      
      localStorage.setItem('trip_user_votes', JSON.stringify(updated));

      // Broadcast to other tabs/windows instantly
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('trip_votes_channel');
          bc.postMessage({ type: 'VOTE_UPDATED', votes: updated });
          bc.close();
        }
      } catch (e) {
        console.warn('Broadcast post error', e);
      }

      return updated;
    });
  };

  // Toggle Villa for Comparison
  const handleToggleCompare = (villa) => {
    setComparedVillas((prev) => {
      const exists = prev.some(c => c.id === villa.id);
      if (exists) {
        return prev.filter(c => c.id !== villa.id);
      }
      if (prev.length >= 3) {
        alert('Bạn chỉ có thể chọn tối đa 3 Villa để so sánh cùng lúc.');
        return prev;
      }
      return [...prev, villa];
    });
  };

  const handleRemoveCompare = (villaId) => {
    setComparedVillas((prev) => prev.filter(c => c.id !== villaId));
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onOpenSupabaseConfig={() => setShowSupabaseConfig(true)}
      />

      {/* Main Spaces */}
      <main style={{ paddingBottom: '20px' }}>
        {activeTab === 'stays' && (
          <StaysSpace
            villas={mockVillas}
            userVotes={userVotes}
            onVote={handleVote}
            comparedVillas={comparedVillas}
            onToggleCompare={handleToggleCompare}
            onOpenDetail={setSelectedDetailVilla}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            villas={mockVillas}
            userVotes={userVotes}
            onVote={handleVote}
            onOpenDetail={setSelectedDetailVilla}
            onToggleCompare={handleToggleCompare}
            comparedVillas={comparedVillas}
          />
        )}

        {activeTab === 'food' && (
          <FoodSpace
            userVotes={userVotes}
            onVote={handleVote}
          />
        )}

        {activeTab === 'compare' && (
          <CompareDrawer
            comparedVillas={comparedVillas}
            onRemoveCompare={handleRemoveCompare}
            onClose={() => setActiveTab('stays')}
            onVote={handleVote}
            userVotes={userVotes}
          />
        )}

        {activeTab === 'results' && (
          <ResultsSpace
            villas={mockVillas}
            userVotes={userVotes}
            onOpenDetail={setSelectedDetailVilla}
          />
        )}
      </main>

      {/* iPhone Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedVillas.length}
      />

      {/* Modals */}
      {selectedDetailVilla && (
        <VillaDetailModal
          villa={selectedDetailVilla}
          onClose={() => setSelectedDetailVilla(null)}
          userVote={userVotes[selectedDetailVilla.id]}
          onVote={handleVote}
          currentUser={currentUser}
        />
      )}

      {showSupabaseConfig && (
        <SupabaseConfigModal
          onClose={() => setShowSupabaseConfig(false)}
        />
      )}
    </div>
  );
};
