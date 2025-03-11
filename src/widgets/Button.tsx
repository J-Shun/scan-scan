const Button = ({
  children,
  onClick,
  variant = 'solid',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'solid' | 'outline';
}) => {
  const baseClass =
    'font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer focus:ring-1 focus:outline-none';

  const solidClass =
    'text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800';

  const outlineClass =
    'text-blue-700 border border-blue-700 hover:text-blue-800 hover:border-blue-800 dark:text-blue-700 dark:border-blue-700 dark:hover:text-blue-800 dark:hover:border-blue-800 dark:focus:ring-blue-800';

  return (
    <button
      className={`${baseClass} ${
        variant === 'outline' ? outlineClass : solidClass
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
