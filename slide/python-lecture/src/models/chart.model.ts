/** A chart drawn directly on the lesson page (no Python needed). Labels are translatable. */
export type ChartSpec =
  | {
      kind: 'bar'
      categories: string[]
      values: number[]
      yLabel?: string
      /** Show values as percentages (adds a % sign). */
      percent?: boolean
      /** Indexes of bars to draw in the highlight colour. */
      highlight?: number[]
      /** Start the y axis here instead of 0 (used to show a misleading chart). */
      yMin?: number
    }
  | {
      kind: 'groupedBar'
      categories: string[]
      series: { name: string; values: number[] }[]
      yLabel?: string
      percent?: boolean
    }
  | { kind: 'pie'; categories: string[]; values: number[] }
  /** Bars sorted from largest to smallest with a cumulative-percent line. */
  | { kind: 'pareto'; categories: string[]; values: number[] }
  | {
      kind: 'histogram'
      bounds: number[]
      /** Either raw data (counted into classes) or the class counts. */
      data?: number[]
      counts?: number[]
      xLabel?: string
      yLabel?: string
      percent?: boolean
      /** Show the raw values and an animated tally that builds the histogram. */
      animate?: boolean
    }
  | {
      kind: 'line'
      x: (number | string)[]
      series: { name: string; values: number[] }[]
      xLabel?: string
      yLabel?: string
      yMin?: number
      yMax?: number
      /** A dashed horizontal reference line, e.g. a target. */
      reference?: { value: number; label: string }
      /** Plot the points without joining them. */
      pointsOnly?: boolean
      percent?: boolean
    }
  | {
      kind: 'scatter'
      points: [number, number][]
      xLabel?: string
      yLabel?: string
      trend?: boolean
    }
  | {
      kind: 'dot'
      data: number[]
      xLabel?: string
      step?: number
      /** Values to draw in the highlight colour (e.g. an outlier). */
      highlight?: number[]
    }
  | {
      kind: 'stemLeaf'
      data: number[]
      leafUnit: number
      split?: boolean
      /** Second data set for a back-to-back display (shown on the left). */
      compare?: number[]
      labels?: string[]
    }
  /** Interactive: draw random samples from a population and compare percentages. */
  | {
      kind: 'sampling'
      populationSize: number
      /** How many population members have the trait (shown in the accent colour). */
      withTrait: number
      sampleSize: number
      traitLabel: string
      otherLabel: string
    }
  /** Several small charts side by side. */
  | { kind: 'gallery'; charts: { title: string; chart: ChartSpec }[] }
  /** Horizontal box-and-whisker displays (book method: quartiles, inner/outer fences). */
  | { kind: 'box'; groups: { name: string; data: number[] }[]; xLabel?: string }
  /** A normal (bell) curve with the empirical-rule bands. */
  | { kind: 'bell'; mean: number; sd: number; xLabel?: string; decimals?: number }
  /** Two-event Venn diagram with one region shaded. */
  | {
      kind: 'venn'
      a: string
      b: string
      shade: 'A' | 'B' | 'AandB' | 'AorB' | 'notA' | 'AnotB' | 'none'
      /** Counts in each region, shown inside it. */
      counts?: { aOnly: number; both: number; bOnly: number; neither: number }
      caption?: string
    }
  /** Two-stage probability tree; leaves show the joint probability. */
  | {
      kind: 'tree'
      branches: { label: string; p: number; children: { label: string; p: number }[] }[]
      /** Leaves to highlight, as "branchIndex-childIndex". */
      highlight?: string[]
      decimals?: number
    }
  /** A table-shaped sample space (e.g. two dice) with some cells highlighted. */
  | {
      kind: 'grid'
      rows: string[]
      columns: string[]
      cells: string[][]
      highlight: boolean[][]
      rowLabel?: string
      columnLabel?: string
    }
  /** A discrete probability distribution: bars at each x with P(X = x). */
  | {
      kind: 'pmf'
      x: number[]
      p: number[]
      xLabel?: string
      yLabel?: string
      /** x values whose bars are highlighted (e.g. the event X ≥ 3). */
      highlight?: number[]
      /** Draw the mean as a dashed line. */
      mean?: number
      meanLabel?: string
    }
  /** Interactive: repeat an experiment and watch the relative frequency settle. */
  | { kind: 'simulation'; experiment: 'coin' | 'die' | 'twoDice'; eventLabel: string }
  /** Interactive: sliders for a binomial or Poisson distribution. */
  | { kind: 'explorer'; distribution: 'binomial' | 'poisson'; n?: number; p?: number; mu?: number }
  /** Interactive: drag one value and watch the mean and median. */
  | { kind: 'meanMedian'; data: number[]; min: number; max: number; xLabel?: string }
