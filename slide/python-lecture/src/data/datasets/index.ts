import type { Dataset } from '@/models/dataset.model'
import cafeSales from './cafeSales.dataset'
import cafeSalesRaw from './cafeSalesRaw.dataset'
import students from './students.dataset'

/** Written into the Python working directory, so lessons can `pd.read_csv("cafe_sales.csv")`. */
export const datasets: Dataset[] = [cafeSales, cafeSalesRaw, students]
