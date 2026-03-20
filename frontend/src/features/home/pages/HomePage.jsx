import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { charitiesService } from '../../charities/charitiesService';
import { formatCurrency } from '../../../utils/formatters';

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center', padding: '24px' }}>
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '36px',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginBottom: '8px',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
      {label}
    </div>
  </div>
);

const HowItWorksStep = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="card"
    style={{ textAlign: 'center' }}
  >
    <div
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '52px',
        fontWeight: 800,
        color: 'rgba(110,231,183,0.12)',
        lineHeight: 1,
        marginBottom: '16px',
      }}
    >
      {number}
    </div>
    <h3
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '18px',
        color: 'var(--color-text-primary)',
        marginBottom: '12px',
      }}
    >
      {title}
    </h3>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
      {description}
    </p>
  </motion.div>
);

const HomePage = () => {
  const { data: featuredData } = useQuery({
    queryKey: ['charities', 'featured'],
    queryFn: charitiesService.getFeaturedCharity,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(110,231,183,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(245,158,11,0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <div className="page-container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '700px' }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(110,231,183,0.1)',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: '20px',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid rgba(110,231,183,0.2)',
              }}
            >
              Golf — Prizes — Charity
            </motion.div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(40px, 7vw, 72px)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.05,
                marginBottom: '24px',
              }}
            >
              Play Golf.{' '}
              <span style={{ color: 'var(--color-primary)' }}>Win Prizes.</span>
              <br />
              Support Charity.
            </h1>

            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '40px',
                maxWidth: '520px',
              }}
            >
              Enter your Stableford scores each month and you are automatically
              entered into a prize draw. Every subscription supports a charity
              you choose.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/subscribe">
                <button
                  className="btn-primary"
                  style={{ padding: '16px 36px', fontSize: '16px' }}
                >
                  Join and Start Winning
                </button>
              </Link>
              <Link to="/how-it-works">
                <button
                  className="btn-secondary"
                  style={{ padding: '16px 36px', fontSize: '16px' }}
                >
                  How It Works
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <div className="page-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            }}
          >
            <StatItem value="100+" label="Active Members" />
            <StatItem value={formatCurrency(2400)} label="Charity Raised" />
            <StatItem value={formatCurrency(960)} label="Current Jackpot" />
            <StatItem value="3" label="Prize Tiers" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              How It Works
            </h2>
            <p className="section-subtitle">
              Three simple steps to play, win, and give back.
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            <HowItWorksStep
              number="01"
              title="Subscribe"
              description="Choose monthly or yearly. A portion of every payment goes directly to your chosen charity."
              delay={0}
            />
            <HowItWorksStep
              number="02"
              title="Enter Your Scores"
              description="Log your last 5 Stableford golf scores. These become your draw entries each month."
              delay={0.1}
            />
            <HowItWorksStep
              number="03"
              title="Win and Give"
              description="Match 3, 4, or all 5 drawn numbers with your scores to win from the monthly prize pool."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURED CHARITY ── */}
      {featuredData && (
        <section
          style={{
            padding: '80px 0',
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="page-container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}
                >
                  Featured Charity
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '32px',
                    color: 'var(--color-text-primary)',
                    marginBottom: '16px',
                  }}
                >
                  {featuredData.name}
                </h2>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    marginBottom: '24px',
                  }}
                >
                  {featuredData.description}
                </p>
                <div style={{ marginBottom: '28px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Total raised by our members:{' '}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      fontSize: '18px',
                    }}
                  >
                    {formatCurrency(featuredData.total_raised)}
                  </span>
                </div>
                <Link to={`/subscribe?charity=${featuredData.id}`}>
                  <button className="btn-primary" style={{ padding: '12px 28px' }}>
                    Support This Charity
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {featuredData.cover_image_url ? (
                  <img
                    src={featuredData.cover_image_url}
                    alt={featuredData.name}
                    style={{
                      width: '100%',
                      borderRadius: 'var(--radius-card)',
                      objectFit: 'cover',
                      height: '320px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '320px',
                      borderRadius: 'var(--radius-card)',
                      backgroundColor: 'var(--color-elevated)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '48px',
                        fontWeight: 800,
                        color: 'rgba(110,231,183,0.15)',
                      }}
                    >
                      {featuredData.name.charAt(0)}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              Simple Pricing
            </h2>
            <p className="section-subtitle">
              One plan. Full access. Cancel anytime.
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            {/* Monthly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="card"
            >
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Monthly
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {formatCurrency(9.99)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
                per month
              </div>
              <Link to="/subscribe">
                <button className="btn-secondary" style={{ width: '100%' }}>
                  Get Started
                </button>
              </Link>
            </motion.div>

            {/* Yearly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-card)',
                border: '2px solid var(--color-primary)',
                backgroundColor: 'rgba(110,231,183,0.03)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-bg)',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 14px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                Best Value — Save 17%
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Yearly
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                {formatCurrency(99.99)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
                per year — GBP 8.33/month
              </div>
              <Link to="/subscribe?plan=yearly">
                <button className="btn-primary" style={{ width: '100%' }}>
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section
        style={{
          padding: '80px 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
              }}
            >
              Ready to play with purpose?
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '16px',
                marginBottom: '36px',
                maxWidth: '480px',
                margin: '0 auto 36px',
              }}
            >
              Join golfers who are turning their game into real charitable impact every month.
            </p>
            <Link to="/subscribe">
              <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                Join Golf Charity Club
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;