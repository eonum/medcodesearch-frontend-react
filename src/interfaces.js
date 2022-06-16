export interface IShortEntry {
    code: string,
    text: string,
    url: string,
    terminal?: true
}

export interface ICode {
    code: string,
    med_interpret: string,
    tech_interpret: string,
    tp_al: number,
    tp_tl: number,
    groups: IShortEntry[],
    blocks: IShortEntry[],
    exclusions: string[],
    inclusions: string[],
    notes: string[],
    coding_hint: string,
    synonyms: string[],
    most_relevant_drgs: string[],
    analogous_code_text: string,
    descriptions: string[],
    successors: IShortEntry[][],
    predecessors: IShortEntry[][],
    supplement_codes: string[],
    usage: string,
    text: string,
    children: IShortEntry[][],
    parent: IShortEntry[][],
    parents: IShortEntry[][],
    siblings: IShortEntry[][],
    terminal: boolean
}
