import { useEffect, useState, useRef } from 'react';
import jsQR from 'jsqr';
import Button from './widgets/Button';
import Modal from './widgets/Moda';

function App() {
  const [isShowCamera, setIsShowCamera] = useState(false);
  const [isShowInvoiceModal, setIsShowInvoiceModal] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [randomCode, setRandomCode] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleCameraOpen = async () => {
    setIsShowCamera(true);
    const deviceStream = await navigator.mediaDevices.getUserMedia({
      // 指定使用畫面，並且用後置鏡頭
      video: {
        facingMode: 'environment',
      },
      audio: false,
    });
    streamRef.current = deviceStream;
    if (videoRef.current) {
      videoRef.current.srcObject = deviceStream;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    intervalRef.current = setInterval(() => {
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const { location } = code;
        if (!location) return;

        // 畫出 QRCode 的邊框
        ctx.strokeStyle = '#FAAD14';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
        ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
        ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
        ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
        ctx.closePath();
        ctx.stroke();

        const { data } = code;
        // 電子發票格式：2 個大寫英文字母 + 8 個數字
        const invoiceRegex = /^[A-Z]{2}\d{8}.*$/;
        const isInvoice = invoiceRegex.test(data);
        if (!isInvoice) return;

        const rawInvoiceNumber = data.substring(0, 10);
        const rawInvoiceDate = data.substring(10, 17);
        const rawRandomCode = data.substring(17, 21);

        const year = rawInvoiceDate.substring(0, 3);
        const month = rawInvoiceDate.substring(3, 5);
        const day = rawInvoiceDate.substring(5, 7);

        setInvoiceNumber(rawInvoiceNumber);
        setInvoiceDate(`${year}/${month}/${day}`);
        setRandomCode(rawRandomCode);
        setIsShowInvoiceModal(true);

        // 清除資料、暫停相機
        clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
    }, 100);
  };

  const handleCameraClose = () => {
    setIsShowCamera(false);
    if (intervalRef.current) {
      // 關掉 interval 並清除 ref
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      // 把串流暫停，並清除 ref
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // 卸載元件
  useEffect(() => {
    return () => {
      handleCameraClose();
    };
  }, []);

  return (
    <>
      <div className='w-full min-h-screen flex flex-col justify-center items-center'>
        <h1 className='text-4xl mb-8'>Scan Scan</h1>

        <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }}>
          <track kind='captions' />
        </video>
        <canvas
          ref={canvasRef}
          style={{ display: `${isShowCamera ? 'block' : 'none'}` }}
        />

        <Button onClick={handleCameraOpen} variant='solid'>
          開始掃描
        </Button>
        <Button onClick={handleCameraClose} variant='outline'>
          關閉相機
        </Button>
      </div>

      <Modal
        isShow={isShowInvoiceModal}
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        randomCode={randomCode}
        onCancel={() => setIsShowInvoiceModal(false)}
        onConfirm={() => setIsShowInvoiceModal(false)}
      />
    </>
  );
}

export default App;
