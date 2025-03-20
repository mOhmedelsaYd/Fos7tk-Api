const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const apiError = require('../utils/apiError');
const Booking = require('../Model/Booking');
const Plan = require('../Model/Plan');
const Event = require('../Model/Event');



exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
    const { bookingType, referenceId } = req.params; 

    if (!req.user) {
        return next(new apiError("Unauthorized. User not found.", 401));
    }

    const userId = req.user._id;
    const userName = req.user.firstName + " " + req.user.lastName;

    if (!['Plan', 'Event'].includes(bookingType)) {
        return next(new apiError("Invalid booking type. Must be 'Plan' or 'Event'.", 400));
    }

    const item = bookingType === 'Plan' ? await Plan.findById(referenceId) : await Event.findById(referenceId);

    if (!item) {
        return next(new apiError(`${bookingType} not found with the provided ID.`, 404));
    }

    const price = item.price * 100;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: { 
                        name: item.name || item.title, 
                        description: `${item.description || item.details} (Booked by ${userName})` // Add user name to description
                    },
                    unit_amount: price,
                },
                quantity: 1,
            },
        ],
        success_url: `${req.protocol}://${req.get("host")}/api/bookings`,
        cancel_url: `${req.protocol}://${req.get("host")}/api/plans`,
        metadata: { userId: userId.toString(), userName, bookingType, referenceId }, // Include userName in metadata
    });

    res.status(201).json({
        success: true,
        message: "Stripe checkout session created successfully.",
        checkoutUrl: session.url
    });
});



const confirmBooking = async (session) => {
    try {
        const { userId, userName, bookingType, referenceId } = session.metadata;

        // ✅ Create a new booking and set its status to "confirmed"
        const booking = await Booking.create({
            user: userId,
            userName,
            bookingType,
            referenceId,
            status: "confirmed",
            paymentStatus: "paid",
            paymentId: session.payment_intent, // Store Stripe Payment Intent ID
            amountPaid: session.amount_total / 100, // Convert from cents to dollars
        });

        console.log(`✅ New booking created with ID: ${booking._id}`);
    } catch (error) {
        console.error("❌ Error creating booking:", error);
    }
};


exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;


    try {
        // ✅ Verify Stripe Webhook
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle Checkout Session Completion
    if (event.type === "checkout.session.completed") {
        confirmBooking(event.data.object);
    }

    res.status(200).json({ received: true });
});

