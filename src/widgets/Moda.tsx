import Button from './Button';

const Modal = ({
  invoiceNumber = '',
  invoiceDate = '',
  randomCode = '',
  onCancel = () => {},
  onConfirm = () => {},
  isShow = false,
}: {
  invoiceNumber: string;
  invoiceDate: string;
  randomCode: string;
  onCancel: () => void;
  onConfirm: () => void;
  isShow: boolean;
}) => {
  return (
    isShow && (
      <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
        <div className='bg-white p-4 rounded-lg w-68 text-center'>
          <div className='text-lg font-bold mb-4'>掃描完成</div>
          <div className='text-left text-sm mb-6 text-gray-500'>
            <div className='flex justify-between py-2'>
              <span>發票號碼</span>
              <span>{invoiceNumber}</span>
            </div>
            <div className='flex justify-between py-2'>
              <span>發票日期</span>
              <span>{invoiceDate}</span>
            </div>
            <div className='flex justify-between py-2'>
              <span>隨機碼</span>
              <span>{randomCode}</span>
            </div>
          </div>
          <div className='flex justify-center gap-4'>
            <Button onClick={onCancel} variant='outline'>
              取消
            </Button>
            <Button onClick={onConfirm} variant='solid'>
              登錄
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
