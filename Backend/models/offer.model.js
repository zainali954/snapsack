import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    category: { type: String, required: true },
    tagline: [
        {
            text: { type: String, required: true },
            color: { type: String, required: true },
        },
    ],
    title: { type: String, required: true },
    titleColor: { type: String, required: true },
    color: {
        from: { type: String, required: true },
        to: { type: String, required: true },
        border: { type: String, required: true },
    },
    image: { type: String, required: true },
    link: { type: String, required: true },
    colSpan: { type: String, required: true },
    textAlign: { type: String, required: true },
    flexDirection: { type: String, required: true },
    imageStyle: { type: String },
});

const OffersModel = mongoose.model("Offer", OfferSchema);
export default OffersModel;