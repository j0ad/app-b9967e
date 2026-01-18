
import React from 'react';

interface MobileMockupProps {
  url: string;
  primaryColor: string;
}

const MobileMockup: React.FC<MobileMockupProps> = ({ url, primaryColor }) => {
  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 left-1/2 -translate-x-1/2 rounded-b-[1rem] absolute"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white flex flex-col">
        <div className="h-6 bg-gray-100 flex items-center justify-between px-6 py-4">
          <span className="text-[10px] font-bold">9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {url ? (
            <iframe src={url} className="w-full h-full border-none" title="App Preview" />
          ) : (
            <div className="w-full h-full flex flex-center items-center justify-center p-8 text-center text-gray-400">
               <p>أدخل رابط موقعك للمعاينة الحية</p>
            </div>
          )}
        </div>
        <div className="h-12 border-t flex items-center justify-around bg-white">
           <div className="w-6 h-6 rounded-full bg-gray-200"></div>
           <div className="w-6 h-6 rounded-full bg-gray-200" style={{ backgroundColor: primaryColor }}></div>
           <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileMockup;
