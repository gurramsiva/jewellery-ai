export type ResponseType = {
  status?: string | number;
  data?: any;
  error?: any;
  total?: number;
  skip?: number;
  limit?: number;
};

export type SearchByLimitType = {
  limit: number;
  skip: number;
  query?: Record<string, any>;
  orderBy?: string;
  order?: "ASC" | "DESC";
  searchTerm?: string;
};
