import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comment, setComment] = useState('');
  useEffect(() => {
    fetch('http://localhost:3342/api/product/')
      .then(res => res.json())
      .then(data => setProducts(data));
      window.logout = () => {
        localStorage.clear(); 
        window.location.href = '/login'; 
      };
  }, []);

  const filteredData = products.filter(emp =>
    emp.product_name && emp.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleReviewSubmit = async () => {
    const token = localStorage.getItem('token'); 
    const user_id = localStorage.getItem('user_id');
    console.log("token: ",token);
    console.log("Comment:", comment);
    console.log("User id:", user_id);
    try {
      const response = await fetch('http://localhost:3342/api/reviewshop/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: parseInt(user_id), 
          comment: comment
        })
      });
    
      const data = await response.json();
      if (response.ok) {
        alert("Review submitted successfully!");
        setComment('');
      } else {
        console.error("Submit failed:", data);
        alert("Failed to submit review: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  return (
    <>
      <Head>
        <title>ThaiService - Premium Experience</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
      </Head>

      <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 shadow-xl sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    <Link href="/" className="text-3xl font-extrabold text-white tracking-tight">
      ThaiService
    </Link>
    <ul className="flex space-x-8">
      {['Homepage', 'Review', 'Log out'].map((item, idx) => (
        <li key={idx} className="group">
          {item === 'Log out' ? (
            <button
              onClick={() => {
                localStorage.clear();  
                window.location.href = '/login'; 
              }}
              className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 ease-in-out group-hover:scale-105"
            >
              {item}
            </button>
          ) : (
            <Link
              href={`/${item.toLowerCase()}`}
              className="text-white text-lg font-medium hover:text-yellow-300 transition duration-300 ease-in-out group-hover:scale-105"
            >
              {item}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
</nav>


      <main className="container mx-auto mt-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500 ease-in-out">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-6">Premium services starting at just 1,000 THB</p>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              placeholder="Write your review"
            />
            <button 
              onClick={handleReviewSubmit}
              className="w-full bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center">
              <i className="bi bi-envelope mr-2"></i> Submit Review
            </button>
            <ul className="mt-6 text-gray-600 space-y-3">
              <li>Address: Rangsit</li>
              <li>Hours: 20:00-04:00</li>
              <li>Line: @ThaiService</li>
              <li>Phone: 099-999-9999</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">Exceeding Expectations, Winning Hearts</h2>
            <div className="carousel slide" data-bs-ride="carousel" id="carouselExample">
              <div className="carousel-inner rounded-3xl overflow-hidden">
                {[1, 2, 3].map((num, idx) => (
                  <div key={num} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                    <Image
                      src={`/img/Banner${num}.png`}
                      width={800}
                      height={200}
                      className="w-full object-cover transform hover:scale-105 transition duration-500"
                      alt={`Banner${num}`}
                    />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span className="carousel-control-prev-icon bg-gray-800 rounded-full p-4"></span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span className="carousel-control-next-icon bg-gray-800 rounded-full p-4"></span>
              </button>
            </div>
          </div>
        </div>
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Top Employees</h1>
          <div className="container mx-auto px-4 flex justify-between gap-8 flex-wrap">
            {products.filter(p => p.top).map(product => (
              <Link key={product.id} href={`/details/${product.id}`}>
                <Image
                  src={`http://localhost:3342${product.image}`}
                  width={140}
                  height={140}
                  className="rounded-2xl object-cover transform hover:scale-105 transition duration-500 ease-in-out cursor-pointer flex-shrink-0"
                  alt={product.product_name}
                />
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="carousel slide" data-bs-ride="carousel" id="MainBanner">
            <div className="carousel-inner rounded-3xl overflow-hidden">
              {[1, 2, 3].map((num, idx) => (
                <div key={num} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                  <Image
                    src={`/img/main${num}.png`}
                    width={1200}
                    height={200}
                    className="w-full object-cover transform hover:scale-105 transition duration-500"
                    alt={`Main${num}`}
                  />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#MainBanner" data-bs-slide="prev">
              <span className="carousel-control-prev-icon bg-gray-800 rounded-full p-4"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#MainBanner" data-bs-slide="next">
              <span className="carousel-control-next-icon bg-gray-800 rounded-full p-4"></span>
            </button>
          </div>
        </section>

        <section>
          <div className="flex justify-center mb-8">
            <input
              type="search"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xl p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            />
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-purple-100 text-gray-800">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Review</th>
                  <th className="p-4 font-semibold">Price/Hr</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(product => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <td className="p-4">
                      <Link href={`/details/${product.id}`}>
                        <Image
                          src={`http://127.0.0.1:3342${product.image}`}
                          width={50}
                          height={50}
                          className="rounded-full object-cover transform hover:scale-110 transition duration-300"
                          alt={product.product_name}
                        />
                      </Link>
                    </td>
                    <td className="p-4">{product.product_name}</td>
                    <td className="p-4">{product.status ? "Available" : "Unavailable"}</td>
                    <td className="p-4">
                       {Number(product.point) > 0 ? parseFloat(product.point).toString().replace(/\.0+$/, "") : "No reviews"}
                    </td>
                    <td className="p-4">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style jsx global>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
          margin: 0;
          padding: 0;
        }

        .carousel-inner {
          border-radius: 1.5rem;
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-color: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          padding: 1.5rem;
          transition: background-color 0.3s ease;
        }

        .carousel-control-prev-icon:hover,
        .carousel-control-next-icon:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }

        table {
          min-width: 800px;
        }

        th, td {
          font-size: 0.95rem;
          vertical-align: middle;
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
          .grid-cols-1 {
            grid-template-columns: 1fr;
          }

          .carousel-inner {
            border-radius: 1rem;
          }

          h1, h2 {
            font-size: 1.75rem;
          }

          table {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  );
}