import { useI18n } from "@/app/providers/i18n";
import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ page, total, limit, totalPages, onPageChange, onSizeChange }) => {
    const i18n = useI18n();
    return (
        <div className="flex flex-wrap justify-between mb-4 gap-x-4 work-font">
            <div className="flex items-center mb-6 md:mb-0">
                {onSizeChange && (
                    <div className="flex items-center text-sm text-dark_text work-font">
                       {i18n?.t("Show")}
                        <select
                            value={limit}
                            onChange={(e) => onSizeChange(+e.target.value)}
                            className="h-8 pl-3 pr-6 rounded-md mx-2 text-center work-font focus:outline-none border border-secondary bg-white"
                        >
                            <option className="work-font"  value={10}>{i18n?.t("10")}</option>
                            <option className="work-font" value={25}>{i18n?.t("25")}</option>
                            <option className="work-font" value={50}>{i18n?.t("50")}</option>
                            <option className="work-font" value={100}>{i18n?.t("100")}</option>
                        </select>
                    </div>
                )}
                <p className="text-sm text-dark_text">
                  {i18n?.t("Showing")} {((page - 1) * limit) + 1 || 0} 
                    &nbsp; {i18n?.t("to")}{Math.min(total || 0, page * limit) || 0} 
                    &nbsp; {i18n?.t("of")} {total || 0} {i18n?.t("entries")}
                </p>
            </div>

            <ReactPaginate
                breakLabel="..."
                previousLabel={i18n?.t("Previous")}
                nextLabel={i18n?.t("Next")}
                disabledLinkClassName="text-gray-300 work-font"
                previousLinkClassName="text-sm bg-white work-font border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all ease-in font-semibold py-2 px-4 rounded-l"
                nextLinkClassName="text-sm bg-white border work-font border-secondary text-secondary hover:bg-secondary hover:text-white transition-all ease-in font-semibold py-2 px-4 rounded-r"
                pageLinkClassName="text-sm bg-white border work-font border-secondary text-secondary hover:bg-secondary hover:text-white transition-all ease-in font-semibold py-2 px-4 rounded"
                pageClassName="!mb-0 md:!mb-0 work-font"
                activeLinkClassName="text-white !bg-secondary work-font"
                className="flex flex-wrap items-center gap-2 justify-center work-font"
                onPageChange={({ selected }) => onPageChange(selected + 1)}
                pageRangeDisplayed={3}
                pageCount={totalPages || 1}
                renderOnZeroPageCount={null}
            />
        </div>
    );
}

export default Pagination;

