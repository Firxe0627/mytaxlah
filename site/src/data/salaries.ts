/** Monthly salaries that get their own SEO page: RM1,500 – RM30,000 in RM500 steps. */
export const SALARY_STEPS: number[] = Array.from({ length: (30_000 - 1_500) / 500 + 1 }, (_, i) => 1_500 + i * 500);
