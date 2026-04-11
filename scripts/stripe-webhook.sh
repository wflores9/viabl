#!/bin/bash
# Run this to forward Stripe webhooks to localhost during testing
# Requires: stripe CLI installed (https://stripe.com/docs/stripe-cli)
stripe listen --forward-to localhost:3000/api/webhook/stripe
