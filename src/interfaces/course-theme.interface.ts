export interface IGetCourseThemeInput {
    id?: number;
    course_id?: number;
}

export interface ICourseTheme {
    id: number;
    course_id: number;
    title: string;
    description: string;
}