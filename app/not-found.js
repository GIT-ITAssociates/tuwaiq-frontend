"use client";
import Link from "next/link";
import React from "react";
import { GiClawHammer } from "react-icons/gi";

const NotFound = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <div className=" w-full space-y-8 text-center">
        <div className="flex justify-center">
          <GiClawHammer className="h-24 w-24 text-primary" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">404 - Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-600">
          We're sorry, but the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2  transition duration-150 ease-in-out"
          >
            Return to Homepage
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-base text-gray-500">
            If you believe this is an error, please contact our{" "}
            <Link href="/contact" className="text-primary hover:text-primary underline">
              support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFound;
