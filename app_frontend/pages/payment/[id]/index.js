import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'; 

export async function getServerSideProps(context) {
  const { id } = context.params;
  console.log('Payment ID:', id);
  const res = await fetch(`http://localhost:3342/api/payment/${id}/`);
  const payment = await res.json();
  const total_price = payment.total_price
  return {
    props: {
      total_price,
     
    },
  };
}

export default function Payment({total_price}) {
  const [selectedMethod, setSelectedMethod] = useState('promptpay');
  const [total_Price, setTotalPrice] = useState(total_price);
  const [productId, setProductId] = useState(null);
  const router = useRouter(); 

  const paymentMethods = [
    { id: 'visa', name: 'Visa', icon: '/img/visa.png' },
    { id: 'mastercard', name: 'Mastercard', icon: '/img/mastercard.png' },
    { id: 'mobile', name: 'Mobile Banking', icon: '/img/mobile.png' },
    { id: 'promptpay', name: 'PromptPay', icon: '/img/promptpay.png' },
  ];

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      setProductId(id);
    }
  }, [router.query]);
  const handleConfirm = () => {
    if (productId) {
      router.push(`/rating/${productId}`);
    } else {
      alert("ไม่พบ ID สำหรับส่งต่อไปยังหน้าคะแนน");
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-[1vw]">
      <h1 className="text-2xl font-bold mb-[5vh] mt-[5vh]" style={{ fontSize: '2vw' }}>ชำระเงิน</h1>

      <div className="flex flex-col md:flex-row gap-[1vw] w-full max-w-[66vw]">
        <div className="bg-white rounded-lg shadow-md p-[0.5vw]" style={{ width: '20vw', maxWidth: '20vw' }}>
          <h2 className="text-lg font-semibold text-white bg-blue-600 p-[0.8vw] rounded-t-lg" style={{ fontSize: '1.3vw', padding: '0.8vw' }}>เลือกวิธีการชำระเงิน</h2>
          <ul>
            {paymentMethods.map((method) => (
              <li
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center p-[0.8vw] cursor-pointer rounded-lg ${
                  selectedMethod === method.id ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                style={{ padding: '0.8vw', fontSize: '0.95vw', minHeight: '3.3vh', marginBottom: '0.3vh' }}
              >
                <Image src={method.icon} alt={method.name} width={2.5 * 16} height={2.5 * 16} className="mr-[0.5vw]" />
                <span className="flex-1">{method.name}</span>
                <span>{'>'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-[0.5vw] w-full md:flex-1 flex justify-center items-center" style={{ maxWidth: '53vw' }}>
          {selectedMethod === 'promptpay' && (
            <div className="flex flex-col items-center w-full">
              <div className="bg-blue-600 text-white p-[0.8vw] rounded-t-lg w-full text-center" style={{ padding: '0.8vw' }}>
                <h2 className="text-lg font-semibold" style={{ fontSize: '1.1vw' }}>พร้อมเพย์</h2>
              </div>
              <div className="border border-gray-300 rounded-b-lg w-full" style={{ borderWidth: '0.14vw' }}>
                <div className="flex justify-center p-[1.6vw]" style={{ padding: '1.6vw' }}>
                  <Image src="/img/qr_code.png" alt="QR Code" width={20 * 16} height={20 * 16} />
                </div>
                <div className="flex justify-between items-center p-[1.3vw]" style={{ padding: '1.3vw', marginTop: '0.5vw' }}>
                <p className="text-xl font-semibold" style={{ fontSize: '1.2vw' }}>
                  ยอดชำระ: {total_price ? `฿${total_price}` : 'กำลังโหลด...'}
                </p>
                  <button 
                  onClick={handleConfirm}
                    type="summit"
                    className="bg-blue-500 text-white px-[1.2vw] py-[0.6vh] rounded-lg" style={{ padding: '0.6vh 1.2vw', fontSize: '0.95vw', borderRadius: '1.3vw' }}>
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
