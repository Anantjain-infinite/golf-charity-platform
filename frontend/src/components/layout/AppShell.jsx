import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useUiStore } from '../../store/uiStore';

const AppShell = () => {
  const { sidebarOpen, closeSidebar, toggleSidebar } = useUiStore();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                zIndex: 40,
              }}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.2 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 50,
              }}
            >
              <Sidebar onClose={closeSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div
          className="mobile-topbar"
          style={{
            display: 'none',
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              fontSize: '16px',
            }}
          >
            Golf Charity Club
          </span>
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '18px',
            }}
          >
            Menu
          </button>
        </div>

        <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AppShell;