export interface IShortEntry {
    code: string,
    text: string,
    url: string,
    terminal?: boolean
}

export interface IAttributes {
    code: string,
    text: string,
    parent: IShortEntry,
    children: IShortEntry[],
    med_interpret?: string,
    tech_interpret?: string,
    tp_al?: number,
    tp_tl?: number,
    groups?: IShortEntry[],
    blocks?: IShortEntry[],
    exclusions?: string[],
    inclusions?: string[],
    notes?: string[],
    hints?: string[],
    coding_hint?: string,
    synonyms?: string[],
    most_relevant_drgs?: string[],
    analogous_code_text?: string,
    descriptions?: string[],
    successors?: IShortEntry[],
    predecessors?: IShortEntry[],
    supplement_codes?: string[],
    usage?: string,
    limitation?: string,
    unit?: string,
    hvb_self?: number,
    hvb_care?: number,
    it_number?: string
    substance_name?: string,
    field_of_app?: string,
    atc_code?: string,
    auth_state?: string,
    remedy_code?: string,
    dispens_cat?: string,
    pack_size?: string,
    pack_unit?: string,
    gln?: string,
    tp?: number,
    comment?: string,
    cumulation?: string,
    faculty?: string,
    active_substances?: string[],
    terminal?: boolean,
    auth_number?: string,
    package_code?: string,
    updated_at?: string
}

export interface IDrgAttributes {
    code: string,
    text: string,
    parent: IShortEntry,
    children: IShortEntry[],
    version: string,
    cost_weight: number,
    partition_letter: string,
    average_stay_duration: number,
    first_day_discount: number,
    discount_per_day: number,
    first_day_surcharge: number,
    surcharge_per_day: number,
    exception_from_reuptake: number,
    transfer_discount: number,
    relevant_codes: string,
}

export interface IRcgAttributes {
    code: string,
    text: string,
    parent: IShortEntry,
    children: IShortEntry[],
    version: string,
    phases: IPhase[],
}

interface IPhase {
    cost_weight: number,
    limit: number
}

export interface ICode {
    attributes: IAttributes
    parents: IShortEntry[],
    siblings: IShortEntry[]
}

export interface IVersions {
    [index: string]: string[];
}

export interface ILabelHash {
    [index: string]: string;
}

export interface IParamTypes {
    language: string,
    catalog: string,
    resource_type: string,
    code: string,
    version?: string
}

export interface INavigationHook {
    (input: {
        pathname?: string,
        search?: string
    }): void
};

export interface ILocation {
    pathname?: string,
    search?: string,
}

export interface INoArgsFunction {
    (): void
}

export interface IUpdateStateByArg {
    (arg0: string): void
}

export interface IUpdateButton {
    (version?: string, catalog?: string, isCalendar?: boolean, date?: string):
        void
}
