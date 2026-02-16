# SafeguardAI Pricing Model

## Overview

SafeguardAI offers a flexible pricing model to accommodate different usage levels and needs.

## Pricing Tiers

### 🆓 Free Tier (Open Source)
**Price**: $0/month

**Includes**:
- PII Detection (unlimited)
- Custom Rules Engine (unlimited)
- Bring Your Own API Key (BYOK) for OpenAI, Perspective, Azure
- Community support via GitHub issues
- Basic documentation

**Best for**: 
- Individual developers
- Small projects
- Open-source projects
- Learning and experimentation

---

### 🚀 Pro Tier (Managed Service)
**Price**: $29/month

**Includes**:
- Everything in Free tier
- **10,000 API calls/month** included (using our managed API keys)
- Multi-provider fallback
- Priority support (email)
- Advanced analytics dashboard
- Rate limiting and caching
- 99.9% uptime SLA

**Overage**: $0.005 per additional API call

**Best for**:
- Growing startups
- Production applications
- Teams building AI products

---

### 💼 Business Tier
**Price**: $199/month

**Includes**:
- Everything in Pro tier
- **100,000 API calls/month** included
- Custom compliance rules (HIPAA, PCI-DSS, SOC2)
- Advanced image moderation
- Batch processing (up to 1000 items)
- Priority email & chat support
- Custom integrations
- White-label options

**Overage**: $0.003 per additional API call

**Best for**:
- Established businesses
- Healthcare/Financial apps
- High-volume applications
- Compliance-critical industries

---

### 🏢 Enterprise Tier
**Price**: Custom

**Includes**:
- Everything in Business tier
- **Unlimited API calls**
- Dedicated infrastructure
- Custom AI model training
- On-premise deployment option
- SLA with guaranteed uptime
- 24/7 phone support
- Custom compliance audits
- Dedicated account manager

**Best for**:
- Large enterprises
- Mission-critical applications
- Custom compliance requirements
- High security needs

---

## Add-ons

### Image Moderation
- Free tier: BYOK only
- Pro: $0.01 per image
- Business: $0.005 per image
- Enterprise: Included

### Advanced Analytics Dashboard
- Free: Not available
- Pro: Included
- Business: Advanced features
- Enterprise: Custom dashboards

### Custom Model Training
- Enterprise only: Custom pricing

---

## API Call Pricing Breakdown

| Tier | Included Calls | Cost per Additional Call | Estimated Savings vs BYOK |
|------|----------------|-------------------------|---------------------------|
| Free | 0 | N/A (BYOK) | N/A |
| Pro | 10,000 | $0.005 | ~40% |
| Business | 100,000 | $0.003 | ~50% |
| Enterprise | Unlimited | Included | ~60% |

---

## Comparison with BYOK (Bring Your Own Key)

### OpenAI Moderation API
- **Direct cost**: ~$0.002 per request
- **SafeguardAI adds**: PII detection, custom rules, caching, fallback

### Your Savings with SafeguardAI Pro
- Direct OpenAI: $0.002/call × 10,000 = **$20** + manual PII implementation
- SafeguardAI Pro: **$29** with PII, rules, caching, support
- **Value**: $20+ in savings on implementation + ongoing maintenance

---

## Why Pay for SafeguardAI?

### 1. **Convenience**
- No need to manage multiple API keys
- Automatic fallback between providers
- Built-in caching reduces costs

### 2. **Comprehensive Safety**
- AI moderation + PII detection + custom rules
- All-in-one solution vs. building from scratch

### 3. **Support & Reliability**
- Priority support
- SLA guarantees
- Regular updates and improvements

### 4. **Cost Savings**
- Volume discounts
- Caching reduces duplicate calls
- Multi-provider reduces failures

---

## Getting Started

### For Open Source (Free)
```bash
npm install safeguard-ai
```

Use with your own API keys.

### For Managed Service (Pro/Business)
1. Sign up at safeguard-ai.dev
2. Get your SafeguardAI API key
3. Use without managing individual provider keys

### For Enterprise
Contact sales@safeguard-ai.dev

---

## Frequently Asked Questions

**Q: Can I switch between tiers?**  
A: Yes, upgrade or downgrade anytime. Prorated billing applies.

**Q: What happens if I exceed my monthly limit?**  
A: Overage charges apply automatically. Set spending limits in dashboard.

**Q: Do you offer discounts for startups/nonprofits?**  
A: Yes! Contact us for special pricing.

**Q: Can I use the free tier in production?**  
A: Yes, with BYOK you can use it anywhere. Managed service recommended for reliability.

**Q: Is there a trial period?**  
A: Pro and Business tiers include 14-day free trial.

---

## Notes for Package Developers

Since SafeguardAI is an **open-source npm package**, the free tier (BYOK) will always be available. The managed service tiers are **optional** for users who want:
- Convenience (no API key management)
- Better pricing at scale
- Support and SLAs
- Advanced features

This model is similar to:
- **Stripe** (free SDK, paid processing)
- **Auth0** (free SDK, paid auth service)
- **Sentry** (free SDK, paid error tracking)
