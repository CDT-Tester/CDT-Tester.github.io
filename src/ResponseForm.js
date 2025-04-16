const ResponseForm = () => {

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <button
        onClick={() => window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSflftxFb-9O_o-RuG2xYJiOtSUjfAClv5cB0-j3qBfBNkfyfg/viewform?usp=dialog"}
        className="text-2xl font-semibold bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go to the Form
      </button>
    </div>
  );
};

export default ResponseForm;