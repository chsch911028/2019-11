import { getManager, EntityRepository, EntityManager, MoreThanOrEqual} from 'typeorm';
import { AuctionLogs } from '../models/AuctionLogs';
import { Products } from '../models/Products';
import { prevDay } from '../util/DateUtils';

@EntityRepository()
export class LogReporsitory {
  constructor(private readonly em: EntityManager) {}

  public find() {
    return this.em.find(AuctionLogs);
  }

  public findOne(id: number) {
    return this.em.findOne(AuctionLogs, id);
  }

  public findBuyLogs(user_id : number,dayago:number,page:number,limit:number) {

    return this.em.findAndCount(AuctionLogs,{
      relations:["product","user"],
      where:{
          user:{id: user_id},
          isWinning:true,
          auctionDate: MoreThanOrEqual(prevDay(dayago))
      },
      order: {
        auctionDate: "DESC"
      },
      skip: (page-1)*limit,
      take: limit,
      cache: true
    });
  }

  public async findSaleLogs(user_id : number,dayago:number,page:number,limit:number) {
    // user / product/ auctionlogs
    let result = await this.em.query("select * from products as p join auction_logs as a on p.id=a.product_id where is_winning=true and p.user_id=? and a.auction_date>=? order by a.auction_date desc limit ?,?",[user_id,prevDay(dayago),(page-1)*limit,limit]);
    let count = await this.em.query("select count(*) as count from products as p join auction_logs as a on p.id=a.product_id where is_winning=true and p.user_id=? and a.auction_date>=?",[user_id,prevDay(dayago)]);

    return [result,count[0].count];
    // this.em.query("select count(*) from products as p join auction_logs as a on p.id=a.product_id where is_winning=true and p.user_id=? and a.auction_date>=? order by a.auction_date desc",[user_id,prevDay(dayago)])
  }

  public save(auctionLogs: AuctionLogs) {
    return this.em.save(auctionLogs);
  }
}
