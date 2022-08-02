export type Preview = 'day' | 'week' | 'month' | 'year';  

export interface Stream {
    startAt: number;
    preview: Preview;
}