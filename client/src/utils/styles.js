// Shared layout strings used across the admin/faculty/student portals.

// Scrollable table/data region. Wraps content and scrolls horizontally on
// small screens instead of breaking the page layout.
export const adminData =
  "flex flex-col w-full max-w-full overflow-x-auto overflow-y-auto max-h-[70vh] rounded-xl border border-slate-200 bg-white shadow-sm";

export const adminDataBody =
  "grid grid-cols-12 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-0";

export const adminDataHeading = "font-semibold py-3 px-4 text-slate-600 bg-slate-50 border-b border-slate-200 text-sm tracking-wide";
export const adminDataBodyFields = "py-3 px-4 text-slate-700 text-sm flex items-center";

export const adminFormSubmitButton =
  "inline-flex items-center justify-center bg-indigo-600 px-5 py-2.5 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-sm";
export const adminFormClearButton =
  "inline-flex items-center justify-center bg-white border border-slate-300 px-5 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-200 whitespace-nowrap shadow-sm";
export const adminFormButton =
  "self-center flex flex-wrap justify-center gap-3 pt-4";

export const adminForm0 = "flex flex-col mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm";
export const adminForm1 =
  "flex flex-col px-4 py-8 space-y-8 sm:px-6 lg:ml-10 lg:flex-row lg:space-x-12 lg:space-y-0 lg:py-10";
export const adminForm2l = "flex flex-col space-y-6 lg:space-y-8 flex-1";
export const adminForm2r = "flex flex-col space-y-6 lg:space-y-8 flex-1";
export const adminForm3 =
  "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 items-start";

export const adminLabel =
  "font-medium text-sm text-slate-700 mb-1.5 justify-self-start block";
export const adminInput = "border border-slate-300 rounded-lg px-3 py-2 text-sm w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white";
export const loadingAndError = "flex flex-col items-center mt-6 px-4 text-slate-500";

// Filter panel used on search/delete pages.
export const filterPanel =
  "bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5 mb-6";
export const filterField = "flex flex-col gap-1.5";
export const filterLabel = "text-sm font-medium text-slate-700";