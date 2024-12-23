import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Camera } from 'lucide-react';
import './App.css';
import { Typography } from '@mui/material';

function App() {
  const [eventCode, setEventCode] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [savedEventCode, setSavedEventCode] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const code = localStorage.getItem('eventCode');
    if (code) {
      setSavedEventCode(code);
    }
  }, []);

  const handleJoinEvent = (e) => {
    e.preventDefault();
    if (eventCode.trim()) {
      console.log('Joining event:', eventCode);
      navigate(`/event/${eventCode}`); // Navigate to the event page
    }
  };

  const handleCreateEvent = async () => {
    if (!newEventName.trim()) return;

    try {
      const response = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newEventName }),
      });

      const data = await response.json();
      localStorage.setItem('eventCode', data.event.code);
      setSavedEventCode(data.event.code);
      setIsCreateModalOpen(false);
      setNewEventName('');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const dismissSavedCode = () => {
    localStorage.removeItem('eventCode');
    setSavedEventCode(null);
  };

  return (
    <div className="app-background">
      <div className="container">
        <div className="form-card">
          {/* Header */}
          <div className="header">
            <div className="icon-wrapper">
              <Camera className="icon" />
            </div>
            <Typography
  variant="h1"
  gutterBottom
  sx={{
    fontFamily: "'Dancing Script', cursive", // Elegant cursive font
    fontWeight: 700, // Bold weight for emphasis
    fontSize: "3rem", // Increase font size for better visibility
    color: "#8e44ad", // Choose a visually appealing color
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Add a subtle shadow for depth
    marginTop: "20px",
  }}
>
  CapTog
</Typography>

            <p>"Capture Together with CapTog"</p><p> Share photos in real-time with your event guests</p>
          </div>

          {/* Saved Event Code Alert */}
          {savedEventCode && (
            <div className="alert">
              <button onClick={dismissSavedCode} className="alert-close">
                ×
              </button>
              <p>
                Your event code: <span className="code">{savedEventCode}</span>
              </p>
            </div>
          )}

          {/* Join Form */}
          <form onSubmit={handleJoinEvent} className="form">
            <label htmlFor="eventCode">Event Code</label>
            <input
              type="text"
              id="eventCode"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              placeholder="Enter your event code"
            />
            <button type="submit" className="btn-primary">
              Join Event
            </button>
          </form>

          {/* Create Event Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-secondary"
          >
            <PlusCircle className="btn-icon" />
            Create New Event
          </button>
        </div>
      </div>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Event</h2>
            <input
              type="text"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder="Enter event name"
            />
            <div className="modal-actions">
              <button onClick={() => setIsCreateModalOpen(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleCreateEvent} className="btn-primary">
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
