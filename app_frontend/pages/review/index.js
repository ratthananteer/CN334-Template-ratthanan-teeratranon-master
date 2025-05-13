import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3342/api/review/')
      .then(res => res.json())
      .then(data => setReviews(data));
    window.logout = function () {
      alert('Logged out!');
    };
  }, []);

  return (
    <>
      <Head>
        <title>ThaiService - Reviews</title>
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
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 tracking-tight">Customer Reviews</h1>
          <div className="bg-white p-8 rounded-3xl shadow-2xl overflow-x-auto transform hover:shadow-xl transition duration-500 ease-in-out">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-100 text-gray-800">
                  <th className="p-4 font-semibold text-center rounded-t-2xl">Comment</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition duration-300 ease-in-out"
                    >
                      <td className="p-4 text-left">{review.comment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center text-gray-500">No reviews available.</td>
                  </tr>
                )}
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

        table {
          min-width: 600px;
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
          h1 {
            font-size: 1.75rem;
          }

          table {
            min-width: 100%;
          }

          th, td {
            font-size: 0.85rem;
            padding: 0.75rem;
          }

          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </>
  );
}