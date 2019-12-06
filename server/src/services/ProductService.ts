import { Users } from "./../models/Users"
import { Products } from "./../models/Products"
import { BidRepository } from "./../repositories/BidRepository"
import { BidResponseDTO } from "./../dto/BidResponseDTO"
import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"
import { ProductRepository } from "../repositories/ProductRepository"
import { ImageRepository } from "../repositories/ImageRepository"
import { ProductResponseDTO } from "../dto/ProductResponseDTO"
import { UserResponseDTO } from "../dto/UserResponseDTO"
import { ImageResponseDTO } from "../dto/ImageResponseDTO"

@Service()
export class ProductsService {
  constructor(
    @InjectRepository() private readonly productRepository: ProductRepository,
    @InjectRepository() private readonly imageRepository: ImageRepository,
    @InjectRepository() private readonly bidRepository: BidRepository
  ) {}

  public async find(start?: number, limit?: number) {
    return this.productRepository.find(start, limit)
  }

  public async findOne(productId: number) {
    const product = await this.productRepository.findOne(productId)
    if (product) {
      const userResponse = new UserResponseDTO()
      userResponse.email = product.seller.email
      userResponse.mannerPoint = product.seller.mannerPoint
      userResponse.name = product.seller.name
      userResponse.profileUrl = product.seller.profileUrl

      const imageListResponse = product.images.map(image => {
        const imageRespone = new ImageResponseDTO()
        imageRespone.id = image.id
        imageRespone.imageUrl = image.imageUrl
        return imageRespone
      })

      const bids = await this.bidRepository.findByProductId(product.id)
      console.log(bids)

      const bidListResponse =
        product.bids &&
        product.bids.map(bid => {
          const bidResponseDTO = new BidResponseDTO()
          bidResponseDTO.bidDate = bid.bidDate
          bidResponseDTO.bidPrice = bid.bidPrice
          bidResponseDTO.id = bid.id
          bidResponseDTO.user = bid.user
          return bidResponseDTO
        })

      const productResponse = new ProductResponseDTO()
      productResponse.auctionDeadline = product.auctionDeadline
      productResponse.bids = product.bids
      productResponse.buyerId = product.buyerId
      productResponse.categoryCode = product.categoryCode
      productResponse.contents = product.contents
      productResponse.extensionDate = product.extensionDate
      productResponse.hopePrice = product.hopePrice
      productResponse.id = product.id
      productResponse.immediatePrice = product.immediatePrice
      productResponse.isAuction = product.isAuction
      productResponse.registerDate = product.registerDate
      productResponse.soldDate = product.soldDate
      productResponse.soldPrice = product.soldPrice
      productResponse.startBidPrice = product.startBidPrice
      productResponse.title = product.title
      productResponse.thumbnailUrl = product.thumbnailUrl

      productResponse.seller = userResponse
      productResponse.images = imageListResponse
      productResponse.bids = bidListResponse

      return productResponse
    }
  }

  /** Post */
  public async getOwnSale(userId: number, page: number, limits: number) {
    return await this.productRepository.onlyOwnSale(userId, page, limits)
  }

  public update(productId: number, soldPrice: number, soldDate: string, buyerId: number) {
    const product = new Products()
    product.id = productId
    product.soldPrice = soldPrice
    product.soldDate = soldDate
    product.buyerId = buyerId

    return this.productRepository.update(product)
  }

  /** PUT */
  public async create(
    userId: number,
    title: string,
    contents: string,
    images: string[],
    nowPrice: number,
    hopePrice: number,
    minPrice: number,
    registerDate: string,
    deadline: string,
    thumbnail: string,
    category: number,
    isAuction: boolean
  ) {
    const product = await this.productRepository.create(
      userId,
      title,
      contents,
      nowPrice,
      hopePrice,
      minPrice,
      registerDate,
      deadline,
      thumbnail,
      category,
      isAuction
    )

    const image = await this.imageRepository.create(product.id, images)

    return product.id
  }
}
