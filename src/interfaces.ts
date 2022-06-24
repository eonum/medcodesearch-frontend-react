
export interface IShortEntry {
    code: string,
    text: string,
    url: string,
    terminal?: boolean
}

interface IAttributes {
    code?: string,
    text?: string,
    parent?: IShortEntry,
    children?: IShortEntry[],
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
    terminal?: boolean
}

export interface ICode {
    attributes: IAttributes
    parents: IShortEntry[],
    siblings: IShortEntry[],
}

// TODO: Better interface name, no any.
export interface IApp {
    language: string,
    selectedButton: string,
    selectedList: string,
    selectedDate: string,
    searchResults: string[],
    clickedOnLogo: boolean,
    reSetPath: boolean,
    collapseMenu: boolean,
    initialVersions: IVersions,
    currentVersions: IVersions
}

// Declare types of key value pairs for versions interface.
export interface IVersions {
    [index: string]: string[];
}

export interface IButtonGroup {
    selectedButton: string,
    activeList: string,
    lastICD: string,
    lastDRG: string,
    lastCHOP: string,
    lastTARMED: string,
    selectedDate: string,
    showHideCal: false,
    buttons: IButtonLabels,
}

export interface IButtonLabels {
    [index: number]: string[];
}

export interface IButtonVersion {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCategory: string,
}

export interface IButtonWithCal {
    disabledCategory: string,
    showPopUp: boolean
}

export interface IMobileButton {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCategory: string,
    allVersions: any,
    currentVersions: any,
    buttons: string[],
    selectedButton: string
}

export interface IHeader {
    languagePrev: string,
    language: string
}

export interface IDatePicker {
    currentDate: string
}

export interface IMain {
    page: string
}

export interface IPopUp {
    show: boolean,
    translateJson: object,
    availableLanguages: string[]
}

export interface ISearchbar  {
    searchTerm: string,
    reSearch: boolean
}

export interface ISearchResult {
    code: string
    highlight: IHighlight,
    text: string
}

export interface IHighlight {
    text: string,
    synonyms: string[],
    inclusions: string[]
}

export interface IParamTypes {
    language: string,
    catalog: string,
    resource_type: string,
    code: string
}

export interface IParamTypesVersionized extends IParamTypes {
    version: string
}

export interface IVersionizedCode {
    key: string,
    title: string,
    text: string,
    attributes: string[],
    parents: string[]
}
