
type ManufacturerType = {
  Id: number
  LogoKey: null
  LogoPath: string
  Name: string
  PartNo: string
  UniqueName: string
}

type OffhandType = {
  IncomingValue: number
  Info: null
  IsActive: boolean
  IsReturnable: boolean
  LastChecked: null
  LeadtimeDayCount: null
  NextDeliveryDate: null
  Value: number
}

type OnHandType = {
  IncomingValue: number
  Info: null
  IsActive: boolean
  IsReturnable: boolean
  LastChecked: null
  LeadtimeDayCount: null
  NextDeliveryDate: null
  Value: number
}

type OnHandSupplierType = {
  IncomingValue: number
  Info: null
  IsActive: boolean
  IsReturnable: boolean
  LastChecked: null
  LeadtimeDayCount: null
  NextDeliveryDate: null
  Value: number
}

type ProductType = {
  AdditionalImageKeySeed: string
  CampaignImage:null
  CategoryId: number
  CategoryIdSeed: string
  EanCode:null
  FlagIdSeed: string
  GroupByKey: string
  Id: number
  Image:null
  ImageAltText:null
  ImageKey: string
  IsBuyable: boolean
  IsDangerousGoods:boolean
  IsRecommendedQuantityFixed:boolean
  IsSubscribable:boolean
  Key: string
  LargeImage:null
  Manufacturer: ManufacturerType    
  Name: string
  OnHand: OffhandType
  OnHandStore: OnHandType
  OnHandSupplier: OnHandSupplierType
  ParametricListSeed: string
  ParametricMultipleSeed: string
  ParametricTextField: Array<any>
  ParametricValueSeed: string
  PartNo: string
  PopularityRank: number
  Price: number
  PriceCatalog:null
  PriceIncVat: number
  PriceListId: number
  PriceRecommended:null
  PriceStandard: number
  Quantity:null
  RecommendedQuantity: number
  SortOrder: number
  StatusId: number
  StockDisplayBreakPoint:null
  SubDescription: string
  SubHeader: string
  Synonyms:null
  ThumbnailImage:null
  Type: number
  UniqueName: string
  UnitOfMeasurement: string
  UnitOfMeasurementCount:number
  Updated:null
  VariantFlagIdSeed:null
  VariantImageAltText:null
  VariantImageKey:null
  VariantName:null
  VariantParametricSeed: string
  VariantUniqueName:null
  VatRate: number
}

export default ProductType