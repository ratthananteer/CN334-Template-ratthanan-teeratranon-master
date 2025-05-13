import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export async function getServerSideProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:3342/api/product/${id}/`);
  const product = await res.json();
  const productName = product.product_name;
  const pricePerHour = product.price;
  const productId = product.id;
  const detail = product.product_details?.[0] || null;
  return {
    props: {
      productId,
      pricePerHour,
      product,
      detail,
      productName,
    },
  };
}
export default function DetailsPage({ product, pricePerHour , detail , productId}) {
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState("สถานที่จัดเตรียมไว้");
  const [totalPrice, setTotalPrice] = useState(0); 0
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
    let price = duration * pricePerHour;
    if (location === "บ้านคุณ(+1000฿)") {
      price += 1000;
    }
    setTotalPrice(price);
  }, [duration, location, pricePerHour]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userid: userId,
      Product_id: productId,
      total_price: totalPrice
    };
    
    
    console.log(product.id);
    console.log("orderData:", orderData);
   
    try {
      const res = await fetch('http://localhost:3342/api/payment/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_access')}`,
         },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorText = await res.text(); // ดึงข้อความจาก response
        console.error("Error from API:", errorText);
        throw new Error("ส่งข้อมูลล้มเหลว");
      }
      const payment = await res.json();
      window.location.href = `/payment/${payment.id}`;
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  return (
    <>
      <Head>
        <title>ThaiService - Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
      </Head>

      <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-white tracking-tight">ThaiService</Link>
          <ul className="flex space-x-8">
            {['Homepage', 'Review', 'Log out'].map((item, idx) => (
              <li key={idx} className="group">
                <Link
                  href={item === 'Log out' ? '/login' : `/${item.toLowerCase()}`}
                  className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 ease-in-out group-hover:scale-105"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto mt-10 px-4">
        <section className="min-h-screen flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 transform hover:shadow-xl transition duration-500 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={product.image} alt={product.product_name} className="w-full h-full object-cover transform hover:scale-105 transition duration-500 ease-in-out"
                />
              </div>
              <div className="flex flex-col justify-between">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{product.product_name}</h1>

                <div className="space-y-4 text-gray-700">
                  <div>
                    <label className="font-semibold">Personality:</label>
                    <p className="text-gray-600">{detail?.habit || "ไม่มีข้อมูล"}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Likes:</label>
                    <p className="text-gray-600">{detail?.like || "ไม่มีข้อมูล"}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Skills:</label>
                    <p className="text-gray-600">{detail?.ability || "ไม่มีข้อมูล"}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Location:</label>
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="w-5 h-5 accent-purple-500"
                          name="location"
                          value="สถานที่จัดเตรียมไว้"
                          checked={location === "สถานที่จัดเตรียมไว้"}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                        Provided Venue
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="w-5 h-5 accent-purple-500"
                          name="location"
                          value="บ้านคุณ(+1000฿)"
                          checked={location === "บ้านคุณ(+1000฿)"}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                        Your Place (+1000฿)
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold">Duration:</label>
                    <select
                      name="duration"
                      required
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    >
                      <option value="">-- Select Duration --</option>
                      {[...Array(8)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Hour{i + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="font-semibold">Total Price:</label>
                  <span className="text-lg font-bold text-purple-600"> {totalPrice} ฿</span>
                </div>

                <div className="mt-8 flex justify-between gap-4">
                  <Link href="/homepage">
                    <button
                      type="button"
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </Link>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </main>

      <style jsx global>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
          margin: 0;
          padding: 0;
        }

        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 5px;
        }

        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          h1 {
            font-size: 1.75rem;
          }

          .grid-cols-1 {
            grid-template-columns: 1fr;
          }

          button {
            width: 100%;
            font-size: 0.9rem;
          }

          select, input {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}