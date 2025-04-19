const ResponseForm = ({formPath = ""}) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.open(formPath, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <button
        onClick={handleClick}
        className="text-2xl font-semibold bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go to the Form
      </button>
    </div>
  );
};

export default ResponseForm;