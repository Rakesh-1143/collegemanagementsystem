// Shared layout strings used across the admin/faculty/student portals.

// Scrollable table/data region. Wraps content and scrolls horizontally on
// small screens instead of breaking the page layout.
export const adminData =
  "flex flex-col w-full max-w-full overflow-x-auto overflow-y-auto max-h-[70vh] rounded-md border border-slate-100";

export const adminDataBody =
  "grid grid-cols-12 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-0";

export const adminDataHeading = "font-bold py-2 px-2 text-slate-600";
export const adminDataBodyFields = "py-2 px-2 text-slate-700";

export const adminFormSubmitButton =
  "inline-flex items-center justify-center bg-violet-600 w-28 h-9 rounded-lg text-white hover:bg-violet-700 transition-colors duration-200 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed";
export const adminFormClearButton =
  "inline-flex items-center justify-center bg-slate-200 w-28 h-9 rounded-lg text-slate-700 hover:bg-slate-300 transition-colors duration-200 whitespace-nowrap";
export const adminFormButton =
  "self-center flex flex-wrap justify-center gap-3 space-x-0 space-y-0";

export const adminForm0 = "flex flex-col mb-6";
export const adminForm1 =
  "flex flex-col px-4 py-8 space-y-8 sm:px-6 lg:ml-10 lg:flex-row lg:space-x-28 lg:space-y-0 lg:py-10";
export const adminForm2l = "flex flex-col space-y-8 lg:space-y-10";
export const adminForm2r = "flex flex-col space-y-8 pr-0 sm:pr-6 lg:space-y-10";
export const adminForm3 =
  "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 items-center";

export const adminLabel =
  "font-bold text-base sm:text-lg bg-slate-700 text-white px-3 py-1.5 rounded-lg justify-self-start";
export const adminInput = "border-2 px-3 py-2 text-sm w-full min-w-0";
export const loadingAndError = "flex flex-col items-center mt-6 px-4";

// Filter panel used on search/delete pages.
export const filterPanel =
  "bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm space-y-4";
export const filterField = "flex flex-col gap-1.5";
export const filterLabel = "text-sm font-semibold text-slate-600";