export interface IPaginagion {
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    resultCount: number
}