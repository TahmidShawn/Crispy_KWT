import CakeBanner from "./cakeBanner/CakeBanner";
import Category from "./category/Category";
import HotDeals from "./hotDeals/HotDeals";

const Home = () => {
    return (
        <div>
            <CakeBanner />
            <Category />
            <HotDeals />
        </div>
    );
};

export default Home;
