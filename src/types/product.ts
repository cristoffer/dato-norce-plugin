
type ManufacturerType = {
  Id: number
  LogoKey: string | null
  LogoPath: string
  Name: string
  PartNo: string
  UniqueName: string
}

type OffhandType = {
  IncomingValue: number
  Info: string | null
  IsActive: boolean
  IsReturnable: boolean
  LastChecked: string | null
  LeadtimeDayCount: number | null
  NextDeliveryDate: string | null
  Value: number
}

type OnHandType = {
  IncomingValue: number
  Info: string | null
  IsActive: boolean
  IsReturnable: boolean
  LastChecked: string | null
  LeadtimeDayCount: number | null
  NextDeliveryDate: string | null
  Value: number
}

type OnHandSupplierType = {
  IncomingValue: number
  Info: string | null
  IsActive: boolean
  IsReturnable: boolean
  LastChecked: string | null
  LeadtimeDayCount: number | null
  NextDeliveryDate: string | null
  Value: number
}

type ProductType = {
  AdditionalImageKeySeed: string
  CampaignImage: string | null
  CategoryId: number
  CategoryIdSeed: string
  EanCode: string | null
  FlagIdSeed: string
  GroupByKey: string
  Id: number
  Image: string | null
  ImageAltText: string | null
  ImageKey: string
  IsBuyable: boolean
  IsDangerousGoods: boolean
  IsRecommendedQuantityFixed: boolean
  IsSubscribable: boolean
  Key: string
  LargeImage: string | null
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
  PriceCatalog: number | null
  PriceIncVat: number
  PriceListId: number
  PriceRecommended: string | null
  PriceStandard: number
  Quantity: number | null
  RecommendedQuantity: number
  SortOrder: number
  StatusId: number
  StockDisplayBreakPoint: string | null
  SubDescription: string
  SubHeader: string
  Synonyms: string | null
  ThumbnailImage: string | null
  Type: number
  UniqueName: string
  UnitOfMeasurement: string
  UnitOfMeasurementCount:number
  Updated: string | null
  VariantFlagIdSeed:null
  VariantImageAltText: string | null
  VariantImageKey: string | null
  VariantName: string | null
  VariantParametricSeed: string | string
  VariantUniqueName: string | null
  VatRate: number
}

export default ProductType