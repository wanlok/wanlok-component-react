export interface Dataset {
    title: string;
    series: { name?: string; colour: string; data: number[] }[];
    x: string[];
    compareEnabled: boolean;
}
