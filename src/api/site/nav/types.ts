export interface addNavigationData {
  host_domain: string
  host_port?: number
  is_https?: string
  nav_out_style?: string
  nav_page_template?: string
  nav_delay_seconds?: number
  nav_selection_algorithm?: string
  parent_host_domain?: string
  target_url?: string
}

export interface IDelNavigationConfigQueryParams {
  manageSiteId: string
  hostDomain: string
}

export interface editNavigationData {
  host_domain: string
  host_port?: number
  is_https?: string
  nav_out_style?: string
  nav_page_template?: string
  nav_delay_seconds?: number
  nav_selection_algorithm?: string
  parent_host_domain?: string
  target_url?: string
}

export interface IFetchDomainListQueryParams {
  hostDomain?: string
}

export interface IQueryTemplatesQueryParams {
  navOutStyle: string
  navPageTemplate: string
}

export interface NavigationTableData {
  host_domain: string
  host_port?: number
  is_https?: string
  nav_out_style?: string
  nav_page_template?: string
  nav_delay_seconds?: number
  nav_selection_algorithm?: string
  parent_host_domain?: string
  target_url?: string
}

type SortOrder = 'ASC' | 'DESC'

export interface NavigationPartPaginationParameters {
  page: number
  size: number
  sortName?: string // 排序字段
  sortOrder?: SortOrder // 排序顺序
  host_domain?: string // 域名地址
  nav_out_style?: string // 导航方式
  nav_page_template?: string // 导航页模版
}

export interface IQueryUrlsQueryParams {
  targetUrl: string
}

export interface IReqNavigationConfigData {}
export interface IAddNavigationConfigData {}
export interface IEditNavigationConfigData {}
export interface IFetchTreeListData {}
export interface IFetchTreeListByPageData {}
export interface IResponseQueryParams {}
export interface IFetchTreeListByPageQueryParams {
  manageSiteId: string
}
export interface IReqNavigationConfigQueryParams {}
export interface IAddNavigationConfigQueryParams {}
export interface IEditNavigationConfigQueryParams {}
export interface IFetchTreeListQueryParams {}
