export interface DepartmentInterface {
    id: string;
    name: string;
    provinces: ProvinceInterface[];
}

export interface ProvinceInterface {
    id: string;
    name: string;
    department_id: string;
    districts: DistrictInterface[];
}

export interface DistrictInterface {
    id: string;
    name: string;
    department_id: string;
    province_id: string;
}
