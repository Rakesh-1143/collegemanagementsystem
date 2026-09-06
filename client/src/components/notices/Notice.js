import React from "react";

const Notice = ({ idx, notice, notFor }) => {
  return (
    notFor !== notice.noticeFor && (
      <div className="flex shadow-md py-2 px-2 rounded-lg bg-slate-50 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer h-10 overflow-hidden">
        ⚫
        <h1 className="font-bold ml-3 truncate min-w-0 flex-[2]">
          {notice.topic}
        </h1>
        <p className="truncate min-w-0 flex-[3] text-slate-500">
          {notice.content}
        </p>
      </div>
    )
  );
};

export default Notice;
