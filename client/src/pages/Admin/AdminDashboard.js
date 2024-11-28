import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { GoDuplicate } from "react-icons/go";
import { AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";

const AdminPage = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="grid grid-cols-4 gap-4 font-medium">
            <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
              <div className="flex justify-center mt-4">
                {" "}
                <AiOutlineProduct className="text-6xl" />{" "}
              </div>
              <div className="">Toplam Ürün Sayısı</div>
              <div className="mb-4">4</div>
            </div>
            <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
              <div className="flex justify-center mt-4">
                {" "}
                <GoDuplicate className="text-6xl" />{" "}
              </div>
              <div className="">Kategori Sayısı</div>
              <div className="mb-4">4</div>
            </div>
            <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
              <div className="flex justify-center mt-4">
                {" "}
                <AiFillProduct className="text-6xl" />{" "}
              </div>
              <div className="">Kategori Sayısı</div>
              <div className="mb-4">4</div>
            </div>
            <div className="flex flex-col justify-center text-center bg-gray-200 rounded h-max border-gray-500 border hover:bg-gray-100">
              <div className="flex justify-center mt-4">
                {" "}
                <FaRegUser className="text-6xl" />{" "}
              </div>
              <div className="">Üye Sayısı</div>
              <div className="mb-4">4</div>
            </div>
          </div>
        </div>
          <div className="col-span-4 bg-slate-200 p-10 h-max border border-slate-400 rounded">
            <div>
              <h2 className="font-bold mb-5">Duyurular</h2>
              <ul className="">
                <li className="p-4 bg-slate-50 border rounded border-black my-4">🎉 Yeni Ürün Yönetim Sistemi Güncellendi!</li>
                <li className="p-4 bg-slate-50 border rounded border-black my-4">🎉 Yeni Ürün Yönetim Sistemi Güncellendi!</li>
              </ul>
            </div>
          </div>
      </div>
    </>
  );
};

export default AdminPage;
