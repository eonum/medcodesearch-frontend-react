export const initialCodeState = {
    attributes: {
        code: "",
        text: "",
        children: null,
        parent: null
    },
    parents: [],
    siblings: [],
}

export const skippableAttributes = [
    "code",
    "text",
    "parent",
    "groups",
    "blocks",
    "terminal",
    "active",
    "version",
    "valid_from",
    "valid_to",
    "children",
    "is_limited"
]
