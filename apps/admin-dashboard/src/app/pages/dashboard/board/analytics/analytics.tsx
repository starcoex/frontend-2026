import SalesCard from './components/sales-card';
import VisitorsCard from './components/visitors-card';
import TrafficSourceCard from './components/traffic-source-card';
import CustomersCard from './components/customers-card';
import BuyersProfileCard from './components/buyers-profile-card';

export const Analytics = () => {
  return (
    <div className="grid auto-rows-auto grid-cols-6 gap-5">
      <div className="col-span-6 xl:col-span-3">
        <SalesCard />
      </div>
      <div className="col-span-6 xl:col-span-3">
        <VisitorsCard />
      </div>
      <div className="col-span-6 lg:col-span-3 xl:col-span-2">
        <TrafficSourceCard />
      </div>
      <div className="col-span-6 lg:col-span-3 xl:col-span-2">
        <CustomersCard />
      </div>
      <div className="col-span-6 lg:col-span-3 xl:col-span-2">
        <BuyersProfileCard />
      </div>
    </div>
  );
};
