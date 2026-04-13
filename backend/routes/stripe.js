const router = require("express").Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET);

router.post("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE,
        quantity: 1
      }
    ],
    success_url: "https://yourapp.com/dashboard",
    cancel_url: "https://yourapp.com/billing"
  });

  res.json({ url: session.url });
});

module.exports = router;
