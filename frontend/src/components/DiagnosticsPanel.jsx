import React, { useState, useContext } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { AppContext } from '../context/AppContext';

const DiagnosticsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();
  
  const { 
    API_BASE, 
    token, 
    currentUser, 
    portal, 
    setPortal, 
    logout,
    syncError,
    syncClerkUser 
  } = useContext(AppContext);

  const [lastTokenText, setLastTokenText] = useState('');
  const [isFetchingToken, setIsFetchingToken] = useState(false);

  const handleFetchToken = async () => {
    setIsFetchingToken(true);
    try {
      const t = await getToken();
      setLastTokenText(t ? `${t.substring(0, 15)}... (${t.length} chars)` : 'None returned');
    } catch (err) {
      setLastTokenText(`Error: ${err.message}`);
    } finally {
      setIsFetchingToken(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-surface-50/90 border border-surface-100 hover:border-primary/50 text-white rounded-full shadow-glow text-xs font-bold transition-all duration-300 backdrop-blur-md active:scale-95"
      >
        <span>🛠️</span>
        {isOpen ? 'Close Diagnostics' : 'Auth Diagnostics'}
        {isSignedIn && <span className="w-2 h-2 rounded-full bg-success animate-ping" />}
      </button>

      {/* Main Panel */}
      {isOpen && (
        <div className="mt-3 w-80 bg-surface-50/95 border border-surface-100/70 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl animate-scale-up text-white overflow-hidden relative">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-sm font-extrabold mb-4 flex items-center justify-between border-b border-surface-100 pb-2">
            <span>⚙️ Diagnostics Control</span>
            <span className="text-[10px] uppercase font-bold text-accent">Dev Mode</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Clerk State */}
            <div>
              <p className="text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-1">Clerk SDK</p>
              <div className="grid grid-cols-2 gap-2 bg-surface/50 border border-surface-100 p-2 rounded-xl">
                <div>
                  <span className="text-[10px] text-surface-400">Loaded:</span>
                  <span className={`ml-1 font-bold ${isLoaded ? 'text-success' : 'text-danger'}`}>{isLoaded ? 'YES' : 'NO'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-surface-400">Signed In:</span>
                  <span className={`ml-1 font-bold ${isSignedIn ? 'text-success' : 'text-danger'}`}>{isSignedIn ? 'YES' : 'NO'}</span>
                </div>
              </div>
            </div>

            {/* Clerk User details */}
            {isSignedIn && clerkUser && (
              <div className="bg-surface/50 border border-surface-100 p-2.5 rounded-xl space-y-1">
                <p className="text-[10px] text-surface-400 font-semibold truncate">
                  <span className="text-white">Email:</span> {clerkUser.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-[10px] text-surface-400 font-semibold truncate">
                  <span className="text-white">Clerk ID:</span> {clerkUser.id}
                </p>
              </div>
            )}

            {/* Backend Sync State */}
            <div>
              <p className="text-[10px] font-bold text-surface-300 uppercase tracking-wider mb-1">Backend Connection</p>
              <div className="bg-surface/50 border border-surface-100 p-2.5 rounded-xl space-y-1.5">
                <p className="text-[10px] text-surface-400 font-semibold truncate">
                  <span className="text-white">API URL:</span> {API_BASE}
                </p>
                <p className="text-[10px] text-surface-400 font-semibold">
                  <span className="text-white">Backend Auth:</span>{' '}
                  {currentUser ? (
                    <span className="text-success font-bold">Linked ({currentUser.role})</span>
                  ) : (
                    <span className="text-warning font-semibold">Not Linked</span>
                  )}
                </p>
                {currentUser && (
                  <p className="text-[10px] text-surface-400 font-semibold truncate">
                    <span className="text-white">Local Role:</span> <span className="font-bold text-accent">{currentUser.role}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Errors */}
            {syncError && (
              <div className="p-2.5 bg-danger/10 border border-danger/20 rounded-xl text-[10px] font-semibold text-danger">
                ⚠️ Sync Error: {syncError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-surface-100 space-y-2">
              {isSignedIn && !currentUser && (
                <button
                  onClick={() => {
                    if (syncClerkUser) syncClerkUser();
                  }}
                  className="w-full py-2 bg-primary hover:bg-primary-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all"
                >
                  🔄 Force Sync Session
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleFetchToken}
                  disabled={isFetchingToken}
                  className="flex-1 py-1.5 bg-surface-100 hover:bg-surface-200 text-white border border-surface-100 rounded-lg text-[9px] font-bold uppercase transition-all"
                >
                  {isFetchingToken ? 'Fetching...' : '🎫 Test Token'}
                </button>

                {(isSignedIn || currentUser) && (
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="flex-1 py-1.5 bg-danger/10 border border-danger/20 hover:bg-danger/20 text-danger rounded-lg text-[9px] font-bold uppercase transition-all"
                  >
                    🚪 Clean SignOut
                  </button>
                )}
              </div>

              {lastTokenText && (
                <p className="text-[9px] text-surface-400 break-all bg-surface/80 p-1.5 rounded-lg border border-surface-100 font-mono">
                  Token: {lastTokenText}
                </p>
              )}
            </div>

            {/* Developer Port Quick Jumps */}
            {currentUser && (
              <div className="pt-1.5 border-t border-surface-100">
                <p className="text-[9px] font-bold text-surface-300 uppercase tracking-wider mb-1">Jump to View</p>
                <div className="grid grid-cols-3 gap-1">
                  {['admin', 'teacher', 'student'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setPortal(r)}
                      className={`py-1 rounded text-[9px] font-semibold transition-all ${
                        portal === r ? 'bg-accent text-surface font-extrabold shadow-sm' : 'bg-surface hover:text-white text-surface-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsPanel;
