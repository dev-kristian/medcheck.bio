import Link from 'next/link';

const ForgotPasswordPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle password reset request
  };

  return (
    <>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Forgot Password 🔒</h2>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email and we'll send you instructions to reset your password
      </p>
      
      <form className="mt-8 space-y-6" >
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Send Reset Link
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <Link href="/sign-in" className="font-medium text-teal-600 hover:text-teal-500">
          ← Back to login
        </Link>
      </div>
    </>
  );
};

export default ForgotPasswordPage;