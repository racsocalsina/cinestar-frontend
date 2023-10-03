export interface ClaimParametersInterface {
    types: Type[];
    identification_types: IdentificationType[];
    older_list: OlderList[];
}

interface Type {
    id: number;
    name: string;
    description: string;
}

interface IdentificationType {
    id: number;
    name: string;
}

interface OlderList {
    id: number;
    name: string;
}
