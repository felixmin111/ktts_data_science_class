export interface Dataset {
  /** File name inside the in-browser Python working directory, e.g. "cafe_sales.csv". */
  filename: string
  description: string
  content: string
}
