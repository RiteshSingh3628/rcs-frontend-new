# Stripe Integration Setup

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration
VITE_BASE_URL=http://localhost:8000
```

## Backend API Endpoints

Your backend needs to implement these endpoints:

### 1. Create Checkout Session
```
POST /api/payment/create-checkout-session/
Body: { "plan": "plan_id" }
Response: { "sessionId": "cs_..." }
```

### 2. Upgrade Plan (Fallback)
```
POST /api/payment/upgrade/
Body: { "plan": "plan_id" }
Response: { "clientSecret": "pi_..._secret_..." }
```

## How It Works

1. **Primary Flow**: When a user selects a plan, the app tries to create a Stripe Checkout Session and redirects to Stripe's hosted payment page.

2. **Fallback Flow**: If the Checkout Session creation fails, it falls back to the embedded payment form using the client secret.

3. **Success/Cancel Handling**: After payment completion, Stripe redirects back to your app with success/cancel parameters.

## Stripe Configuration

Make sure your Stripe account is configured with:
- Webhook endpoints for payment confirmation
- Success and cancel URLs pointing to your app
- Proper product and price configurations for your plans

## Testing

Use Stripe's test cards:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date
- **CVC**: Any 3 digits
