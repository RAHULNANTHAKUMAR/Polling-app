export interface IPoll {
    name: string,
    questions: {
        question: string,
        options: {
            option: string,
            vote_count: number,
            voters: string[]
        }[]
    }[],
}