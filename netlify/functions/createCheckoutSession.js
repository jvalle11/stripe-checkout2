const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  const { items } = JSON.parse(event.body); // Get items (lineItems) from the request body

  try {
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price: item.price, // Stripe price ID
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}/cancel`,
    });

    // Return the response with CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allows requests from any origin
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: session.id }), // Return sessionId
    };
  } catch (err) {
    // Handle errors and return error response with CORS headers
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allows requests from any origin
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
