const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
