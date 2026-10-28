import CakeBanner from "./cakeBanner/CakeBanner";
import Category from "./category/Category";
import HotDeals from "./hotDeals/HotDeals";
import PopularCategories from "./popularCategories/PopularCategories";

const Home = () => {
    return (
        <div>
            <CakeBanner />
            <Category />
            <HotDeals />
            <PopularCategories />
        </div>
    );
};

export default Home;
