import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Subscribe',
    description:
      'Choose a monthly or yearly plan. A portion of your subscription goes directly to your chosen charity.',
  },
  {
    number: '02',
    title: 'Enter Your Scores',
    description:
      'Log your latest Stableford scores — up to 5 at a time. Your scores are your draw entries.',
  },
  {
    number: '03',
    title: 'Win and Give',
    description:
      'Every month, 5 numbers are drawn. Match 3, 4, or all 5 of your scores to win a prize.',
  },
];

const prizeRows = [
  { match: '5 Numbers', share: '40%', rollover: 'Yes — jackpot rolls over', color: 'var(--color-accent)' },
  { match: '4 Numbers', share: '35%', rollover: 'No', color: 'var(--color-primary)' },
  { match: '3 Numbers', share: '25%', rollover: 'No', color: 'var(--color-text-secondary)' },
];

const faqs = [
  {
    q: 'How is the draw different from a lottery?',
    a: 'Your golf scores are your numbers. You enter scores you have actually played, not random picks. The draw is run against those real scores.',
  },
  {
    q: 'What is Stableford scoring?',
    a: 'Stableford is a popular golf scoring system where you earn points based on your score at each hole. Valid entries are between 1 and 45 points.',
  },
  {
    q: 'When does the draw happen?',
    a: 'Draws run once per month. Results are published on the first of each month and all subscribers are notified by email.',
  },
  {
    q: 'What happens if nobody wins the jackpot?',
    a: 'If no subscriber matches all 5 drawn numbers, the jackpot rolls over to the next month and grows until someone wins.',
  },
  {
    q: 'How do I claim my prize?',
    a: 'Winners receive an email with instructions. You upload a screenshot of your golf scores from your tracking app. Once verified by our team, payment is sent within 5 business days.',
  },
  {
    q: 'Can I change my charity?',
    a: 'Yes. You can change your chosen charity at any time from your dashboard. Changes apply to future payments.',
  },
];

const HowItWorksPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="page-container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 className="section-title" style={{ marginBottom: '16px' }}>
              How It Works
            </h1>
            <p className="section-subtitle" style={{ maxWidth: '560px', margin: '0 auto' }}>
              Golf Charity Club combines your love of golf with monthly prize draws and genuine
              charitable giving.
            </p>
          </div>

          {/* Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginBottom: '80px',
            }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card"
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '48px',
                    fontWeight: 800,
                    color: 'rgba(110,231,183,0.15)',
                    lineHeight: 1,
                    marginBottom: '16px',
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: 'var(--color-text-primary)',
                    marginBottom: '12px',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Prize pool table */}
          <div style={{ marginBottom: '80px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '26px',
                color: 'var(--color-text-primary)',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Prize Pool Distribution
            </h2>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              {prizeRows.map((row) => (
                <div
                  key={row.match}
                  className="card"
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: row.color, fontSize: '16px' }}>
                    {row.match}
                  </div>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '22px',
                        fontWeight: 700,
                        color: row.color,
                      }}
                    >
                      {row.share}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Rollover: {row.rollover}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: '680px', margin: '0 auto', marginBottom: '64px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '26px',
                color: 'var(--color-text-primary)',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Frequently Asked Questions
            </h2>
            <FaqList faqs={faqs} />
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/subscribe">
              <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                Join and Start Playing
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FaqList = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {faqs.map((faq, i) => (
        <div
          key={i}
          style={{
            borderBottom: '1px solid var(--color-border)',
            padding: '20px 0',
          }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontSize: '15px',
                fontFamily: 'var(--font-body)',
              }}
            >
              {faq.q}
            </span>
            <span
              style={{
                color: 'var(--color-primary)',
                fontSize: '20px',
                flexShrink: 0,
                transition: 'transform 0.2s',
                transform: openIndex === i ? 'rotate(45deg)' : 'none',
              }}
            >
              +
            </span>
          </button>
          {openIndex === i && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ paddingTop: '12px' }}
            >
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

// Add missing import
import { useState } from 'react';

export default HowItWorksPage;