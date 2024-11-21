import React from "react";
import { AiFillProduct } from "react-icons/ai";

const AdminPage = () => {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 font-medium">
        <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
          <div className="flex justify-center mt-4"> <AiFillProduct className="text-6xl" /> </div>
          <div className="">Ürün Sayısı</div>
          <div className="mb-4">4</div>
        </div>
        <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
          <div className="flex justify-center mt-4"> <AiFillProduct className="text-6xl" /> </div>
          <div className="">Ürün Sayısı</div>
          <div className="mb-4">4</div>
        </div>
        <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
          <div className="flex justify-center mt-4"> <AiFillProduct className="text-6xl" /> </div>
          <div className="">Ürün Sayısı</div>
          <div className="mb-4">4</div>
        </div>
        <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
          <div className="flex justify-center mt-4"> <AiFillProduct className="text-6xl" /> </div>
          <div className="">Ürün Sayısı</div>
          <div className="mb-4">4</div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
