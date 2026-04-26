import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaBath,
  FaTv,
  FaSnowflake,
  FaMobile,
  FaEnvelope,
} from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toCurrency from "../utils/toCurrency";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";

const ViewHouseDetails = () => {
  const { id } = useParams();
  // const stripe = useStripe();
  // const elements = useElements();

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const navigate = useNavigate();
  const [details, setDetails] = useState();
  const [propertyFiles, setPropertyFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [clientData, setclientData] = useState({
    property_id: id,
    tenant_id: loggedUser?.id,
    manager_id: "",
    fullname: loggedUser?.firstname + " " + loggedUser?.lastname,
    contact_number: loggedUser?.contact_number,
    email: loggedUser?.email,
    movein_date: "",
    total_occupants: "",
    amount_paid: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:3000/api/property/${id}`);
      setDetails(res.data[0]);
      setPropertyFiles(JSON.parse(res.data[0].files));
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setclientData({ ...clientData, [e.target.name]: e.target.value });
  };

  console.log(clientData);

  const insertReservation = async () => {
    await axios.post(
      "http://localhost:3000/api/reservation/create_reservation",
      {
        ...clientData,
        amount_paid: details?.monthly_price,
        manager_id: details?.manager_id,
      },
    );
  };

  // const payInStripe = async (e) => {
  //   e.preventDefault();

  //   setLoading(true);
  //   const { data } = await axios.post(
  //     "http://localhost:3000/create-payment-intent",
  //     { amount: details?.monthly_price * 100 }, // Stripe expects amount in cents
  //   );

  //   const result = await stripe.confirmCardPayment(data.clientSecret, {
  //     payment_method: {
  //       card: elements.getElement(CardElement),
  //     },
  //   });

  //   if (result.paymentIntent?.status === "succeeded") {
  //     await insertReservation();

  //     setTimeout(() => {
  //       toast.success("Payment successful!");
  //       navigate("/user/dashboard");
  //     }, 3000);
  //   }
  // };
  console.log(details);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          {details?.property_title}
        </h1>

        {/* IMAGE GALLERY */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <img
            src={`http://localhost:3000/${propertyFiles[0]}`}
            className="w-full h-[420px] object-cover rounded-xl"
          />

          <div className="grid grid-cols-2 gap-3">
            {/* {propertyFiles.map((img, i) => ( */}
            {propertyFiles.slice(1, 5).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:3000/${img}`}
                className="h-48 w-full object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-6">
            {/* DESCRIPTION */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {details?.description}
              </h2>
              <p className="text-gray-500">
                8 guests · 3 bedrooms · 4 beds · 3 baths
              </p>
            </div>

            {/* PERKS */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                What this place offers
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <FaWifi />, label: "WiFi" },
                  { icon: <FaTv />, label: "TV" },
                  { icon: <FaSnowflake />, label: "Aircon" },
                  { icon: <FaCar />, label: "Parking" },
                  { icon: <FaSwimmingPool />, label: "Pool" },
                  { icon: <FaBath />, label: "Bathroom" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-indigo-500 text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OWNER */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-4">Hosted by</h3>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-300" />

                <div>
                  <div className="font-medium">
                    {details?.owner_firstname} {details?.owner_lastname}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaMobile /> {details?.owner_mobile}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaEnvelope /> {details?.owner_email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaLocationPin /> {details?.owner_address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (BOOKING CARD) */}
          <div>
            <form
              onSubmit={payInStripe}
              className="bg-white p-6 rounded-xl shadow-lg border flex flex-col gap-9"
            >
              <div className="text-2xl font-semibold">
                {toCurrency(details?.monthly_price)}
                <span className="text-sm text-gray-500"> / month</span>
              </div>
              <div>
                <label className="font-medium">Select Move-in Date</label>
                <input
                  type="date"
                  name="movein_date"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <input
                type="number"
                name="total_occupants"
                placeholder="Number of occupants"
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

              <div className="p-3 border rounded-lg">
                <CardElement />
              </div>

              <button
                disabled={!stripe}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewHouseDetails;
