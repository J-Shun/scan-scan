import { useEffect, useState, useRef } from 'react';
import jsQR from 'jsqr';
import Button from './widgets/Button';

function App() {
  const [isShowCamera, setIsShowCamera] = useState(false);
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

    // 初始化 canvas，並設定 willReadFrequently
    // 因為會不斷讀取畫面，willReadFrequently 可以幫助提升效能
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    // 使用 interval 持續性處理資料，以 0.1 秒為單位
    // 有測試過 1 或 0.5，但發現太頻繁頁面會爆
    intervalRef.current = setInterval(() => {
      // 設定 canvas 和 video 同大小，並將 video 拿到的畫面丟上去
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
      }

      // 將 canvas 畫面轉為圖片，並提供給 jsQR 做解析
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const { location } = code;

        // 如果沒有取得 QRCode 的位置資訊，就不繼續執行
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

        // ...some code，針對解析出來的資料做處理

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

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ display: `${isShowCamera ? 'block' : 'none'}` }}
        >
          <track kind='captions' />
        </video>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <Button onClick={handleCameraOpen}>開始掃描</Button>
        <Button onClick={handleCameraClose}>關閉相機</Button>
      </div>
    </>
  );
}

export default App;
